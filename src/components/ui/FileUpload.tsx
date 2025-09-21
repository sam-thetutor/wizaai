import React, { useState, useRef } from "react";
import {
  File,
  X,
  Link,
  Youtube,
  Image as ImageIcon,
  Video,
} from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File | string) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number; // in MB
  currentValue?: string;
  placeholder?: string;
  type?: "image" | "video" | "file";
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onRemove,
  accept = "*/*",
  maxSize = 100,
  currentValue,
  placeholder = "Upload file, enter URL, or YouTube link",
  type = "file",
}) => {
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    onFileSelect(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onFileSelect(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-8 w-8" />;
      case "video":
        return <Video className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  return (
    <div className="space-y-4">
      {/* Upload Method Toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setUploadMethod("file")}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            uploadMethod === "file"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod("url")}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            uploadMethod === "url"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Enter URL
        </button>
      </div>

      {uploadMethod === "file" ? (
        /* File Upload */
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          {currentValue &&
          typeof currentValue === "string" &&
          !currentValue.startsWith("blob:") ? (
            <div className="space-y-2">
              {type === "image" ? (
                <img
                  src={currentValue}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : type === "video" ? (
                isYouTubeUrl(currentValue) ? (
                  <div className="flex items-center justify-center space-x-2 p-4 bg-red-50 rounded-lg">
                    <Youtube className="h-6 w-6 text-red-600" />
                    <span className="text-sm text-red-700">YouTube Video</span>
                  </div>
                ) : (
                  <video
                    src={currentValue}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                  />
                )
              ) : (
                <div className="flex items-center justify-center space-x-2 p-4 bg-gray-50 rounded-lg">
                  <File className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-700">File uploaded</span>
                </div>
              )}
              <button
                type="button"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-400">{getIcon()}</div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Click to upload
                </button>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">
                Max file size: {maxSize}MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
        </div>
      ) : (
        /* URL Input */
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          {currentValue && typeof currentValue === "string" && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {isYouTubeUrl(currentValue) ? (
                  <Youtube className="h-4 w-4 text-red-600" />
                ) : (
                  <Link className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm text-gray-700 truncate">
                  {currentValue}
                </span>
              </div>
              <button
                type="button"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
