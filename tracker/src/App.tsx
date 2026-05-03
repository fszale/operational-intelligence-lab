import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Setup from "@/pages/setup";
import CheckIn from "@/pages/checkin";
import Dashboard from "@/pages/dashboard";
import Methodology from "@/pages/methodology";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/setup" component={Setup} />
        <Route path="/setup/:id" component={Setup} />
        <Route path="/checkin/:id" component={CheckIn} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/:id" component={Dashboard} />
        <Route path="/methodology" component={Methodology} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
