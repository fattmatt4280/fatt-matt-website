import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlackGreyPortfolio from "./pages/BlackGreyPortfolio";
import ColorworkPortfolio from "./pages/ColorworkPortfolio";
import PortraitsPortfolio from "./pages/PortraitsPortfolio";
import CoverUpsPortfolio from "./pages/CoverUpsPortfolio";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/portfolio/black-grey" element={<BlackGreyPortfolio />} />
        <Route path="/portfolio/colorwork" element={<ColorworkPortfolio />} />
        <Route path="/portfolio/portraits" element={<PortraitsPortfolio />} />
        <Route path="/portfolio/cover-ups" element={<CoverUpsPortfolio />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
