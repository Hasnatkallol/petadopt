import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { router } from "./Router/Router.jsx";
import { RouterProvider } from "react-router";
import FirebaseProvider from "./Firebase/FirebaseProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./Theme/ThemeContext.jsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <div className="urbanist  mx-auto">
        <QueryClientProvider client={queryClient}>
          <FirebaseProvider>
            <RouterProvider router={router} />
          </FirebaseProvider>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  </StrictMode>
);
