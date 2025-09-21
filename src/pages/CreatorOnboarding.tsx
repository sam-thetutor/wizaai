import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import Button from "../components/ui/Button";
import FileUpload from "../components/ui/FileUpload";
import Dropdown from "../components/ui/Dropdown";
import {
  User,
  Camera,
  Globe,
  Twitter,
  Linkedin,
  Plus,
  X,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Users,
  Loader2,
} from "lucide-react";
import { Web3Service } from "../services/web3Service";

const CreatorOnboarding: React.FC = () => {
  const { state, addNotification, setUser } = useApp();
  const { address, isConnected } = useAppKitAccount();
  const { uploadImage, updateUserProfile } = useSupabase();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: state.user?.name || "",
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
    specialties: [] as string[],
    experienceYears: 1,
    avatarFile: null as File | null,
    avatarUrl: state.user?.avatarUrl || "",
  });

  const [currentSpecialty, setCurrentSpecialty] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 3;
  const specialtyOptions = [
    "Blockchain",
    "DeFi",
    "NFTs",
    "Smart Contracts",
    "Web3 Development",
    "Cryptocurrency",
    "DAOs",
    "GameFi",
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Data Science",
    "Cybersecurity",
  ];

  const handleAvatarUpload = async (fileOrUrl: File | string) => {
    setUploadingAvatar(true);
    try {
      let url: string;
      if (typeof fileOrUrl === "string") {
        url = fileOrUrl;
        setProfileData((prev) => ({
          ...prev,
          avatarFile: null,
          avatarUrl: url,
        }));
      } else {
        url = await uploadImage(fileOrUrl, "avatars");
        setProfileData((prev) => ({
          ...prev,
          avatarFile: fileOrUrl,
          avatarUrl: url,
        }));
      }
      addNotification({
        type: "success",
        title: "Avatar Uploaded",
        message: "Profile picture uploaded successfully",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload profile picture",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const addSpecialty = (specialty?: string) => {
    const specialtyToAdd = specialty || currentSpecialty;
    if (
      specialtyToAdd.trim() &&
      !profileData.specialties.includes(specialtyToAdd.trim())
    ) {
      setProfileData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtyToAdd.trim()],
      }));
      setCurrentSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfileData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      addNotification({
        type: "error",
        title: "Authentication Required",
        message: "Please connect your wallet first",
      });
      return;
    }

    if (
      !profileData.name ||
      !profileData.bio ||
      profileData.specialties.length === 0
    ) {
      addNotification({
        type: "error",
        title: "Missing Information",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await Web3Service.createWallet();

      const createdUser = await updateUserProfile({
        name: profileData.name,
        address,
        bio: profileData.bio,
        website: profileData.website,
        twitter: profileData.twitter,
        linkedin: profileData.linkedin,
        specialties: profileData.specialties,
        experienceYears: profileData.experienceYears,
        avatarUrl: profileData.avatarUrl,
        isCreator: true,
      });

      setUser(createdUser);

      addNotification({
        type: "success",
        title: "Welcome, Creator!",
        message: "Your creator profile has been set up successfully",
      });

      navigate("/app/overview");
    } catch (error) {
      addNotification({
        type: "error",
        title: "Setup Failed",
        message: "Failed to set up creator profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4 cyber-glow">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white neon-text-cyan mb-2">
          Basic Information
        </h2>
        <p className="text-slate-300">
          Let's start with your basic profile information
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              profileData.name?.charAt(0) || "U"
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 p-2 bg-slate-800 rounded-full border-2 border-cyber hover:border-cyber-active transition-colors cyber-glow"
          >
            <Camera className="h-4 w-4 text-cyber-primary" />
          </button>
        </div>
        <p className="text-sm text-cyber-muted mt-2">
          Upload your profile picture
        </p>
      </div>

      <FileUpload
        onFileSelect={handleAvatarUpload}
        onRemove={() =>
          setProfileData((prev) => ({
            ...prev,
            avatarUrl: "",
            avatarFile: null,
          }))
        }
        accept="image/*"
        currentValue={profileData.avatarUrl}
        placeholder="Upload profile picture or enter URL"
        type="image"
        maxSize={5}
      />

      <div>
        <label className="cyber-label">
          Full Name *
        </label>
        <input
          type="text"
          value={profileData.name}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="cyber-input w-full"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="cyber-label">
          About You *
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, bio: e.target.value }))
          }
          rows={4}
          className="cyber-input w-full"
          placeholder="Tell us about yourself, your experience, and what you're passionate about teaching..."
        />
      </div>

      <div>
        <label className="cyber-label">
          Years of Experience
        </label>
        <Dropdown
          options={[
            ...Array.from({ length: 20 }, (_, i) => ({
              value: (i + 1).toString(),
              label: `${i + 1} ${i === 0 ? "year" : "years"}`,
            })),
            { value: "20", label: "20+ years" },
          ]}
          value={profileData.experienceYears.toString()}
          onChange={(value) =>
            setProfileData((prev) => ({
              ...prev,
              experienceYears: parseInt(value),
            }))
          }
          placeholder="Select experience"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 cyber-glow-purple">
          <Award className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white neon-text-purple mb-2">
          Your Expertise
        </h2>
        <p className="text-slate-300">What subjects do you specialize in?</p>
      </div>

      <div>
        <label className="cyber-label">
          Specialties *
        </label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={currentSpecialty}
            onChange={(e) => setCurrentSpecialty(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
            className="cyber-input flex-1"
            placeholder="Enter a specialty"
          />
          <button onClick={() => addSpecialty()} className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Add Buttons */}
        <div className="mb-4">
          <p className="text-sm text-slate-300 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {specialtyOptions.map((specialty) => (
              <button
                key={specialty}
                onClick={() => addSpecialty(specialty)}
                disabled={profileData.specialties.includes(specialty)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  profileData.specialties.includes(specialty)
                    ? "bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed"
                    : "bg-slate-800/50 text-slate-300 border-cyber hover:border-cyber-active hover:text-cyber-primary hover:cyber-glow"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Specialties */}
        <div className="flex flex-wrap gap-2">
          {profileData.specialties.map((specialty) => (
            <span
              key={specialty}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyber-primary border border-cyber rounded-full text-sm cyber-badge"
            >
              <span>{specialty}</span>
              <button
                onClick={() => removeSpecialty(specialty)}
                className="text-cyber-secondary hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {profileData.specialties.length === 0 && (
          <p className="text-sm text-cyber-muted mt-2">
            Add at least one specialty
          </p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 cyber-glow-green">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white neon-text-cyan mb-2">Social Links</h2>
        <p className="text-slate-300">
          Help students connect with you (optional)
        </p>
      </div>

      <div>
        <label className="cyber-label">
          Website
        </label>
        <input
          type="url"
          value={profileData.website}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, website: e.target.value }))
          }
          className="cyber-input w-full"
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div>
        <label className="cyber-label">
          Twitter
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Twitter className="h-4 w-4 text-cyber-primary" />
          </div>
          <input
            type="text"
            value={profileData.twitter}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, twitter: e.target.value }))
            }
            className="cyber-input w-full pl-10"
            placeholder="@yourusername"
          />
        </div>
      </div>

      <div>
        <label className="cyber-label">
          LinkedIn
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Linkedin className="h-4 w-4 text-cyber-primary" />
          </div>
          <input
            type="text"
            value={profileData.linkedin}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, linkedin: e.target.value }))
            }
            className="cyber-input w-full pl-10"
            placeholder="linkedin.com/in/yourprofile"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 p-6 cyber-stat-card rounded-lg">
        <h3 className="text-lg font-semibold text-white neon-text-purple mb-4">
          Profile Preview
        </h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold overflow-hidden cyber-glow">
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              profileData.name?.charAt(0) || "U"
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white">
              {profileData.name}
            </h4>
            <p className="text-slate-300 text-sm mb-2">{profileData.bio}</p>
            <div className="flex flex-wrap gap-1">
              {profileData.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyber-primary border border-cyber text-xs rounded-full"
                >
                  {specialty}
                </span>
              ))}
              {profileData.specialties.length > 3 && (
                <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">
                  +{profileData.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profileData.name && profileData.bio;
      case 2:
        return profileData.specialties.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen cyber-hero cyber-grid flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="cyber-card p-8">
            <User className="h-16 w-16 mx-auto mb-4 text-cyber-primary cyber-glow" />
            <h2 className="text-2xl font-semibold mb-4 text-white neon-text-cyan">
              Connect Your Wallet
            </h2>
            <p className="text-slate-300 mb-6">
              You need to connect your wallet to become a creator
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-hero cyber-grid py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="cyber-badge inline-flex items-center space-x-2 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Creator Onboarding</span>
          </div>
          <h1 className="text-3xl font-bold text-white neon-text-cyan mb-2">
            Welcome to Wiza Creators
          </h1>
          <p className="text-slate-300">
            Set up your creator profile and start sharing your knowledge with
            the world
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-cyber-primary">
              {Math.round((currentStep / totalSteps) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300 cyber-glow"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="cyber-card rounded-xl p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-cyber">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button onClick={handleNext} disabled={!canProceed()} className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Setting up..." : "Complete Setup"}
                {!isSubmitting && <CheckCircle className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 cyber-card rounded-xl">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-cyber-secondary cyber-glow" />
            <h3 className="font-semibold text-white">Create Courses</h3>
            <p className="text-sm text-slate-300">
              Build and publish your courses
            </p>
          </div>
          <div className="text-center p-4 cyber-card rounded-xl">
            <Users className="h-8 w-8 mx-auto mb-2 text-cyber-primary cyber-glow" />
            <h3 className="font-semibold text-white">Build Community</h3>
            <p className="text-sm text-slate-300">
              Connect with learners worldwide
            </p>
          </div>
          <div className="text-center p-4 cyber-card rounded-xl">
            <Award className="h-8 w-8 mx-auto mb-2 text-cyber-accent cyber-glow-green" />
            <h3 className="font-semibold text-white">Earn Revenue</h3>
            <p className="text-sm text-slate-300">Monetize your expertise</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboarding;
