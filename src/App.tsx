import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import DailySchedule from "@/pages/daily-schedule";
import Calendar from "@/pages/calendar";
import LeaveRequests from "@/pages/leave-requests";
import AnnualLeavePage from "@/pages/annual-leave";
import ShiftChanges from "@/pages/shift-changes";
import Employees from "@/pages/employees";
import Departments from "@/pages/departments";
import CallTree from "@/pages/call-tree";
import UserPermissions from "@/pages/user-permissions";
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header-neumorphic";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ComponentType<{ error: Error }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

function Router() {
  const [location] = useLocation();
  
  const getPageTitle = () => {
    const pageTitles = {
      "/": "dashboard",
      "/daily-schedule": "daily-schedule",
      "/calendar": "calendar",
      "/leave-requests": "leave-requests",
      "/annual-leave": "annual-leave",
      "/shift-changes": "shift-changes",
      "/employees": "employees",
      "/call-tree": "call-tree",
      "/reports": "reports",
      "/departments": "departments",
      "/user-permissions": "user-permissions"
    };
    return pageTitles[location as keyof typeof pageTitles] || "dashboard";
  };

  return (
    <div className="flex h-screen bg-[#e0e5ec]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#e0e5ec]">
          <ErrorBoundary fallback={ErrorFallback}>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/daily-schedule" component={DailySchedule} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/leave-requests" component={LeaveRequests} />
              <Route path="/annual-leave" component={AnnualLeavePage} />
              <Route path="/shift-changes" component={ShiftChanges} />
              <Route path="/employees" component={Employees} />
              <Route path="/call-tree" component={CallTree} />
              <Route path="/reports" component={Reports} />
              <Route path="/departments" component={Departments} />
              <Route path="/user-permissions" component={UserPermissions} />
              <Route component={NotFound} />
            </Switch>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
