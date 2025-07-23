import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";

const PaymentForm = ({ id, petName, petImage }) => {
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

  if (isPending) {
    return <span>Loading...</span>;
  }

  const TK_TO_USD_RATE = 1 / 100; // 100 Tk = 1 USD

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card || !amount) return;

    // Validate amount is a positive number
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid donation amount in Tk.");
      return;
    }

    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      return;
    } else {
      setError("");
    }

    // Convert Tk to USD cents for Stripe
    const amountInCents = Math.round(parsedAmount * TK_TO_USD_RATE * 100);
    console.log("Amount in Tk:", parsedAmount, "Amount in cents for Stripe:", amountInCents);

    try {
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
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        setError("");

        const paymentData = {
          campaignId: id,
          petName,
          petImage,
          donorEmail: user.email,
          donorName: user.displayName,
          amount: parsedAmount, // Store amount in Tk (number)
          transactionId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types[0],
          date: new Date().toISOString(),
        };

        try {
          const saveRes = await axiosSecure.post("/donation", paymentData);
          console.log("Saved to DB:", saveRes.data);

          Swal.fire({
            title: "Donation Successful!",
            text: "Thank you for your generous donation 🐾",
            icon: "success",
            confirmButtonText: "Awesome!",
          });

          // Optionally reset the form
          setAmount("");
          elements.getElement(CardElement).clear();
        } catch (err) {
          console.error(
            "Failed to save to DB:",
            err.response ? err.response.data : err.message
          );
          Swal.fire({
            title: "Save Failed!",
            text: "Payment was processed but failed to store in database.",
            icon: "error",
          });
        }
      }
    } catch (err) {
      console.error("Payment processing failed:", err);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="border-1 border-gray-300 rounded-2xl w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto"
      >
        <h3 className="text-xl font-semibold text-gray-800 text-center">
          Enter Payment Details (Amount in Tk)
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donation Amount (Tk)
          </label>
          <input
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter amount in Tk (e.g., 2500)"
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
          Donate Now {amount} Tk
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
