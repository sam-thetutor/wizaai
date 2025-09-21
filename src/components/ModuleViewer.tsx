import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle,
} from "lucide-react";
import { Module } from "../types";

const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div
            className={`w-2 h-2 ${
              [
                "bg-purple-500",
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-pink-500",
                "bg-indigo-500",
              ][Math.floor(Math.random() * 6)]
            }`}
            style={{
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

interface ModuleViewerProps {
  module: Module;
  isCompleted: boolean;
  onComplete: () => void;
  previewUrl?: string;
}

const ModuleViewer: React.FC<ModuleViewerProps> = ({
  module,
  isCompleted,
  onComplete,
  previewUrl,
}) => {
  const { state } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleComplete = () => {
    setShowConfetti(true);
    onComplete();

    // Hide confetti after 4 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (!isCompleted) {
        handleComplete();
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isCompleted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];

    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderVideoPlayer = () => (
    <>
      <div className="relative group">
        <video
          ref={videoRef}
          src={module.content.videoUrl}
          className="w-full aspect-video bg-black rounded-lg"
          poster={previewUrl || "/images/placeholder.png"}
        />

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={changePlaybackRate}
                className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-sm transition-colors"
              >
                {playbackRate}x
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Module Completed!</h3>
              <p className="text-sm">
                You've successfully completed this module
              </p>
            </div>
          </div>
        )}
      </div>

      <Confetti show={showConfetti} />
    </>
  );

  const renderImageContent = () => (
    <>
      <div className="relative">
        <img
          src={module.content.imageUrl}
          alt={module.title}
          className="w-full rounded-lg object-cover max-h-96"
        />
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
          </div>
        )}
      </div>

      <Confetti show={showConfetti} />
    </>
  );

  const renderTextContent = () => (
    <>
      <div
        className={`prose max-w-none ${
          state.theme === "dark" ? "prose-invert" : ""
        }`}
      >
        {module.content.richText ? (
          <div
            dangerouslySetInnerHTML={{ __html: module.content.richText }}
            className={`rich_content ${
              state.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: module.content.text || "No content.",
            }}
            className={`rich_content ${
              state.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          />
        )}

        {isCompleted && (
          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 dark:text-green-300 font-medium">
                Module Completed
              </span>
            </div>
          </div>
        )}
      </div>

      <Confetti show={showConfetti} />
    </>
  );

  return (
    <div className="p-6">
      <Confetti show={showConfetti} />

      {/* Module Header */}
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            state.theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {module.title}
        </h2>
        <div className="flex items-center space-x-4">
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              module.type === "video"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                : module.type === "text"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {module.type.charAt(0).toUpperCase() + module.type.slice(1)}
          </span>
          <span
            className={`text-sm ${
              state.theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {module.duration}
          </span>
          {isCompleted && (
            <span className="flex items-center space-x-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>

      {/* Module Content */}
      <div className="mb-6">
        {module.type === "video" && renderVideoPlayer()}
        {module.type === "image" && renderImageContent()}
        {module.type === "text" && renderTextContent()}
      </div>

      {/* Module Description */}
      {module.content.richText && module.type !== "text" && (
        <div
          className={`mt-6 p-4 rounded-lg border ${
            state.theme === "dark"
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-3 ${
              state.theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            About This Module
          </h3>
          <div
            className={`prose max-w-none ${
              state.theme === "dark"
                ? "prose-invert text-gray-300"
                : "text-gray-700"
            }`}
          >
            <div
              className="rich_content"
              dangerouslySetInnerHTML={{ __html: module.content.richText }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleViewer;
