import React from "react";
import { useApp } from "../contexts/AppContext";
import Button from "./ui/Button";
import {
  Award,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Star,
} from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";

const BecomeCreator: React.FC = () => {
  const { navigateTo, addNotification, stats } = useApp();
  const { isConnected, status } = useAppKitAccount();

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Revenue",
      description:
        "Set your own course prices and earn directly from student enrollments",
    },
    {
      icon: Users,
      title: "Build Community",
      description:
        "Connect with learners worldwide and build your educational brand",
    },
    {
      icon: Award,
      title: "Issue NFT Certificates",
      description:
        "Provide blockchain-verified certificates that students can showcase",
    },
    {
      icon: TrendingUp,
      title: "Track Performance",
      description:
        "Access detailed analytics on course performance and student engagement",
    },
  ];

  const features = [
    "Easy course creation tools",
    "Multiple content formats (video, text, images)",
    "Interactive quizzes and assessments",
    "AI-powered student assistance",
    "Blockchain certificate generation",
    "Revenue sharing and analytics",
    "Community building features",
    "Mobile-responsive platform",
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Marketing Manager",
      avatar_url: "/images/placeholder.png",
      content:
        "Wiza transformed my career. The NFT certificates are recognized by employers worldwide and helped me land my dream job.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Developer",
      avatar_url:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
      content:
        "The courses are practical and up-to-date. I landed my dream job in tech after completing 3 courses.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      avatar_url:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      content:
        "The quality of education here is unmatched. The blockchain certificates add real value to my professional portfolio.",
      rating: 5,
    },
  ];

  const handleBecomeCreator = async () => {
    if (!isConnected) {
      addNotification({
        type: "warning",
        title: "Wallet Required",
        message: "Please connect your wallet to become a creator",
      });
      return;
    }

    navigateTo("/app/creator-onboarding");
  };

  return (
    <section
      className="py-16 bg-cyber-dark relative overflow-hidden"
      id="creators"
    >
      {/* Cyber background effects */}
      <div className="absolute inset-0 data-visualization opacity-30"></div>
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-secondary/30 to-transparent data-stream"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-primary/30 to-transparent data-stream delay-1500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Cyber Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 cyber-badge text-sm font-medium mb-6 cyber-glow">
            <Zap className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
            <span className="neon-text-cyan">Join {stats.totalCreators}+ Creators</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cyber">
            <span className="neon-text-cyan">Become a</span> <span className="holographic">Creator</span>
          </h2>

          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Share your <span className="text-cyber-primary font-semibold">expertise</span>, build a community, and earn <span className="text-cyber-accent font-semibold">KAIA revenue</span> while
            helping others learn new skills. Create courses that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBecomeCreator}
              disabled={status === "connecting"}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center">
                {status === "connecting" ? (
                  <>
                    <div className="cyber-spinner mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    {isConnected ? "Start Creating" : "Connect Wallet to Start"}
                  </>
                )}
              </span>
            </button>

            <button
              onClick={() => navigateTo("/demo")}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
            >
              Watch Demo
            </button>
          </div>
        </div>
        {/* Cyber Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="cyber-card p-6 border-cyber hover:cyber-glow hover:scale-105 transition-all duration-300 group"
            >
              <div className="p-3 cyber-card rounded-lg w-fit mb-4 border-cyber group-hover:cyber-glow-purple transition-all duration-300">
                <benefit.icon className="h-6 w-6 text-cyber-primary group-hover:animate-cyber-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-cyber group-hover:text-cyber-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-cyan-100 text-sm group-hover:text-white transition-colors">{benefit.description}</p>
            </div>
          ))}
        </div>
        {/* Cyber Features and Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Cyber Features */}
          <div className="cyber-card p-8 border-cyber hover:cyber-glow transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6 font-cyber">
              <span className="neon-text-cyan">Everything you need</span> to <span className="text-cyber-accent">succeed</span>
            </h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <CheckCircle className="h-5 w-5 text-cyber-accent flex-shrink-0 group-hover:animate-cyber-pulse" />
                  <span className="text-cyan-100 group-hover:text-white transition-colors font-cyber">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cyber Testimonials */}
          <div className="cyber-card p-8 border-cyber hover:cyber-glow transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6 font-cyber">
              <span className="neon-text-cyan">What creators</span> are <span className="text-cyber-secondary">saying</span>
            </h3>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="cyber-card p-6 border-cyber hover:cyber-glow-green transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyber-primary/50 group-hover:border-cyber-primary transition-colors"
                    />
                    <div>
                      <h4 className="font-semibold text-white font-cyber group-hover:text-cyber-primary transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-cyber-muted">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-neon-orange fill-current group-hover:animate-cyber-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-cyber-accent">
                        {testimonial.rating} of 5
                      </p>
                    </div>
                  </div>
                  <p className="text-cyan-100 text-sm italic group-hover:text-white transition-colors">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeCreator;
