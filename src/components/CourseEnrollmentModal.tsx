import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import Button from "./ui/Button";
import {
  X,
  Play,
  Award,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  CreditCard,
  Wallet,
  Shield,
  Zap,
} from "lucide-react";
import { Course } from "../types";
import { useAppKitAccount } from "@reown/appkit/react";
import { Web3Service } from "../services/web3Service";
import { parseEther, stringToHex, zeroAddress } from "viem";

interface CourseEnrollmentModalProps {
  course: Course;
  onClose: () => void;
  onEnrollSuccess: () => void;
}

const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  course,
  onClose,
  onEnrollSuccess,
}) => {
  const { state, addNotification, coursesEnrolled, navigateTo } = useApp();
  const { address, isConnected } = useAppKitAccount();
  const { enrollInCourse, createTransaction } = useSupabase();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isAlreadyEnrolled = coursesEnrolled?.some(
    (enrollment) => enrollment.course?.id === course.id
  );

  const handleEnroll = async () => {
    if (!course.user?.address) return;
    if (!isConnected || !address) {
      addNotification({
        type: "error",
        title: "Wallet Required",
        message: "Please connect your wallet to enroll in courses",
      });
      return;
    }

    if (isAlreadyEnrolled) {
      addNotification({
        type: "info",
        title: "Already Enrolled",
        message: "You are already enrolled in this course",
      });
      onClose();
      return;
    }

    setIsEnrolling(true);
    try {
      let txHash;
      if (course.price > 0) {
        txHash = await Web3Service.addFundsToWalletNonBlocking(
          course.user.address,
          zeroAddress,
          parseEther(course.price.toString())
        );
      }
      {
        await Web3Service.signMessage(stringToHex(course.title));
      }

      await enrollInCourse(address, course.id, course.user.address);

      // Create withdrawal transaction
      await createTransaction({
        userId: course.user.address,
        fromUserId: address,
        type: "earning",
        amount: parseFloat(course.price.toString()),
        description: `Purchase: ${course.title}`,
        status: "completed",
        txHash,
      });

      addNotification({
        type: "success",
        title: "Enrollment Successful!",
        message: `Welcome to "${course.title}"! You can now start learning.`,
      });

      onEnrollSuccess();
      onClose();

      navigateTo(`/app/courses/${course.id}`);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Enrollment Failed",
        message: "Failed to enroll in course. Please try again.",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {course.price > 0 ? "Purchase Course" : "Enroll in Course"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {course.price > 0 ? "Complete your purchase to start learning" : "Join this course for free"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Course Preview */}
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/30">
                    {course.category}
                  </span>
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

                <h3 className="text-lg font-semibold mb-2 text-white">
                  {course.title}
                </h3>

                <p className="text-sm mb-3 line-clamp-2 text-slate-400">
                  {course.description}
                </p>

                <div className="flex items-center flex-wrap gap-2 space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-400">
                      {course.totalStudents} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-slate-400">
                      {course.rating?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-400">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-400">
                      {course.modules.length} modules
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-white">
              What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">
                  {course.modules.length} learning modules
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">
                  Interactive quizzes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">
                  AI learning assistant
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">
                  NFT certificate upon completion
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">
                  Lifetime access
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">
                  Community access
                </span>
              </div>
            </div>
          </div>

          {/* Skills You'll Learn */}
          {course.certificateMetadata.attributes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Skills You'll Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.certificateMetadata.attributes.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium border border-cyan-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Payment Section */}
          {course.price > 0 && (
            <div className="p-4 rounded-lg border border-cyan-500/20 bg-slate-800/50 mb-6">
              <h3 className="font-semibold mb-3 text-white">
                Payment Details
              </h3>

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-slate-300">
                  Course Price
                </span>
                <span className="text-2xl font-bold text-cyan-400">
                  {course.price} KAIA
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-600 bg-slate-700/50">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="font-medium text-white">
                      Pay with Wallet
                    </p>
                    <p className="text-sm text-slate-400">
                      {address ? formatAddress(address) : "Connect your wallet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructor Info */}
          <div className="p-4 rounded-lg border border-cyan-500/20 bg-slate-800/50 mb-6">
            <h3 className="font-semibold mb-3 text-white">
              Your Instructor
            </h3>
            <div className="flex items-center space-x-3">
              <img
                src={course.user?.avatarUrl || "/images/placeholder.png"}
                alt={course.user?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/30"
              />
              <div>
                <h4 className="font-medium text-white">
                  {course.user?.name}
                </h4>
                <p className="text-sm text-slate-400">
                  Experience: {course.user?.experienceYears} Years
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-500/10 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-green-400">
                Blockchain Secured
              </h4>
            </div>
            <p className="text-sm text-green-300">
              Your enrollment and progress are secured on the Kaia
              blockchain. Earn a verifiable NFT certificate upon completion.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {isAlreadyEnrolled ? (
              <button 
                onClick={onClose} 
                className="w-full px-4 py-3 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="h-4 w-4 mr-2 inline" />
                Continue Learning
              </button>
            ) : (
              <>
                <button
                  onClick={handleEnroll}
                  disabled={!isConnected || isEnrolling}
                  className="w-full px-4 py-3 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
                >
                  {isEnrolling ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : course.price > 0 ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2 inline" />
                      Purchase for {course.price} KAIA
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2 inline" />
                      Enroll for Free
                    </>
                  )}
                </button>

                {!isConnected && (
                  <p className="text-center text-sm text-slate-400">
                    Please connect your wallet to enroll
                  </p>
                )}
              </>
            )}

            <button 
              onClick={onClose} 
              className="w-full px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>

          {/* Benefits Footer */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Award className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
                <p className="text-xs text-slate-400">
                  NFT Certificate
                </p>
              </div>
              <div>
                <Zap className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
                <p className="text-xs text-slate-400">
                  AI Assistant
                </p>
              </div>
              <div>
                <Shield className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
                <p className="text-xs text-slate-400">
                  Blockchain Verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollmentModal;
