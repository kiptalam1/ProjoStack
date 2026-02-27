import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, } from 'react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./auth/AuthProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient} >
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
