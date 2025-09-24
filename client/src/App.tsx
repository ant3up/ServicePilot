import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Jobs from "@/pages/jobs";
import Scheduling from "@/pages/scheduling";
import Quotes from "@/pages/quotes";
import Invoices from "@/pages/invoices";
import Customers from "@/pages/customers";
import CallLogs from "@/pages/call-logs";
import Campaigns from "@/pages/campaigns";
import AiAgent from "@/pages/ai-agent";
import Settings from "@/pages/settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/scheduling" component={Scheduling} />
          <Route path="/quotes" component={Quotes} />
          <Route path="/invoices" component={Invoices} />
          <Route path="/customers" component={Customers} />
          <Route path="/call-logs" component={CallLogs} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/ai-agent" component={AiAgent} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
