import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { X, XCircle, Clock, RefreshCw, Award, Lightbulb } from "lucide-react";
import { Quiz } from "../types";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (passed: boolean) => void;
  onClose: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  quiz,
  onComplete,
  onClose,
}) => {
  const { state, addNotification } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestion.id] !== undefined;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerIndex,
    });
    setShowExplanation(false);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;

    quiz.questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    const passed = finalScore >= quiz.passingScore;

    if (passed) {
      addNotification({
        type: "success",
        title: "Quiz Passed!",
        message: `Congratulations! You scored ${Math.round(finalScore)}%`,
      });
    } else {
      addNotification({
        type: "error",
        title: "Quiz Failed",
        message: `You scored ${Math.round(finalScore)}%. Minimum required: ${
          quiz.passingScore
        }%`,
      });
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeRemaining(600);
    setScore(0);
    setShowExplanation(false);
  };

  const handleFinish = () => {
    const passed = score >= quiz.passingScore;
    onComplete(passed);
  };

  const renderQuestion = () => {
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span
              className={`text-sm font-medium ${
                state.theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span
                className={`text-sm font-medium ${
                  timeRemaining < 60 ? "text-red-500" : "text-orange-500"
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <h3
            className={`text-xl font-semibold mb-6 ${
              state.theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {currentQuestion.question}
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${
                selectedAnswer === index
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : state.theme === "dark"
                  ? "border-gray-700 bg-gray-800 hover:border-gray-600"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? "border-purple-500 bg-purple-500"
                      : state.theme === "dark"
                      ? "border-gray-600"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`${
                    state.theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Show explanation button */}
        {hasAnsweredCurrent && currentQuestion.explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center space-x-2 mb-4 px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            <span>{showExplanation ? "Hide" : "Show"} Explanation</span>
          </button>
        )}

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <div
            className={`p-4 rounded-lg border-l-4 border-blue-500 mb-6 ${
              state.theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                state.theme === "dark" ? "text-blue-300" : "text-blue-700"
              }`}
            >
              Explanation
            </h4>
            <p
              className={`text-sm ${
                state.theme === "dark" ? "text-blue-200" : "text-blue-600"
              }`}
            >
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              currentQuestionIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : state.theme === "dark"
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={!hasAnsweredCurrent}
            className={`px-6 py-2 rounded-lg transition-all duration-200 ${
              !hasAnsweredCurrent
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            }`}
          >
            {isLastQuestion ? "Submit Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const passed = score >= quiz.passingScore;
    const correctCount = Math.round((score / 100) * quiz.questions.length);

    return (
      <div className="text-center">
        <div
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            passed
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          {passed ? (
            <Award className="h-10 w-10 text-green-600" />
          ) : (
            <XCircle className="h-10 w-10 text-red-600" />
          )}
        </div>

        <h3
          className={`text-2xl font-bold mb-2 ${
            state.theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {passed ? "Congratulations!" : "Quiz Failed"}
        </h3>

        <p
          className={`text-lg mb-6 ${
            state.theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          You scored {Math.round(score)}% ({correctCount} out of{" "}
          {quiz.questions.length} questions correct)
        </p>

        <div
          className={`p-4 rounded-lg mb-6 ${
            passed
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}
        >
          <p
            className={`text-sm ${
              passed
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {passed
              ? `You passed! Minimum required: ${quiz.passingScore}%`
              : `You need ${quiz.passingScore}% to pass. You can retake the quiz.`}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {!passed && (
            <button
              onClick={handleRetakeQuiz}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retake Quiz</span>
            </button>
          )}

          <button
            onClick={handleFinish}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            {passed ? "Continue" : "Close"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl ${
          state.theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${
                state.theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {showResults ? "Quiz Results" : "Quiz"}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                state.theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          {!showResults && (
            <div className="mb-6">
              <div
                className={`w-full bg-gray-200 rounded-full h-2 ${
                  state.theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Content */}
          {showResults ? renderResults() : renderQuestion()}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
