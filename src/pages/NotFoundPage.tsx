import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  Users,
  Zap,
  AlertTriangle,
} from "lucide-react";
import Button from "../components/ui/Button";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: BookOpen,
      label: "Browse Courses",
      description: "Explore our course catalog",
      path: "/app/courses",
    },
    {
      icon: Users,
      label: "Meet Creators",
      description: "Discover expert instructors",
      path: "/app/creators",
    },
    {
      icon: Home,
      label: "Dashboard",
      description: "Go to your dashboard",
      path: "/app/overview",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-purple-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-white rounded-full shadow-lg">
              <AlertTriangle className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back on track with your learning journey!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </Button>

          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Or explore these popular sections:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <link.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{link.label}</h3>
                </div>
                <p className="text-sm text-gray-600">{link.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">
              Looking for something specific?
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Try searching for courses, creators, or topics you're interested in.
          </p>
          <Button
            onClick={() => navigate("/app/courses")}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Search Courses
          </Button>
        </div>

        {/* Brand Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="p-1 rounded bg-purple-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm">Powered by Wiza on Kaia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
