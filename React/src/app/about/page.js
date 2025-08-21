"use client";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            🎓 Student Performance Prediction
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A machine learning powered tool to analyze key factors and predict student outcomes —
            helping educators and learners unlock their full potential.
          </p>
        </header>

        {/* Intro Card */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-lg">
          <p className="text-lg leading-relaxed text-gray-300">
            The <span className="font-semibold text-blue-400">Student Performance Prediction</span>{" "}
            project leverages{" "}
            <span className="text-purple-400 font-medium">machine learning models</span> to estimate 
            academic performance using features such as{" "}
            <span className="text-blue-400">gender, ethnicity, parental education, lunch type, 
            preparation courses, and exam scores</span>.
          </p>
        </section>

        {/* Why Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">✨ Why this project?</h2>
          <p className="text-gray-400 text-lg">
            Academic performance depends on{" "}
            <span className="text-blue-400 font-medium">social, personal, and educational factors</span>. 
            By analyzing these, the system provides actionable insights that 
            highlight strengths and pinpoint areas needing improvement.
          </p>
        </section>

        {/* How it Works */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">⚙️ How it works?</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">1</span>
              Fill in the student details in the prediction form.
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">2</span>
              Data is processed by a trained ML model.
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">3</span>
              Receive a prediction score with performance insights.
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">4</span>
              Track all past predictions in your personal dashboard.
            </li>
          </ol>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">📊 Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Interactive prediction form",
              "Clear feedback & advice system",
              "Prediction history dashboard",
              "Modern, responsive design",
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 text-gray-300 hover:bg-[#21262d] transition"
              >
                ✅ {feature}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-10">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105"
          >
            🔙 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
