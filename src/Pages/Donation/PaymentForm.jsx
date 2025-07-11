import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";

const PaymentForm = ({ id }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const axiosSecure = useAxiosSecure();
  const { user } = useContext(FirebaseAuthContext);

  const { data: donationInfo = {}, isPending } = useQuery({
    queryKey: ["donationPetDb", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donationPetDb/${id}`);
      return res.data;
    },
  });
  console.log(donationInfo)

  if (isPending) {
    return <span>Loading...</span>;
  }

  const amountInCents = amount * 100;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card || !amount) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setError(error.message);
    } else {
      setError("");
      console.log("[PaymentMethod]", paymentMethod);
    }

    const res = await axiosSecure.post("/create-payment-intent", {
      amountInCents,
      id,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setError("");
        console.log("payment succeeded !");
        console.log(result);

        // Save to database
        const paymentData = {
          campaignId: id,
          donorEmail: user.email,
          donorName: user.displayName,
          amount: amountInCents,
          transactionId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types[0],
          date: new Date().toISOString(),
        };

        try {
          const saveRes = await axiosSecure.post("/donation", paymentData);
          console.log("Saved to DB:", saveRes.data);

          // ✅ SweetAlert success popup
          Swal.fire({
            title: "Donation Successful!",
            text: "Thank you for your generous donation 🐾",
            icon: "success",
            confirmButtonText: "Awesome!",
          });
        } catch (err) {
          console.error("Failed to save to DB:", err);
          Swal.fire({
            title: "Saved Failed!",
            text: "Payment was processed but failed to store in DB.",
            icon: "error",
          });
        }
      }
    }

    console.log("res from intent ", res);
  };

  return (
    <div className="border-1 border-gray-300 rounded-2xl w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto"
      >
        <h3 className="text-xl font-semibold text-gray-800 text-center">
          Enter Payment Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donation Amount ($)
          </label>
          <input
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter amount (e.g., 25)"
          />
        </div>

        <div className="p-4 border border-gray-300 rounded-xl bg-gray-50 shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  fontFamily: "monospace, sans-serif",
                  "::placeholder": {
                    color: "#a0aec0",
                  },
                },
                invalid: {
                  color: "#e53e3e",
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Donate Now {amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
