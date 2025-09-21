import React, { useEffect, useState } from "react";
import { ExternalLink, Play, ArrowRight, Home, Clock } from "lucide-react";
import { useApp } from "../contexts/AppContext";

const Demo: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const youtubeUrl = "https://youtu.be/jxu18EjBiDs";

  const handleRedirect = () => {
    setIsRedirecting(true);
    window.open(youtubeUrl, "_blank");
  };

  const handleAutoRedirect = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.open(youtubeUrl, "_self");
    }, 1000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Navigation */}
        <div className="absolute top-8 left-8">
          <button
            onClick={() => navigateTo("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg transition-colors border border-gray-200"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6">
              <Play className="w-12 h-12 text-white ml-1" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎥 Liven Platform Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience the future of Web3 education in action
            </p>
          </div>

          {!isRedirecting ? (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-800">
                    Redirecting in {countdown} seconds...
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  ></div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                      1
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      Smart Contracts
                    </h3>
                    <p className="text-sm text-gray-600">
                      See on-chain credential issuance
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                      2
                    </div>
                    <h3 className="font-semibold text-gray-800">AI Learning</h3>
                    <p className="text-sm text-gray-600">
                      Experience personalized education
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                      3
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      Creator Tools
                    </h3>
                    <p className="text-sm text-gray-600">
                      Explore monetization features
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRedirect}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                >
                  <Play className="w-6 h-6" />
                  Watch Demo Now
                  <ExternalLink className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setCountdown(999)}
                  className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors font-semibold text-lg"
                >
                  Cancel Auto-Redirect
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Opening Demo Video...
              </h2>
              <p className="text-gray-600">
                The Liven platform demo is opening in a new tab. If it doesn't
                open automatically, please check your popup blocker settings.
              </p>
              <button
                onClick={handleRedirect}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Open Demo Manually
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Live Platform Demo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Smart Contract Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>AI Assistant Features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Creator Monetization</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Having issues?{" "}
            <a
              href="devarogundade@gmail.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
