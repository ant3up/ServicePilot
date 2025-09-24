import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  FileText, 
  DollarSign, 
  Users, 
  Phone, 
  MessageSquare, 
  Megaphone, 
  Bot, 
  Settings,
  LogOut
} from "lucide-react";

const navigation = [
  {
    name: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Jobs", href: "/jobs", icon: Briefcase },
      { name: "Scheduling", href: "/scheduling", icon: Calendar },
      { name: "Quotes", href: "/quotes", icon: FileText },
      { name: "Invoices", href: "/invoices", icon: DollarSign },
    ],
  },
  {
    name: "AI & Communication",
    items: [
      { name: "AI Agent", href: "/ai-agent", icon: Bot },
      { name: "Call Logs", href: "/call-logs", icon: Phone },
      { name: "Campaigns", href: "/campaigns", icon: Megaphone },
      { name: "Customers", href: "/customers", icon: Users },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-60 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">Call Mate</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((section) => (
          <div key={section.name} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.name}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      )}
                      data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700">
        <Button 
          className="w-full mb-3" 
          size="sm"
          onClick={() => window.location.href = "/jobs"}
          data-testid="button-new-job"
        >
          New Job
        </Button>
        <Link href="/settings">
          <a
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            data-testid="link-settings"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </Link>
        <a
          href="/api/logout"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors mt-2"
          data-testid="link-logout"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </a>
      </div>
    </div>
  );
}
