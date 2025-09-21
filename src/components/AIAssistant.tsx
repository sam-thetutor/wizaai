import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { AIService } from "../services/aiService";
import { Module } from "../types";
import { Send, Bot, User, X, Lightbulb, Loader2 } from "lucide-react";
import { AIMessage } from "../types";

interface AIAssistantProps {
  module: Module;
  moduleTitle: string;
  courseTitle: string;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  module,
  moduleTitle,
  courseTitle,
  onClose,
}) => {
  const { state } = useApp();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm your AI learning assistant for "${courseTitle}". I'm here to help you understand "${moduleTitle}" by providing hints and guidance. What would you like to explore?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await AIService.sendMessage(
        inputMessage.trim(),
        module,
        courseTitle,
        messages
      );

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGetHint = async (question: string) => {
    const hint = await AIService.getHint(module, question, courseTitle);
    // Add hint as a system message
    const hintMessage: AIMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: `💡 Hint: ${hint}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, hintMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What should I focus on in this module?",
    "What's the most important thing to remember?",
    "Can you give me a hint about the main idea?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleQuickHint = async () => {
    setIsTyping(true);
    try {
      await handleGetHint(
        "What's the main concept I should understand in this module?"
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[600px] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Bot className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              AI Learning Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Providing hints and guidance
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`flex-shrink-0 p-2 rounded-full ${
                  message.role === "user"
                    ? "bg-cyan-500"
                    : "bg-slate-700 border border-cyan-500/30"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-cyan-400" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-800/50 text-slate-200 border border-slate-600"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70`}>
                  {message.timestamp.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="flex-shrink-0 p-2 rounded-full bg-slate-700 border border-cyan-500/30">
                <Bot className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600">
                <div className="flex items-center space-x-1">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  <span className="text-sm text-slate-300">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-cyan-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-slate-300">
              Suggested questions:
            </span>
          </div>
          <div className="mb-3">
            <button
              onClick={handleQuickHint}
              disabled={isTyping}
              className="w-full text-left p-2 text-xs rounded-lg border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 bg-yellow-500/5 transition-colors disabled:opacity-50"
            >
              💡 Give me a quick hint about this module
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-2 text-xs rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-cyan-500/30">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about this module..."
            disabled={isTyping}
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() =>
              !inputMessage.trim() ? handleQuickHint() : handleSendMessage()
            }
            disabled={isTyping}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 ${
              isTyping
                ? "border-slate-600 text-slate-500 cursor-not-allowed"
                : !inputMessage.trim()
                ? "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500"
                : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
            }`}
          >
            {!inputMessage.trim() ? (
              <Lightbulb className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
