import { useState, useEffect } from "react";
import BiasBar from "./BiasBar.jsx";
import ArticleCard from "./ArticleCard.jsx";
import InfoCard from "./InfoCard.jsx";
import Spinner from "./Spinner.jsx";
import TruthIcon from "../assets/Truth_Icon.png";
import FakeIcon from "../assets/Fake_Icon.png";
import NeedsContextIcon from "../assets/Needs_Context_Icon.png";
import { mapVerdictToLabel, verdictToTruthScore } from "../utils/scripts.js";

const getColorClasses = (verdictLabel, isAnalyzing = false) => {
  // Use neutral gray while loading
  if (isAnalyzing) {
    return {
      header: "bg-gray-500",
      statement: "bg-gray-700",
      hover: "hover:text-gray-300",
      textColor: "text-gray-700",
      icon: NeedsContextIcon,
      label: "Analyzing...",
    };
  }

  switch (verdictLabel) {
    case "true":
      return {
        header: "bg-green-500",
        statement: "bg-green-900",
        hover: "hover:text-green-300",
        textColor: "text-green-900",
        icon: TruthIcon,
        label: "Likely True",
      };
    case "fake":
      return {
        header: "bg-red-500",
        statement: "bg-red-900",
        hover: "hover:text-red-300",
        textColor: "text-red-900",
        icon: FakeIcon,
        label: "Likely Fake",
      };
    case "neutral":
      return {
        header: "bg-yellow-500",
        statement: "bg-yellow-800",
        hover: "hover:text-yellow-300",
        textColor: "text-yellow-700",
        icon: NeedsContextIcon,
        label: "Needs Context",
      };
    default:
      return {
        header: "bg-red-500",
        statement: "bg-red-900",
        hover: "hover:text-red-300",
        textColor: "text-red-900",
        icon: FakeIcon,
        label: "Likely Fake",
      };
  }
};

export default function Popup({
  overallVerdict,
  selectedText,
  scores,
  stats,
  isLoading,
}) {
  const [verdictLabel, setVerdictLabel] = useState(
    mapVerdictToLabel(overallVerdict),
  );
  const [colors, setColors] = useState(
    getColorClasses(verdictLabel, isLoading),
  );
  const [truthScore, setTruthScore] = useState(0);
  const [biasDivergence, setBiasDivergence] = useState(0);
  const [biasConsistency, setBiasConsistency] = useState(0);
  const [finalVerdictScore, setFinalVerdictScore] = useState(0);
  const [overallVerdictScore, setOverallVerdictScore] = useState(0);

  // Update values when stats change
  useEffect(() => {
    if (stats) {
      const newTruthScore = Math.round(
        (((stats.truth_confidence_score || 0) + 1) / 2) * 100,
      );
      const newBiasDivergence = Math.round(
        (((stats.bias_divergence || 0) + 1) / 2) * 100,
      );
      const newBiasConsistency = Math.round(
        (((stats.bias_consistency || 0) + 1) / 2) * 100,
      );

      setTruthScore(newTruthScore);
      setBiasDivergence(newBiasDivergence);
      setBiasConsistency(newBiasConsistency);

      // Update verdict label/colors and numeric score
      const finalVerdictValue = stats.final_verdict ?? 0;
      const overallVerdictValue = stats.overall_verdict ?? 0;
      const newVerdictLabel = mapVerdictToLabel(finalVerdictValue);
      const newFinalVerdictScore = Math.round(
        ((finalVerdictValue + 1) / 2) * 100,
      );
      const newOverallVerdictScore = Math.round(
        ((overallVerdictValue + 1) / 2) * 100,
      );

      setVerdictLabel(newVerdictLabel);
      setColors(getColorClasses(newVerdictLabel, false));
      setFinalVerdictScore(newFinalVerdictScore);
      setOverallVerdictScore(newOverallVerdictScore);
    }
  }, [stats]);

  // Update colors when loading state changes
  useEffect(() => {
    if (isLoading) {
      setColors(getColorClasses(verdictLabel, true));
    }
  }, [isLoading, verdictLabel]);

  return (
    <div className="w-full h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      {/*Statement Area*/}
      <div
        className={`flex flex-col items-center justify-center p-3 space-y-0 w-full ${colors.statement}`}
      >
        <p className="text-sm font-semibold italic text-white/80 wrap-break-words text-center w-full">
          "{selectedText || "P20 rice distributed nationwide next week."}"
        </p>
        <p className="text-xs font-semibold bold text-white/50">Statement</p>
      </div>

      {/*Verdict/Summary Area*/}
      <div className="flex border-b-3 border-black/20">
        {isLoading ? (
          <div className="flex items-center justify-center w-full p-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner size={40} />
              <p className="text-sm text-gray-500 animate-pulse">
                Analyzing claim...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-1 space-y-1 w-2/3">
              <p className="flex items-center gap-1 text-[15px] font-semibold text-black/70">
                <span>Final Verdict</span>
                <InfoCard
                  title="Final Verdict"
                  definition="This score represents the final verdict based on the full analysis."
                />
                <span>:</span>
                <span className="font-bold text-base">
                  {finalVerdictScore}%
                </span>
              </p>
              <p className="flex items-center gap-1 text-[15px] font-semibold text-black/70">
                <span>Overall Verdict</span>
                <InfoCard
                  title="Overall Verdict"
                  definition="This score represents the overall verdict based on aggregated article evidence."
                />
                <span>:</span>
                <span className="font-bold text-base">
                  {overallVerdictScore}%
                </span>
              </p>
              <p className="flex items-center gap-1 text-[15px] font-semibold text-black/70">
                <span>Truth Confidence Score</span>
                <InfoCard
                  title="Truth Confidence Score"
                  definition="This score represents the confidence level in the truthfulness of the statement based on the analysis of supporting and refuting articles."
                />
                <span>:</span>
                <span className="font-bold text-base">{truthScore}%</span>
              </p>
              <p className="flex items-center gap-1 text-base font-semibold text-black/70">
                <span>Bias Divergence</span>
                <InfoCard
                  title="Bias Divergence"
                  definition="This score measures the extent of divergence in bias among different sources."
                />
                <span>:</span>
                <span className="font-bold text-base">{biasDivergence}%</span>
              </p>
              <p className="flex items-center gap-1 text-base font-semibold text-black/70">
                <span>Bias Consistency Scoring</span>
                <InfoCard
                  title="Bias Consistency Scoring"
                  definition="This score indicates how consistent the bias is across different sources supporting the statement."
                />
                <span>:</span>
              </p>
              <BiasBar type="consistency" value={biasConsistency} />
            </div>
            <div className="flex flex-col items-center justify-center p-1 w-1/3 border-l-2 border-black/20 space-y-0">
              <img className="w-23 h-23 object-contain" src={colors.icon} />
              <p
                className={`m-0 text-sm -mt-1 font-bold italic ${colors.textColor}`}
              >
                {colors.label}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Articles Area */}
      <div className={`${colors.statement} text-white`}>
        <p className="px-2 py-2 font-bold text-[13px]">Supporting Articles</p>
      </div>
      <div className="flex-1 bg-white min-h-0 p-0 overflow-hidden overflow-y-auto flex flex-col gap-0">
        {scores.map((score, idx) => (
          <ArticleCard key={idx} score={score} />
        ))}
      </div>
    </div>
  );
}
