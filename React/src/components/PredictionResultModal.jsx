"use client";
import React, { useEffect, useState } from "react";

const PredictionResultModal = ({ isOpen, onClose, prediction, formData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationStep(0);

      const timer1 = setTimeout(() => setAnimationStep(1), 100);
      const timer2 = setTimeout(() => setAnimationStep(2), 300);
      const timer3 = setTimeout(() => setAnimationStep(3), 600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setIsVisible(false);
      setAnimationStep(0);
    }
  }, [isOpen]);

  const getScoreLevel = (predictionValue) => {
    if (predictionValue > 80)
      return {
        level: "High Score",
        color: "text-green-400",
        bgColor: "bg-green-900/40",
        icon: "🟢",
        description: "Excellent academic status",
      };
    if (predictionValue > 60)
      return {
        level: "Good Score",
        color: "text-yellow-400",
        bgColor: "bg-yellow-900/40",
        icon: "🟡",
        description: "Good academic status",
      };
    if (predictionValue > 33)
      return {
        level: "Medium Score",
        color: "text-orange-400",
        bgColor: "bg-orange-900/40",
        icon: "🟠",
        description: "Moderate academic status",
      };
    return {
      level: "Bad Score",
      color: "text-red-400",
      bgColor: "bg-red-900/40",
      icon: "🔴",
      description: "Poor academic status",
    };
  };

  const getScoreAdvice = (scoreLevel) => {
    switch (scoreLevel) {
      case "High Score":
        return "You are doing great! Keep up the good work!";
      case "Good Score":
        return "You can score more. Keep studying and improving!";
      case "Medium Score":
        return "You need to work harder. Study more and seek help if needed.";
      case "Bad Score":
        return "You need to improve your study habits. Seek help from teachers or tutors.";
      default:
        return "";
    }
  };

  const roundedPrediction = Math.round(prediction * 100) / 100;
  const scoreInfo = getScoreLevel(roundedPrediction);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          animationStep >= 1 ? "opacity-60" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-gray-900 text-gray-200 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 ${
          animationStep >= 2 ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } max-h-[90vh] overflow-y-auto scrollbar-hide`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90" />
          <div className="relative p-6 text-center text-white">
            <div
              className={`text-6xl mb-4 transform transition-all duration-700 ${
                animationStep >= 3 ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              {scoreInfo.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Student's Performance Prediction
            </h2>
            <p className="text-gray-200">Based on Student's Details</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Risk Level */}
          <div
            className={`text-center mb-6 transform transition-all duration-700 delay-200 ${
              animationStep >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div
              className={`inline-flex items-center px-6 py-3 rounded-full ${scoreInfo.bgColor} ${scoreInfo.color} mb-3`}
            >
              <span className="text-2xl mr-2">{scoreInfo.icon}</span>
              <span className="text-xl font-bold">{scoreInfo.level}</span>
            </div>
            <p className="text-gray-400 text-sm">{scoreInfo.description}</p>
          </div>

          {/* Prediction Score */}
          <div
            className={`bg-gray-800 rounded-xl p-4 mb-6 text-center transform transition-all duration-700 delay-300 ${
              animationStep >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="text-4xl font-bold text-white mb-2">
              {roundedPrediction}
            </div>
            <div className="text-gray-400">Math Score</div>
          </div>

          {/* Academic Status */}
          <div
            className={`mb-6 transform transition-all duration-700 delay-400 ${
              animationStep >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              Academic Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center shadow-sm border border-white/20">
                <div className="text-2xl mb-1">🚻</div>
                <div className="text-sm text-gray-400">Gender</div>
                <div className="font-semibold text-white">{formData.Gender}</div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-lg p-3 text-center shadow-sm border border-indigo-500/20">
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-sm text-gray-400">Ethnicity</div>
                <div className="font-semibold text-white">{formData.Ethnicity}</div>
              </div>

              <div className="bg-indigo-900/40 rounded-lg p-3 text-center shadow-md border border-indigo-700/50">
                <div className="text-2xl mb-1 text-indigo-400">📖</div>
                <div className="text-sm text-indigo-300">Reading Score</div>
                <div className="font-semibold text-white">{formData.ReadingScore}</div>
              </div>


              <div className="bg-gray-800/50 rounded-lg p-3 text-center shadow-md">
                <div className="text-2xl mb-1">✍️</div>
                <div className="text-sm text-gray-400">Writing Score</div>
                <div className="font-semibold text-white">{formData.WritingScore}</div>
              </div>

            </div>
          </div>

          {/* Advice */}
          <div
            className={`p-4 mb-6 transform transition-all duration-700 delay-500 ${
              animationStep >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
            ${
              scoreInfo.level === "Bad Score"
                ? "bg-red-900/50 border-l-4 border-red-500 text-red-300"
                : scoreInfo.level === "Medium Score"
                ? "bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-300"
                : scoreInfo.level === "Good Score"
                ? "bg-blue-900/50 border-l-4 border-blue-500 text-blue-300"
                : "bg-green-900/50 border-l-4 border-green-500 text-green-300"
            }`}
          >
            <div className="flex items-start">
              <div>
                <h4 className="font-semibold mb-1">
                  {scoreInfo.level === "Bad Score" && "⚠️ Needs Improvement"}
                  {scoreInfo.level === "Medium Score" && "📘 Keep Practicing"}
                  {scoreInfo.level === "Good Score" && "🌟 Great Job"}
                  {scoreInfo.level === "High Score" && "🚀 Excellent Performance"}
                </h4>
                <p className="text-sm">{getScoreAdvice(scoreInfo.level)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex gap-3 transform transition-all duration-700 delay-600 ${
              animationStep >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Close
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResultModal;
