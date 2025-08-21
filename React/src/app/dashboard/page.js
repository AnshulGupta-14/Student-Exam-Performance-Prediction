"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import DashboardChart from "@/Components/DashboardChart.jsx";

function DashboardPage() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gsap, setGsap] = useState(null);

  const summaryRef = useRef(null);
  const chartsRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    const loadGSAP = async () => {
      try {
        const { gsap: gsapModule, ScrollToPlugin } = await import("gsap");
        gsapModule.registerPlugin(ScrollToPlugin);
        setGsap(gsapModule);
      } catch (error) {
        console.error("Failed to load GSAP:", error);
      }
    };
    loadGSAP();
    return () => {
      if (gsap) gsap.killTweensOf(window);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studentPerformancePredictions");
      setPredictions(saved ? JSON.parse(saved) : []);
    } catch {
      setPredictions([]);
    }
    setIsLoading(false);
  }, []);

  const chartData = useMemo(() => {
    if (predictions.length === 0)
      return { readingScoreTrend: [], predictionTrend: [], scoreDistribution: [], writingScoreTrend: [] };

    const last5 = predictions.slice(0, 5).reverse();

    return {
      readingScoreTrend: last5.map((p, i) => ({ x: i + 1, y: p.reading_score, label: p.date })),
      writingScoreTrend: last5.map((p, i) => ({ x: i + 1, y: p.writing_score, label: p.date })),
      predictionTrend: last5.map((p, i) => ({ x: i + 1, y: p.prediction, label: p.date })),
      scoreDistribution: Object.entries(
        predictions.reduce((acc, p) => {
          acc[p.score] = (acc[p.score] || 0) + 1;
          return acc;
        }, {})
      ).map(([score, count]) => ({ x: score, y: count, label: score }))
    };
  }, [predictions]);

  const summaryStats = useMemo(() => {
    if (predictions.length === 0) return { total: 0, average: 0, highest: 0, lowest: 0 };
    const vals = predictions.map((p) => p.prediction);
    return {
      total: predictions.length,
      average: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1),
      highest: Math.max(...vals).toFixed(1),
      lowest: Math.min(...vals).toFixed(1)
    };
  }, [predictions]);

  const getScoreColor = useCallback((score) => {
    switch (score) {
      case "High Score": return "text-green-400";
      case "Good Score": return "text-yellow-400";
      case "Medium Score": return "text-orange-400";
      case "Bad Score": return "text-red-400";
      default: return "text-gray-400";
    }
  }, []);

  const getScoreBgColor = useCallback((risk) => {
    switch (risk) {
      case "High Score": return "bg-green-900/30";
      case "Good Score": return "bg-yellow-900/30";
      case "Medium Score": return "bg-orange-900/30";
      case "Bad Score": return "bg-red-900/30";
      default: return "bg-gray-800/30";
    }
  }, []);

  const scrollToSection = useCallback((ref, offset = 80) => {
    if (ref.current && gsap && gsap.to && gsap.ScrollToPlugin) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: ref.current, offsetY: offset },
        ease: "power2.out"
      });
    } else {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => window.scrollBy(0, -offset), 100);
    }
  }, [gsap]);

  if (isLoading || !gsap) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#30363D] mx-auto"></div>
          <p className="mt-4 text-gray-400">{isLoading ? "Loading your predictions..." : "Loading animations..."}</p>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#161B22] rounded-xl shadow-lg p-12">
            <div className="text-6xl mb-6">🔥</div>
            <h1 className="text-3xl font-bold text-white mb-4">No Predictions Yet</h1>
            <p className="text-lg text-gray-400 mb-8">You haven't made any student performance predictions yet.</p>
            <button onClick={() => (window.location.href = "/")} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium">
              Make Your First Prediction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">📊 Student's Math Score Predictions</h1>
          <p className="text-lg text-gray-400 mb-6">Track your prediction history and analyze trends</p>
        </div>

        {/* Summary */}
        <div ref={summaryRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Predictions", value: summaryStats.total, color: "text-blue-400" },
            { label: "Average Score", value: summaryStats.average, color: "text-orange-400" },
            { label: "Highest Score", value: summaryStats.highest, color: "text-green-400" },
            { label: "Lowest Score", value: summaryStats.lowest, color: "text-red-400" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#161B22] rounded-xl shadow p-6 text-center hover:scale-105 transition-transform">
              <h3 className="text-sm font-medium text-gray-400 mb-2">{stat.label}</h3>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DashboardChart data={chartData.readingScoreTrend} type="line" title="Reading Score Trend (Last 5)" height={250} />
          <DashboardChart data={chartData.writingScoreTrend} type="line" title="Writing Score Trend (Last 5)" height={250} />
          <DashboardChart data={chartData.predictionTrend} type="line" title="Math Score Trend (Last 5)" height={250} />
          <DashboardChart data={chartData.scoreDistribution} type="bar" title="Math Score Distribution (Last 5)" height={250} />
        </div>

        {/* History Table */}
        <div ref={historyRef} className="bg-[#161B22] rounded-xl shadow p-6 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-white">Your Prediction History</h2>
          <table className="min-w-full divide-y divide-[#30363D]">
            <thead className="bg-[#21262D]">
              <tr>
                {["Date", "Gender", "Ethnicity", "Reading", "Writing", "Math", "Level"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {predictions.map((p) => (
                <tr key={p.id} className="hover:bg-[#21262D] transition-colors">
                  <td className="px-6 py-4 text-sm">{p.date}</td>
                  <td className="px-6 py-4 text-sm">{p.gender}</td>
                  <td className="px-6 py-4 text-sm capitalize">{p.ethnicity}</td>
                  <td className="px-6 py-4 text-sm">{parseFloat(p.reading_score).toFixed(1)}</td>
                  <td className="px-6 py-4 text-sm">{parseFloat(p.writing_score).toFixed(1)}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${getScoreColor(p.score)}`}>{parseFloat(p.prediction).toFixed(1)}</td>
                  <td><span className={`px-2 py-1 text-xs rounded-full ${getScoreBgColor(p.score)} ${getScoreColor(p.score)}`}>{p.score}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => (window.location.href = "/")} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
            Make New Prediction
          </button>
          <button onClick={() => (window.location.href = "/about")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
