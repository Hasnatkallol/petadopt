import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { router } from "./Router/Router.jsx";
import { RouterProvider } from "react-router";
import FirebaseProvider from "./Firebase/FirebaseProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="urbanist max-w-7xl mx-auto">
      <QueryClientProvider client={queryClient}>
        <FirebaseProvider>
          <RouterProvider router={router} />
        </FirebaseProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
