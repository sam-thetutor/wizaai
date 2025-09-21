import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import { Star, X, Send, CheckCircle } from "lucide-react";
import { Course } from "../types";
import { useAppKitAccount } from "@reown/appkit/react";
import { Web3Service } from "../services/web3Service";
import { stringToHex } from "viem";

interface CourseRatingProps {
  course: Course;
  onClose: () => void;
  onRatingSubmitted: () => void;
}

const CourseRating: React.FC<CourseRatingProps> = ({
  course,
  onClose,
  onRatingSubmitted,
}) => {
  const { state, addNotification } = useApp();
  const { address } = useAppKitAccount();
  const { submitCourseRating, getUserCourseRating } = useSupabase();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadExistingRating = async () => {
      if (address) {
        try {
          const userRating = await getUserCourseRating(address, course.id);
          if (userRating) {
            setExistingRating(userRating);
            setRating(userRating.rating);
            setReview(userRating.review || "");
          }
        } catch (error) {
          console.error("Failed to load existing rating:", error);
        }
      }
    };

    loadExistingRating();
  }, []);

  const handleSubmit = async () => {
    if (!course.user?.address) return;
    if (!address) {
      addNotification({
        type: "error",
        title: "Authentication Required",
        message: "Please connect your wallet to submit a rating",
      });
      return;
    }

    if (rating === 0) {
      addNotification({
        type: "error",
        title: "Rating Required",
        message: "Please select a star rating",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await Web3Service.signMessage(stringToHex(course.title));

      await submitCourseRating(
        address,
        course.id,
        course.user.address,
        rating,
        review
      );

      addNotification({
        type: "success",
        title: existingRating ? "Rating Updated!" : "Rating Submitted!",
        message: "Thank you for your feedback",
      });

      onRatingSubmitted();
      onClose();
    } catch (error) {
      addNotification({
        type: "error",
        title: "Submission Failed",
        message: "Failed to submit rating. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {existingRating ? "Update Your Rating" : "Rate This Course"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Course Info */}
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-16 h-16 rounded-lg object-cover border-2 border-cyan-500/30"
            />
            <div>
              <h3 className="font-semibold text-white">
                {course.title}
              </h3>
              <p className="text-sm text-slate-400">
                by {course.user?.name}
              </p>
            </div>
          </div>

          {/* Existing Rating Display */}
          {existingRating && !isEditing && (
            <div
              className={`p-4 rounded-lg border mb-6 ${
                state.theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-medium ${
                    state.theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your Rating
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= existingRating.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-sm font-medium ${
                    state.theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getRatingText(existingRating.rating)}
                </span>
              </div>
              {existingRating.review && (
                <p
                  className={`text-sm ${
                    state.theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  "{existingRating.review}"
                </p>
              )}
            </div>
          )}

          {/* Rating Form */}
          {(!existingRating || isEditing) && (
            <>
              {/* Star Rating */}
              <div className="text-center mb-6">
                <p className="text-sm mb-4 text-slate-400">
                  How would you rate this course?
                </p>
                {renderStars()}
                {rating > 0 && (
                  <p className="text-lg font-medium mt-2 text-white">
                    {getRatingText(rating)}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Write a Review (Optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 resize-none transition-colors"
                  placeholder="Share your thoughts about this course..."
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (existingRating) {
                      setIsEditing(false);
                      setRating(existingRating.rating);
                      setReview(existingRating.review || "");
                    } else {
                      onClose();
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500 hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      {existingRating ? "Update Rating" : "Submit Rating"}
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Success Message for Existing Rating */}
          {existingRating && !isEditing && (
            <div className="flex justify-center">
              <button 
                onClick={onClose} 
                className="w-full px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
              >
                <CheckCircle className="h-4 w-4 mr-2 inline" />
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRating;
