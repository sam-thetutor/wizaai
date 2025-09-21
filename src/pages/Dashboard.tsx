import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppKit } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useApp } from "../contexts/AppContext";
import Button from "../components/ui/Button";
import CoursesPage from "./CoursesPage";
import CreatorsPage from "./CreatorsPage";
import OverviewPage from "./OverviewPage";
import ContentsPage from "./ContentsPage";
import WalletPage from "./WalletPage";
import SettingsPage from "./SettingsPage";
import {
  Menu,
  X,
  Home,
  Settings,
  Wallet,
  FileText,
  BookOpen,
  Users,
  Users2,
  ChevronLeft,
  ChevronRight,
  PlayIcon,
} from "lucide-react";
import { useWeb3 } from "../hooks/useWeb3";
import CourseCreation from "./CourseCreation";
import CourseLearning from "./CourseLearning";
import CreatorOnboarding from "./CreatorOnboarding";

const Dashboard: React.FC = () => {
  useWeb3();

  const { state, fetchEnrolledCourses } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarItems = [
    { path: "/app/courses", label: "Courses", icon: BookOpen },
    { path: "/app/creators", label: "Creators", icon: Users },
  ];

  if (!state.user?.address) {
    sidebarItems.push({
      path: "/app/creator-onboarding",
      label: "Become A Creator",
      icon: PlayIcon,
    });
  }

  const myStudioItems = [
    { path: "/app/overview", label: "Overview", icon: Home },
    { path: "/app/contents", label: "Contents", icon: FileText },
    { path: "/app/wallet", label: "Wallet", icon: Wallet },
    { path: "/app/settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    if (address) fetchEnrolledCourses(address);
  }, [address]);

  useEffect(() => {
    if (!state.user) {
      sidebarItems.push({
        path: "/app/creator-onboarding",
        label: "Become A Creator",
        icon: Users2,
      });
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false);
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderSidebar = () => {
    const sidebarWidth = sidebarCollapsed ? "w-20" : "w-64";

    return (
      <div
        className={`fixed inset-y-0 left-0 z-50 ${sidebarWidth} cyber-card border-r border-cyber backdrop-blur-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } relative overflow-hidden`}
      >
        {/* Cyber Sidebar Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/95 via-cyber-dark/90 to-cyber-dark/95"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-cyber h-[90px] max-h-[90px]">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
           
            {!sidebarCollapsed && (
              <div className="transition-opacity duration-200">
                <h1 className="text-xl font-bold text-cyber-primary font-cyber neon-text-cyan">Wiza</h1>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Collapse Toggle - Desktop Only */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 rounded-lg cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary transition-all duration-300"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 animate-cyber-pulse" />
              ) : (
                <ChevronLeft className="h-4 w-4 animate-cyber-pulse" />
              )}
            </button>
            {/* Close Button - Mobile Only */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary transition-all duration-300"
            >
              <X className="h-5 w-5 animate-cyber-pulse" />
            </button>
          </div>
        </div>

        <nav className="relative z-10 flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {/* Main Navigation */}
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center ${
                sidebarCollapsed ? "justify-center px-2" : "space-x-3 px-4"
              } py-3 rounded-lg transition-all duration-300 group relative ${
                location.pathname === item.path
                  ? "cyber-card border-cyber cyber-glow text-cyber-primary bg-cyber-primary/10"
                  : "text-cyan-100 hover:text-cyber-primary hover:cyber-glow cyber-card border-cyber/30"
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'animate-cyber-pulse' : ''}`} />
              {!sidebarCollapsed && <span className="font-cyber">{item.label}</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 cyber-card border-cyber bg-cyber-dark text-cyber-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-cyber neon-text-cyan">
                  {item.label}
                </div>
              )}
            </button>
          ))}

          {/* My Studio Section - Only for creators */}
          {state.user?.address && (
            <>
              {!sidebarCollapsed && (
                <div className="pt-6 pb-2 transition-opacity duration-200">
                  <div className="px-4 flex items-center space-x-2">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent"></div>
                    <h3 className="text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                      My Studio
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-transparent"></div>
                  </div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="pt-4 border-t border-cyber mt-4"></div>
              )}
              {myStudioItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? "justify-center px-2" : "space-x-3 px-4"
                  } py-3 rounded-lg transition-all duration-300 group relative ${
                    location.pathname === item.path
                      ? "cyber-card border-cyber cyber-glow text-cyber-primary bg-cyber-primary/10"
                      : "text-cyan-100 hover:text-cyber-primary hover:cyber-glow cyber-card border-cyber/30"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'animate-cyber-pulse' : ''}`} />
                  {!sidebarCollapsed && <span className="font-cyber">{item.label}</span>}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 cyber-card border-cyber bg-cyber-dark text-cyber-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-cyber neon-text-cyan">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </>
          )}
        </nav>
      </div>
    );
  };

  const getPageTitle = () => {
    if (location.pathname === "/app/courses") return "Courses";
    if (location.pathname === "/app/creators") return "Creators";
    if (location.pathname === "/app/overview") return "Overview";
    if (location.pathname === "/app/contents") return "Contents";
    if (location.pathname === "/app/wallet") return "Wallet";
    if (location.pathname === "/app/settings") return "Settings";
    if (location.pathname === "/app/create") return "Create course";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden flex scroll-smooth">
      {/* Cyber Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-dark/95 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyber-primary/20 rounded-full blur-3xl animate-cyber-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl animate-quantum-float"></div>
      </div>
      
      {/* Sidebar */}
      {renderSidebar()}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 overflow-hidden relative">
        {/* Cyber Top Bar */}
        <div className="cyber-card border-b border-cyber backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4 sticky top-0 h-[90px] max-h-[90px] relative overflow-hidden z-40">
          {/* Cyber Top Bar Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/95 via-cyber-dark/90 to-cyber-dark/95"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary transition-all duration-300"
              >
                <Menu className="h-5 w-5 animate-cyber-pulse" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white font-cyber neon-text-cyan">
                  {getPageTitle()}
                </h1>
                {isConnected && state.user && (
                  <p className="text-cyan-100">
                    Welcome back, <span className="text-cyber-primary font-semibold">{state.user.name}</span>!
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300 font-cyber"
              >
                <Home className="h-4 w-4 animate-cyber-pulse" />
                <span className="neon-text-cyan">Homepage</span>
              </button>
              {!isConnected && (
                <button
                  onClick={() => open()}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="relative z-10 overflow-y-auto max-h-[calc(100vh - 80px)]">
          <Routes>
            <Route path="/" element={<Navigate to="/app/courses" replace />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/contents" element={<ContentsPage />} />
            <Route path="/create" element={<CourseCreation />} />
            <Route path="/courses/:id" element={<CourseLearning />} />
            <Route path="/creator-onboarding" element={<CreatorOnboarding />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
