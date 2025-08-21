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
      if (value !== "" && (isNaN(numValue) || numValue < 0)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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
        setError("⚠️ Please fill in all required fields");
        setLoading(false);
        return;
      }

      const ReadingScore = parseFloat(formData.ReadingScore);
      const WritingScore = parseFloat(formData.WritingScore);

      if (isNaN(ReadingScore) || isNaN(WritingScore)) {
        setError("⚠️ Please enter valid numbers for scores");
        setLoading(false);
        return;
      }

      // API call (dummy for now)
      await new Promise((res) => setTimeout(res, 1500));
      setPrediction(Math.floor(Math.random() * 100));
      setShowModal(true);

      setFormData({
        Gender: "",
        Ethnicity: "",
        ParentalEducation: "",
        Lunch: "",
        TestPreparationCourse: "",
        ReadingScore: "",
        WritingScore: "",
      });
    } catch (err) {
      setError(err.message || "Network error occurred");
    }
    setLoading(false);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-[#161b22] p-10 rounded-2xl shadow-2xl border border-[#30363d]">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-100">
          🎓 Student Performance Prediction
        </h1>
        <p className="text-gray-400 mt-2">
          Fill in the details below to predict performance
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          {
            label: "👦 Gender",
            name: "Gender",
            options: ["Male", "Female"],
          },
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
          { label: "📚 Reading Score", name: "ReadingScore" },
          { label: "✍️ Writing Score", name: "WritingScore" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.label}
            </label>
            {field.options ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] 
                          text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                          hover:border-blue-500 transition-colors"
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
            ) : (
              <input
                type="number"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] 
                          text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 
                          focus:ring-blue-500 hover:border-blue-500 transition-colors"
                placeholder={`Enter ${field.label.split(" ").slice(1).join(" ")}`}
                required
              />
            )}
          </div>
        ))}

        {/* Submit Button */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 
                      hover:to-blue-400 text-white py-3 px-4 rounded-lg font-semibold 
                      shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 
                      disabled:opacity-60 disabled:cursor-not-allowed"
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
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/40 border border-red-700 rounded-lg flex items-center">
          <span className="text-red-400 text-xl mr-2">⚠️</span>
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Link */}
      <div className="mt-6 text-center">
        <Link
          href="/dashboard"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          View your prediction history →
        </Link>
      </div>

      {/* Modal */}
      <PredictionResultModal
        isOpen={showModal}
        onClose={closeModal}
        prediction={prediction}
        formData={formData}
      />
    </div>
  );
}
