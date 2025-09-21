import React, { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import FileUpload from "../components/ui/FileUpload";
import Dropdown from "../components/ui/Dropdown";
import {
  Plus,
  BookOpen,
  X,
  Save,
  Trash2,
  Loader2,
  HelpCircle,
  Trash,
} from "lucide-react";
import {
  Module,
  ModuleContent,
  CertificateMetadata,
  Quiz,
  Question,
} from "../types";
import { Web3Service } from "../services/web3Service";
import { stringToHex } from "viem";

const CourseCreation: React.FC = () => {
  const { state, addNotification, navigateTo } = useApp();
  const { address, isConnected } = useAppKitAccount();
  const { createCourse, uploadImage, uploadFile } = useSupabase();

  const [isCreating, setIsCreating] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "Blockchain",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    price: 0,
    duration: "",
    thumbnailFile: null as File | null,
    thumbnailUrl: "",
    certificateImageFile: null as File | null,
    certificateImageUrl: "",
    attributes: [] as string[],
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);

  const categories = [
    "Blockchain",
    "DeFi",
    "NFTs",
    "Smart Contracts",
    "Web3 Development",
    "Cryptocurrency",
    "DAOs",
    "GameFi",
  ];

  const handleThumbnailUpload = async (fileOrUrl: File | string) => {
    setUploadingThumbnail(true);
    try {
      let url: string;
      if (typeof fileOrUrl === "string") {
        url = fileOrUrl;
        setCourseData((prev) => ({
          ...prev,
          thumbnailFile: null,
          thumbnailUrl: url,
        }));
      } else {
        url = await uploadImage(fileOrUrl, "course-thumbnails");
        setCourseData((prev) => ({
          ...prev,
          thumbnailFile: fileOrUrl,
          thumbnailUrl: url,
        }));
      }
      addNotification({
        type: "success",
        title: "Thumbnail Uploaded",
        message: "Course thumbnail uploaded successfully",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload thumbnail image",
      });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleCertificateImageUpload = async (fileOrUrl: File | string) => {
    setUploadingCertificate(true);
    try {
      let url: string;
      if (typeof fileOrUrl === "string") {
        url = fileOrUrl;
        setCourseData((prev) => ({
          ...prev,
          certificateImageFile: null,
          certificateImageUrl: url,
        }));
      } else {
        url = await uploadImage(fileOrUrl, "certificate-images");
        setCourseData((prev) => ({
          ...prev,
          certificateImageFile: fileOrUrl,
          certificateImageUrl: url,
        }));
      }
      addNotification({
        type: "success",
        title: "Certificate Image Uploaded",
        message: "Certificate template uploaded successfully",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload certificate image",
      });
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleModuleContentUpload = async (
    moduleIndex: number,
    fileOrUrl: File | string
  ) => {
    try {
      let url: string;
      let contentUpdate: Partial<ModuleContent> = {};

      if (typeof fileOrUrl === "string") {
        url = fileOrUrl;
        if (
          fileOrUrl.includes("youtube.com") ||
          fileOrUrl.includes("youtu.be")
        ) {
          contentUpdate = { videoUrl: url };
        } else if (fileOrUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          contentUpdate = { imageUrl: url };
        } else {
          contentUpdate = { videoUrl: url };
        }
      } else {
        const fileType = fileOrUrl.type;
        if (fileType.startsWith("image/")) {
          url = await uploadFile(fileOrUrl, "course-contents");
          contentUpdate = { imageUrl: url };
        } else if (fileType.startsWith("video/")) {
          url = await uploadFile(fileOrUrl, "course-contents");
          contentUpdate = { videoUrl: url };
        } else {
          throw new Error("Unsupported file type");
        }
      }

      updateModule(moduleIndex, {
        content: { ...modules[moduleIndex].content, ...contentUpdate },
      });

      addNotification({
        type: "success",
        title: "Content Uploaded",
        message: "Module content uploaded successfully",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload module content",
      });
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: "",
      type: "text",
      content: { text: "" },
      duration: "10min",
      isCompleted: false,
      isLocked: false,
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index: number, updates: Partial<Module>) => {
    const updatedModules = modules.map((module, i) =>
      i === index ? { ...module, ...updates } : module
    );
    setModules(updatedModules);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (
      currentSkill.trim() &&
      !courseData.attributes.includes(currentSkill.trim())
    ) {
      setCourseData((prev) => ({
        ...prev,
        attributes: [...prev.attributes, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setCourseData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((s) => s !== skill),
    }));
  };

  const addQuizToModule = (moduleIndex: number) => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      questions: [],
      passingScore: 70,
    };
    updateModule(moduleIndex, { quiz: newQuiz });
  };

  const removeQuizFromModule = (moduleIndex: number) => {
    updateModule(moduleIndex, { quiz: undefined });
  };

  const addQuestionToQuiz = (moduleIndex: number) => {
    const module = modules[moduleIndex];
    if (!module.quiz) return;

    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };

    const updatedQuiz = {
      ...module.quiz,
      questions: [...module.quiz.questions, newQuestion],
    };

    updateModule(moduleIndex, { quiz: updatedQuiz });
  };

  const updateQuestion = (
    moduleIndex: number,
    questionIndex: number,
    updates: Partial<Question>
  ) => {
    const module = modules[moduleIndex];
    if (!module.quiz) return;

    const updatedQuestions = module.quiz.questions.map((question, index) =>
      index === questionIndex ? { ...question, ...updates } : question
    );

    const updatedQuiz = {
      ...module.quiz,
      questions: updatedQuestions,
    };

    updateModule(moduleIndex, { quiz: updatedQuiz });
  };

  const removeQuestion = (moduleIndex: number, questionIndex: number) => {
    const module = modules[moduleIndex];
    if (!module.quiz) return;

    const updatedQuestions = module.quiz.questions.filter(
      (_, index) => index !== questionIndex
    );
    const updatedQuiz = {
      ...module.quiz,
      questions: updatedQuestions,
    };

    updateModule(moduleIndex, { quiz: updatedQuiz });
  };

  const updateQuizPassingScore = (
    moduleIndex: number,
    passingScore: number
  ) => {
    const module = modules[moduleIndex];
    if (!module.quiz) return;

    const updatedQuiz = {
      ...module.quiz,
      passingScore,
    };

    updateModule(moduleIndex, { quiz: updatedQuiz });
  };

  const handleCreateCourse = async () => {
    if (!address || !state.user) {
      addNotification({
        type: "error",
        title: "Authentication Required",
        message: "Please connect your wallet to create courses",
      });
      return;
    }

    if (!courseData.title || !courseData.description || modules.length === 0) {
      addNotification({
        type: "error",
        title: "Missing Information",
        message:
          "Please fill in all required fields and add at least one module",
      });
      return;
    }

    setIsCreating(true);
    try {
      const certificateMetadata: CertificateMetadata = {
        title: `${courseData.title} - Certificate of Completion`,
        issuer: state.user.name || "Liven Academy",
        description: `This certificate verifies that the holder has successfully completed ${courseData.title}`,
        imageUrl: courseData.certificateImageUrl || "",
        attributes: courseData.attributes,
      };

      await Web3Service.signMessage(stringToHex(courseData.title));

      await createCourse({
        title: courseData.title,
        description: courseData.description,
        instructorId: address,
        thumbnailUrl: courseData.thumbnailUrl,
        price: courseData.price,
        duration: courseData.duration,
        level: courseData.level,
        category: courseData.category,
        modules: modules,
        certificateMetadata,
      });

      addNotification({
        type: "success",
        title: "Course Created!",
        message: "Your course has been published successfully",
      });

      // Reset form
      setCourseData({
        title: "",
        description: "",
        category: "Blockchain",
        level: "Beginner",
        price: 0,
        duration: "",
        thumbnailFile: null,
        thumbnailUrl: "",
        certificateImageFile: null,
        certificateImageUrl: "",
        attributes: [],
      });
      setModules([]);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create course. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const renderModuleEditor = (module: Module, index: number) => (
    <div
      key={module.id}
      className="cyber-card border-cyber/50 hover:border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary/30 to-transparent"></div>
      
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white font-cyber">
          🔧 Module {index + 1}
        </h4>
        <button
          onClick={() => removeModule(index)}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30 hover:border-red-500/50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="cyber-label">
            Module Title
          </label>
          <input
            type="text"
            value={module.title}
            onChange={(e) => updateModule(index, { title: e.target.value })}
            className="cyber-input w-full"
            placeholder="Enter module title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="cyber-label">
              Content Type
            </label>
            <Dropdown
              options={[
                { value: "text", label: "Text/HTML Content" },
                { value: "video", label: "Video" },
                { value: "image", label: "Image" },
              ]}
              value={module.type}
              onChange={(value) =>
                updateModule(index, {
                  type: value as "video" | "text" | "image",
                  content: { text: "" }, // Reset content when type changes
                })
              }
              placeholder="Select content type"
            />
          </div>

          <div>
            <label className="cyber-label">
              Duration
            </label>
            <input
              type="text"
              value={module.duration}
              onChange={(e) =>
                updateModule(index, { duration: e.target.value })
              }
              className="cyber-input w-full"
              placeholder="e.g., 15min"
            />
          </div>
        </div>

        <div>
          <label className="cyber-label">
            Content
          </label>
          {module.type === "text" && (
            <textarea
              value={module.content.text || ""}
              onChange={(e) =>
                updateModule(index, {
                  content: { ...module.content, text: e.target.value },
                })
              }
              rows={6}
              className="cyber-input w-full resize-none"
              placeholder="Enter your content here..."
            />
          )}
          {(module.type === "video" || module.type === "image") && (
            <FileUpload
              onFileSelect={(fileOrUrl) =>
                handleModuleContentUpload(index, fileOrUrl)
              }
              onRemove={() =>
                updateModule(index, {
                  content: {
                    ...module.content,
                    videoUrl: undefined,
                    imageUrl: undefined,
                  },
                })
              }
              accept={module.type === "video" ? "video/*" : "image/*"}
              currentValue={
                module.type === "video"
                  ? module.content.videoUrl
                  : module.content.imageUrl
              }
              placeholder={
                module.type === "video"
                  ? "Upload video, enter URL, or YouTube link"
                  : "Upload image or enter URL"
              }
              type={module.type}
              maxSize={module.type === "video" ? 500 : 10}
            />
          )}
        </div>

        {/* Quiz Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h5
              className={`font-medium ${
                state.theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Quiz (Optional)
            </h5>
            {!module.quiz ? (
              <button
                onClick={() => addQuizToModule(index)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Add Quiz</span>
              </button>
            ) : (
              <button
                onClick={() => removeQuizFromModule(index)}
                className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                <Trash className="h-4 w-4" />
                <span>Remove Quiz</span>
              </button>
            )}
          </div>

          {module.quiz && (
            <div
              className={`p-4 border rounded-lg ${
                state.theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Passing Score */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    state.theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={module.quiz.passingScore}
                  onChange={(e) =>
                    updateQuizPassingScore(
                      index,
                      parseInt(e.target.value) || 70
                    )
                  }
                  className={`w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    state.theme === "dark"
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {module.quiz.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg ${
                      state.theme === "dark"
                        ? "bg-gray-600 border-gray-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h6
                        className={`font-medium ${
                          state.theme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Question {questionIndex + 1}
                      </h6>
                      <button
                        onClick={() => removeQuestion(index, questionIndex)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            state.theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Question
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(index, questionIndex, {
                              question: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            state.theme === "dark"
                              ? "bg-gray-500 border-gray-400 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Enter your question"
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            state.theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() =>
                                  updateQuestion(index, questionIndex, {
                                    correctAnswer: optionIndex,
                                  })
                                }
                                className="text-purple-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(index, questionIndex, {
                                    options: newOptions,
                                  });
                                }}
                                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  state.theme === "dark"
                                    ? "bg-gray-500 border-gray-400 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Select the correct answer by clicking the radio button
                        </p>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            state.theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Explanation (Optional)
                        </label>
                        <textarea
                          value={question.explanation || ""}
                          onChange={(e) =>
                            updateQuestion(index, questionIndex, {
                              explanation: e.target.value,
                            })
                          }
                          rows={2}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            state.theme === "dark"
                              ? "bg-gray-500 border-gray-400 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Explain why this is the correct answer"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addQuestionToQuiz(index)}
                  className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 text-gray-500">
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="mb-6">
            You need to connect your wallet to create and manage courses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent"></div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-6 text-white font-cyber neon-text-cyan">
            📋 Course Information
          </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="cyber-label">
              Course Title *
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) =>
                setCourseData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="cyber-input w-full"
              placeholder="Enter course title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="cyber-label">
              Description *
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) =>
                setCourseData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="cyber-input w-full resize-none"
              placeholder="Describe what students will learn"
            />
          </div>

          <div>
            <label className="cyber-label">
              Category
            </label>
            <Dropdown
              options={categories.map((category) => ({
                value: category,
                label: category,
              }))}
              value={courseData.category}
              onChange={(value) =>
                setCourseData((prev) => ({ ...prev, category: value }))
              }
              placeholder="Select category"
            />
          </div>

          <div>
            <label className="cyber-label">
              Level
            </label>
            <Dropdown
              options={[
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" },
              ]}
              value={courseData.level}
              onChange={(value) =>
                setCourseData((prev) => ({ ...prev, level: value as any }))
              }
              placeholder="Select level"
            />
          </div>

          <div>
            <label className="cyber-label">
              Price (KAIA)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={courseData.price}
              onChange={(e) =>
                setCourseData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              className="cyber-input w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="cyber-label">
              Duration
            </label>
            <input
              type="text"
              value={courseData.duration}
              onChange={(e) =>
                setCourseData((prev) => ({ ...prev, duration: e.target.value }))
              }
              className="cyber-input w-full"
              placeholder="e.g., 2h 30min"
            />
          </div>
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="cyber-label">
              Course Thumbnail
            </label>
            <FileUpload
              onFileSelect={handleThumbnailUpload}
              onRemove={() =>
                setCourseData((prev) => ({
                  ...prev,
                  thumbnailUrl: "",
                  thumbnailFile: null,
                }))
              }
              accept="image/*"
              currentValue={courseData.thumbnailUrl}
              placeholder="Upload thumbnail image or enter URL"
              type="image"
              maxSize={10}
            />
          </div>

          {/* Certificate Image Upload */}
          <div>
            <label className="cyber-label">
              Certificate Template
            </label>
            <FileUpload
              onFileSelect={handleCertificateImageUpload}
              onRemove={() =>
                setCourseData((prev) => ({
                  ...prev,
                  certificateImageUrl: "",
                  certificateImageFile: null,
                }))
              }
              accept="image/*"
              currentValue={courseData.certificateImageUrl}
              placeholder="Upload certificate template or enter URL"
              type="image"
              maxSize={10}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <label className="cyber-label">
            Skills Students Will Learn
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              className="cyber-input flex-1"
              placeholder="Enter a skill"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {courseData.attributes.map((skill) => (
              <span
                key={skill}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Modules */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent"></div>
        
        <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white font-cyber neon-text-cyan">
            📚 Course Modules
          </h3>
          <button
            onClick={addModule}
            className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </span>
          </button>
        </div>

        <div className="space-y-6">
          {modules.map((module, index) => renderModuleEditor(module, index))}

          {modules.length === 0 && (
            <div className="text-center py-12 text-cyan-100">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
              <p className="text-lg mb-2 text-white font-cyber">📚 No modules yet</p>
              <p className="text-cyan-100">Add your first module to get started</p>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigateTo("/app/courses")}
          className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-gray-500/50 text-gray-400 hover:bg-gray-500/10 hover:border-gray-500 hover:text-gray-300 transition-all duration-300 backdrop-blur-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateCourse}
          disabled={isCreating}
          className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-300 backdrop-blur-sm ${
            isCreating
              ? "border-gray-500/50 text-gray-500 cursor-not-allowed"
              : "border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber"
          }`}
        >
          <span className="relative z-10 flex items-center">
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Publish Course
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CourseCreation;
