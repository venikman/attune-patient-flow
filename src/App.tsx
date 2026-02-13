import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import PatientPanel from "./pages/PatientPanel";
import MemberDetail from "./pages/MemberDetail";
import RosterPassport from "./pages/RosterPassport";
import DeltaLedger from "./pages/DeltaLedger";
import BundleCard from "./pages/BundleCard";
import ParetoPlanner from "./pages/ParetoPlanner";
import NqdMap from "./pages/NqdMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patients" element={<PatientPanel />} />
            <Route path="/patients/:id" element={<MemberDetail />} />
            <Route path="/roster-passport" element={<RosterPassport />} />
            <Route path="/delta-ledger" element={<DeltaLedger />} />
            <Route path="/bundle-card" element={<BundleCard />} />
            <Route path="/pareto-planner" element={<ParetoPlanner />} />
            <Route path="/nqd-map" element={<NqdMap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
