import { useState } from "react";
import PredictionResultModal from "./PredictionResultModal.jsx";
import Link from "next/link.js";

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    Gender: "",
    Ethnicity: "",
    ParentalEducation: "",
    Lunch: "",
    TestPreparationCourse: "",
    ReadingScore: "",
    WritingScore: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["ReadingScore", "WritingScore"];

    if (numericFields.includes(name)) {
      const numValue = parseFloat(value);
      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePredictionToHistory = (predictionData) => {
    try {
      const existingPredictions = localStorage.getItem(
        "studentPerformancePredictions"
      );
      let predictions = existingPredictions
        ? JSON.parse(existingPredictions)
        : [];

      const newPrediction = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        gender: formData.Gender,
        ethnicity: formData.Ethnicity,
        parental_level_of_education: formData.ParentalEducation,
        lunch: formData.Lunch,
        test_preparation_course: formData.TestPreparationCourse,
        reading_score: parseFloat(formData.ReadingScore),
        writing_score: parseFloat(formData.WritingScore),
        prediction: predictionData.prediction,
        score: getScoreLevel(predictionData.prediction),
      };

      predictions.unshift(newPrediction);
      localStorage.setItem(
        "studentPerformancePredictions",
        JSON.stringify(predictions)
      );
    } catch (error) {
      console.error("Error saving prediction to history:", error);
    }
  };

  const getScoreLevel = (predictionValue) => {
    if (predictionValue < 33) return "Bad Score";
    if (predictionValue < 60) return "Medium Score";
    if (predictionValue < 80) return "Good Score";
    return "High Score";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    setLoading(true);

    try {
      if (
        !formData.Gender ||
        !formData.Ethnicity ||
        !formData.ParentalEducation ||
        !formData.Lunch ||
        !formData.TestPreparationCourse
      ) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const ReadingScore = parseFloat(formData.ReadingScore);
      const WritingScore = parseFloat(formData.WritingScore);

      if (isNaN(ReadingScore) || isNaN(WritingScore)) {
        setError("Please fill in all numeric fields with valid numbers");
        setLoading(false);
        return;
      }

      const apiPayload = {
        gender: formData.Gender.toLowerCase(),
        ethnicity: formData.Ethnicity,
        parental_level_of_education: formData.ParentalEducation.toLowerCase(),
        lunch: formData.Lunch.toLowerCase(),
        test_preparation_course: formData.TestPreparationCourse.toLowerCase(),
        reading_score: parseFloat(ReadingScore),
        writing_score: parseFloat(WritingScore),
      };

      const response = await fetch("https://student-exam-performance-prediction-8y25.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();

      if (response.ok) {
        const roundedPrediction = Math.round(data.prediction * 100) / 100;
        setPrediction(roundedPrediction);
        savePredictionToHistory({ prediction: roundedPrediction });
        setShowModal(true);
      } else {
        setError(
          data.error || `API Error: ${response.status} ${response.statusText}`
        );
      }
    } catch (err) {
      setError(err.message || "Network error occurred");
    }
    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setError(null);
    setPrediction(null);
    
    setFormData({
      Gender: "",
      Ethnicity: "",
      ParentalEducation: "",
      Lunch: "",
      TestPreparationCourse: "",
      ReadingScore: "",
      WritingScore: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 p-6">
      <div className="max-w-3xl mx-auto mt-10 bg-[#161b22] p-8 rounded-xl border border-[#30363d] shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎓 Student Performance Prediction
          </h1>
          <p className="text-gray-400">
            📊 Enter the details about the student below
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { label: "👦 Gender", name: "Gender", options: ["Male", "Female"] },
            {
              label: "🌍 Ethnicity",
              name: "Ethnicity",
              options: ["group A", "group B", "group C", "group D", "group E"],
            },
            {
              label: "🎓 Parental Education",
              name: "ParentalEducation",
              options: [
                "High School",
                "Associate's Degree",
                "Bachelor's Degree",
                "Master's Degree",
                "Some College",
                "Some High School",
              ],
            },
            {
              label: "🥪 Lunch",
              name: "Lunch",
              options: ["Standard", "Free/Reduced"],
            },
            {
              label: "📖 Test Prep Course",
              name: "TestPreparationCourse",
              options: ["None", "Completed"],
            },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
              </label>
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md 
                          bg-[#0d1117] border border-[#30363d] text-gray-200
                          focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
                required
              >
                <option value="">
                  Select {field.label.split(" ").slice(1).join(" ")}
                </option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Score Inputs */}
          {[
            { label: "📚 Reading Score", name: "ReadingScore" },
            { label: "✍️ Writing Score", name: "WritingScore" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label} (0 - 100)
              </label>
              <input
                type="number"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                className="w-full px-3 py-2 rounded-md 
                           bg-[#0d1117] border border-[#30363d] text-gray-200
                           focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb]
                           placeholder:text-gray-500"
                placeholder={`Enter ${field.label.split(" ").slice(1).join(" ")}`}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="col-span-1 md:col-span-2 w-full 
                       bg-[#238636] hover:bg-[#2ea043] 
                       disabled:bg-gray-600 text-white py-3 px-4 
                       rounded-md font-medium transition-all 
                       duration-300 hover:scale-105 active:scale-95
                       disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Predicting...
              </div>
            ) : (
              "🚀 Predict Student Performance"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-[#291212] border border-red-700 rounded-md">
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-2">❌</div>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-[#1f6feb] hover:underline text-sm font-medium"
          >
            📜 View your prediction history →
          </Link>
        </div>

        <PredictionResultModal
          isOpen={showModal}
          onClose={closeModal}
          prediction={prediction}
          formData={formData}
        />
      </div>
    </div>
  );
}
