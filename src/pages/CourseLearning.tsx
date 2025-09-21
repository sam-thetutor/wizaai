import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import ModuleViewer from "../components/ModuleViewer";
import QuizComponent from "../components/QuizComponent";
import AIAssistant from "../components/AIAssistant";
import NFTCertificate from "../components/NFTCertificate";
import CourseRating from "../components/CourseRating";
import LeaveConfirmationModal from "../components/LeaveConfirmationModal";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Clock,
  Users,
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Trophy,
  Loader2,
} from "lucide-react";
import { Course } from "../types";

import Header from "../components/Header";
import { useAppKitAccount } from "@reown/appkit/react";
import CourseEnrollmentModal from "../components/CourseEnrollmentModal";
import { Web3Service } from "../services/web3Service";
import { stringToHex } from "viem";

const CourseLearning: React.FC = () => {
  const { addNotification, coursesEnrolled, fetchEnrolledCourses, navigateTo } =
    useApp();
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { address } = useAppKitAccount();
  const { getCourse, completeModule } = useSupabase();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [enrollment, setEnrollment] = useState(
    coursesEnrolled.find((e) => e.course?.id === courseId)
  );

  useEffect(() => {
    setEnrollment(coursesEnrolled.find((e) => e.course?.id === courseId));
  }, [coursesEnrolled]);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;

      setLoading(true);
      try {
        const courseData = await getCourse(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to load course:", error);
        addNotification({
          type: "error",
          title: "Course Not Found",
          message: "Failed to load course data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [enrollment]);

  // Track user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasInteracted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasInteracted]);

  useEffect(() => {
    if (enrollment) {
      setCurrentModuleIndex(enrollment.currentModule || 0);
    }
  }, [enrollment]);

  const handleNavigation = (path: string) => {
    if (hasInteracted) {
      setShowLeaveModal(true);
    } else {
      navigate(path);
    }
  };

  const confirmLeave = () => {
    setShowLeaveModal(false);
    navigate("/app/courses");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="text-lg text-gray-900">Loading course...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 text-gray-500">
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-4">No Course Selected</h2>
          <p className="mb-6">Please select a course to start learning</p>
          <button
            onClick={() => navigate("/app/courses")}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <CourseEnrollmentModal
        course={course}
        onClose={() => {
          navigateTo("/app/courses");
        }}
        onEnrollSuccess={() => {
          fetchEnrolledCourses(address!);
        }}
      />
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const isModuleCompleted = (moduleIndex: number) => {
    return (
      enrollment?.completedModules.includes(course.modules[moduleIndex].id) ||
      false
    );
  };

  const isModuleLocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return false;
    return !isModuleCompleted(moduleIndex - 1);
  };

  const isCourseCompleted = () => {
    return enrollment?.progress === 100;
  };

  const handleModuleComplete = async () => {
    if (!currentModule || !address) return;

    try {
      await Web3Service.signMessage(stringToHex(course.title));

      await completeModule(address, courseId!, currentModule.id);

      fetchEnrolledCourses(address);

      addNotification({
        type: "success",
        title: "Module Completed!",
        message: `🎉 You've completed "${currentModule.title}"`,
      });

      // Check if course is completed
      const completedCount = (enrollment?.completedModules.length || 0) + 1;
      if (completedCount === course.modules.length) {
        addNotification({
          type: "success",
          title: "Course Completed!",
          message: "🎊 Congratulations! You can now mint your NFT certificate.",
        });
        setShowRating(true);
        setShowCertificate(true);
      } else {
        // Move to next module if available
        if (currentModuleIndex < course.modules.length - 1) {
          setCurrentModuleIndex(currentModuleIndex + 1);
        }
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to update progress. Please try again.",
      });
    }
  };

  const handleQuizComplete = (passed: boolean) => {
    setShowQuiz(false);
    if (passed) {
      handleModuleComplete();
    }
  };

  const handleRatingSubmitted = () => {
    setShowCertificate(true);
  };
  const renderModuleList = () => {
    const visibleModules = showAllModules
      ? course.modules
      : course.modules.slice(0, 10);

    return (
      <div className="cyber-card border-cyber rounded-2xl">
        <div className="p-6 border-b border-cyber/30">
          <h3 className="text-lg font-semibold text-white">
            Course Modules
          </h3>
          <p className="text-sm mt-1 text-slate-400">
            {course.modules.length} modules • {enrollment?.progress || 0}%
            complete
          </p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {visibleModules.map((module, index) => {
            const isCompleted = isModuleCompleted(index);
            const isLocked = isModuleLocked(index);
            const isCurrent = index === currentModuleIndex;

            return (
              <button
                key={module.id}
                onClick={() => !isLocked && setCurrentModuleIndex(index)}
                disabled={isLocked}
                className={`w-full p-4 text-left border-b border-cyber/20 last:border-b-0 transition-colors ${
                  isCurrent
                    ? "bg-cyan-500/10 border-cyan-500/30"
                    : isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-cyan-500 text-white"
                        : isLocked
                        ? "bg-slate-600 text-slate-400"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-white">
                      {module.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          module.type === "video"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : module.type === "text"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-green-500/20 text-green-400 border-green-500/30"
                        }`}
                      >
                        {module.type}
                      </span>
                      <span className="text-xs flex items-center space-x-1 text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{module.duration}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {course.modules.length > 10 && (
          <div className="p-4 border-t border-cyber/30">
            <button
              onClick={() => setShowAllModules(!showAllModules)}
              className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-lg transition-colors text-cyan-400 hover:bg-slate-800/50"
            >
              <span>
                {showAllModules
                  ? "Show Less"
                  : `Show All ${course.modules.length} Modules`}
              </span>
              {showAllModules ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProgressSection = () => {
    const progress = enrollment?.progress || 0;
    const completedModules = enrollment?.completedModules.length || 0;

    return (
      <div className="cyber-card border-cyber rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <span className="text-2xl font-bold text-cyan-400">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
          <div
            className="bg-cyan-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">
              {completedModules}
            </div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-white">
              {course.modules.length}
            </div>
            <div className="text-sm text-slate-400">Total</div>
          </div>
        </div>

        {progress === 100 && (
          <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="flex items-center space-x-2 text-green-400">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Course Completed!</span>
            </div>
            <p className="text-sm text-green-300 mt-1">
              Congratulations! You can now mint your NFT certificate.
            </p>
            <div className="grid grid-cols-1 mt-3 space-y-2">
              <button
                onClick={() => setShowRating(true)}
                className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
              >
                Rate Course
              </button>
              <button
                onClick={() => setShowCertificate(true)}
                className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-500 transition-all duration-300 backdrop-blur-sm"
              >
                Mint Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
        {/* Cyber Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-dark/95 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-primary/20 rounded-full blur-3xl animate-cyber-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl animate-quantum-float"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cyber Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => handleNavigation("/app/courses")}
            className="p-2 rounded-lg cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 animate-cyber-pulse" />
          </button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white font-cyber neon-text-cyan">{course.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-slate-400">
                  {course.totalStudents} students
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-slate-400">
                  {course.rating?.toFixed(2)}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  course.level === "Beginner"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : course.level === "Intermediate"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {course.level}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isCourseCompleted() && (
              <button
                onClick={() => setShowRating(true)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
              >
                <Star className="h-4 w-4" />
                <span>Rate Course</span>
              </button>
            )}
            <button
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentModule && (
              <div className="cyber-card border-cyber rounded-2xl">
                <ModuleViewer
                  module={currentModule}
                  isCompleted={isModuleCompleted(currentModuleIndex)}
                  onComplete={() => {
                    if (currentModule.quiz) {
                      setShowQuiz(true);
                    } else {
                      handleModuleComplete();
                    }
                  }}
                  previewUrl={course.thumbnailUrl}
                />

                {/* Module Navigation */}
                <div className="p-6 border-t border-cyber/30">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        setCurrentModuleIndex(
                          Math.max(0, currentModuleIndex - 1)
                        )
                      }
                      disabled={currentModuleIndex === 0}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-300 backdrop-blur-sm ${
                        currentModuleIndex === 0
                          ? "opacity-50 cursor-not-allowed border-slate-600 text-slate-500"
                          : "border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber"
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-400 font-cyber">
                        Module {currentModuleIndex + 1} of{" "}
                        {course.modules.length}
                      </span>

                      {!isModuleCompleted(currentModuleIndex) && (
                        <button
                          onClick={() => {
                            if (currentModule.quiz) {
                              setShowQuiz(true);
                            } else {
                              handleModuleComplete();
                            }
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-500 hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark Complete</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentModuleIndex(
                          Math.min(
                            course.modules.length - 1,
                            currentModuleIndex + 1
                          )
                        )
                      }
                      disabled={
                        currentModuleIndex === course.modules.length - 1 ||
                        isModuleLocked(currentModuleIndex + 1)
                      }
                      className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-300 backdrop-blur-sm ${
                        currentModuleIndex === course.modules.length - 1 ||
                        isModuleLocked(currentModuleIndex + 1)
                          ? "opacity-50 cursor-not-allowed border-slate-600 text-slate-500"
                          : "border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber"
                      }`}
                    >
                      <span>Next</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {renderProgressSection()}
            {renderModuleList()}
          </div>
        </div>

        {/* Quiz Modal */}
        {showQuiz && currentModule?.quiz && (
          <QuizComponent
            quiz={currentModule.quiz}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        )}

        {/* AI Assistant Modal */}
        {showAIAssistant && currentModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <AIAssistant
                module={currentModule}
                moduleTitle={currentModule.title}
                courseTitle={course.title}
                onClose={() => setShowAIAssistant(false)}
              />
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {showRating && (
          <CourseRating
            course={course}
            onClose={() => setShowRating(false)}
            onRatingSubmitted={handleRatingSubmitted}
          />
        )}

        {/* Leave Confirmation Modal */}
        <LeaveConfirmationModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={confirmLeave}
          title="Leave Course?"
          message="Are you sure you want to leave? Your progress will be saved automatically."
          hasUnsavedChanges={hasInteracted}
        />
        {/* Certificate Modal */}
        {showCertificate && (
          <NFTCertificate
            course={course}
            onClose={() => setShowCertificate(false)}
          />
        )}
        </div>
      </div>
    </>
  );
};

export default CourseLearning;
