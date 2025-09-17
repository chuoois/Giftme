import { Button } from "@/components/ui/button";
import { BarChart3, Home, Package, FileText, X, LayoutDashboard, Cpu  } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navigationItems = [
    { id: "dashboard", label: "Tổng quan", icon: Home, path: "/admin/dashboard" },
    { id: "combos", label: "Combo", icon: Package, path: "/admin/combos" },
    { id: "news", label: "Tin tức", icon: FileText, path: "/admin/news" },
    { id: "contents", label: "Nội dung", icon: LayoutDashboard, path: "/admin/contents" },
    { id: "bot", label: "Bot", icon: Cpu , path: "/admin/bot" }, 
  ];


  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-[60] w-64 lg:w-64 bg-gradient-to-b from-background to-muted/40 border-r
        backdrop-blur-md shadow-lg transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.id} to={item.path} onClick={() => setSidebarOpen(false)}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-2 rounded-xl transition-all ${isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted/60 hover:text-foreground"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};