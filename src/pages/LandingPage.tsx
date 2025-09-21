import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../hooks/useSupabase";
import {
  Zap,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  ArrowRight,
  Play,
  Star,
  Shield,
  Globe,
  Rocket,
  Clock,
} from "lucide-react";
import Button from "../components/ui/Button";
import BecomeCreator from "../components/BecomeCreator";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Course } from "../types";
import { useApp } from "../contexts/AppContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useApp();
  const { getCourses } = useSupabase();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const courses = await getCourses(1, 3, { sortBy: "popular" });
        setFeaturedCourses(courses);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCourseClick = (course: Course) => {
    navigate(`/app/courses/${course.id}`);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Learn Any Skill",
      description:
        "Access courses on programming, design, marketing, business, and more from industry experts",
    },
    {
      icon: Award,
      title: "Earn NFT Certificates",
      description:
        "Get blockchain-verified certificates that prove your skills and knowledge",
    },
    {
      icon: Users,
      title: "Join Community",
      description:
        "Connect with learners and creators from around the world in our global community",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your learning journey with detailed analytics and achievements",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />

      {/* Cyber Hero Section */}
      <section className="relative cyber-hero text-white overflow-hidden">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        
        {/* Animated cyber elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyber-primary/20 rounded-full blur-3xl animate-cyber-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyber-secondary/20 rounded-full blur-3xl animate-cyber-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-primary/10 rounded-full blur-2xl animate-ping delay-2000"></div>
          
          {/* Data stream effects */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-primary/50 to-transparent data-stream"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyber-secondary/50 to-transparent data-stream delay-1000"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 cyber-badge text-sm font-medium mb-6 animate-bounce-in delay-300 cyber-glow">
                <Zap className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                <span className="neon-text-cyan">Powered by Kaia</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up delay-500 font-cyber">
                <span className="neon-text-cyan">Learn Anything,</span>
                <br />
                <span className="holographic text-7xl">
                  Earn Certificates
                </span>
              </h1>

              <p className="text-xl text-cyan-100 mb-8 leading-relaxed animate-fade-in-up delay-700 font-cyber">
                The world's first <span className="text-cyber-primary font-semibold neon-text-cyan">decentralized education platform</span> where you
                learn any skill and earn <span className="text-cyber-secondary font-semibold">verifiable NFT certificates</span> on Kaia
                blockchain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-1000">
                <button
                  onClick={() => navigate("/app/courses")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="relative z-10 flex items-center">
                    Launch App
                  </span>
                </button>

                <button
                  onClick={() => navigate("/demo")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                >
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 mt-8 text-cyan-200 animate-fade-in-up delay-1200">
                <div className="flex items-center space-x-1 cyber-badge">
                  <Shield className="h-5 w-5 text-cyber-primary animate-cyber-pulse" />
                  <span className="text-sm">Blockchain Verified</span>
                </div>
                <div className="flex items-center space-x-1 cyber-badge">
                  <Globe className="h-5 w-5 text-cyber-primary animate-cyber-pulse delay-500" />
                  <span className="text-sm">Decentralized</span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-right delay-800 quantum-float">
              <div className="relative cyber-card p-0 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Students learning online"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 via-transparent to-cyber-secondary/40 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyber-dark/60 rounded-2xl"></div>
                
                {/* Cyber overlay effects */}
                <div className="absolute inset-0 hologram-effect rounded-2xl"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-cyber-primary/50 rounded-full flex items-center justify-center cyber-glow">
                  <div className="w-8 h-8 bg-cyber-primary/80 rounded-full animate-cyber-pulse"></div>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="cyber-card p-4 border-cyber">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                          <span className="font-medium text-cyber-primary">
                            {stats.totalCourses.toLocaleString()}+ Courses
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-neon-blue animate-cyber-pulse delay-200" />
                          <span className="font-medium text-cyan-200">
                            {stats.totalStudents}+ Students
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-neon-orange animate-cyber-pulse delay-400" />
                        <span className="font-medium text-amber-300">
                          NFT Certificates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-cyber-darker relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-cyber">
              <span className="neon-text-cyan">Featured</span> <span className="holographic">Courses</span>
            </h2>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Start your learning journey with our most popular courses taught
              by <span className="text-cyber-primary font-semibold">industry experts</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className={`cyber-course-card cursor-pointer group animate-fade-in-up delay-${
                  (index + 1) * 200
                }`}
              >
                {/* Course Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.level === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : course.level === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="cyber-badge text-xs font-medium">
                      {course.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-neon-orange fill-current animate-cyber-pulse" />
                      <span className="text-sm text-cyber-primary font-medium">
                        {course.rating?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-cyber-primary transition-colors h-24 font-cyber">
                    {course.title}
                  </h3>

                  <p className="text-sm mb-4 line-clamp-2 text-cyan-100">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={course.user?.avatarUrl}
                        alt={course.user?.name}
                        className="w-6 h-6 rounded-full object-cover border-2 border-cyber-primary/50"
                      />
                      <span className="text-sm text-cyan-200">
                        {course.user?.name || `User ${course.user?.address}`}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyber-primary neon-text-cyan">
                        {course.price} KAIA
                      </div>
                      <div className="text-xs text-cyber-muted">
                        {course.totalStudents} students
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/app/courses")}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center">
                View All Courses
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cyber-dark relative" id="features">
        {/* Circuit pattern background */}
        <div className="absolute inset-0 circuit-lines opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-cyber">
              Why Choose <span className="holographic">Wiza</span>?
            </h2>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Experience the <span className="text-cyber-primary font-semibold neon-text-cyan">future of education</span> with blockchain-verified
              learning, NFT certificates, and a global community of learners and
              educators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`text-center group animate-fade-in-up delay-${
                  (index + 1) * 200
                } hover:transform hover:scale-105 transition-all duration-300`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 cyber-card rounded-2xl mb-6 group-hover:cyber-glow transition-all duration-300 border-cyber">
                  <feature.icon className="h-8 w-8 text-cyber-primary group-hover:animate-cyber-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 font-cyber group-hover:text-cyber-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-cyan-100 leading-relaxed group-hover:text-white transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-cyber-dark relative">
        {/* Data visualization background */}
        <div className="absolute inset-0 data-visualization opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-cyber">
              <span className="neon-text-cyan">How It</span> <span className="holographic">Works</span>
            </h2>
            <p className="text-xl text-cyan-100">
              Start your learning journey in <span className="text-cyber-primary font-semibold">three simple steps</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up delay-200 hover:transform hover:scale-105 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 cyber-card text-cyber-primary rounded-2xl text-xl font-bold mb-6 border-cyber group-hover:cyber-glow transition-all duration-300">
                <span className="neon-text-cyan">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-cyber group-hover:text-cyber-primary transition-colors">
                Connect Wallet
              </h3>
              <p className="text-cyan-100 group-hover:text-white transition-colors">
                Connect your <span className="text-cyber-primary font-semibold">Web3 wallet</span> to access courses and track your progress on
                the blockchain.
              </p>
            </div>

            <div className="text-center animate-fade-in-up delay-400 hover:transform hover:scale-105 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 cyber-card text-cyber-primary rounded-2xl text-xl font-bold mb-6 border-cyber group-hover:cyber-glow transition-all duration-300">
                <span className="neon-text-cyan">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-cyber group-hover:text-cyber-primary transition-colors">
                Learn & Complete
              </h3>
              <p className="text-cyan-100 group-hover:text-white transition-colors">
                Enroll in courses, complete modules, and pass <span className="text-cyber-secondary font-semibold">AI-powered quizzes</span> to
                demonstrate your knowledge.
              </p>
            </div>

            <div className="text-center animate-fade-in-up delay-600 hover:transform hover:scale-105 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 cyber-card text-cyber-primary rounded-2xl text-xl font-bold mb-6 border-cyber group-hover:cyber-glow transition-all duration-300">
                <span className="neon-text-cyan">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-cyber group-hover:text-cyber-primary transition-colors">
                Earn NFT Certificate
              </h3>
              <p className="text-cyan-100 group-hover:text-white transition-colors">
                Mint your <span className="text-cyber-accent font-semibold">blockchain-verified NFT certificate</span> and showcase your
                skills globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become Creator Section */}
      <BecomeCreator />

   

      <Footer />
    </div>
  );
};

export default LandingPage;
