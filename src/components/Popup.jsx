import { useState, useEffect } from "react";
import FilterArea from "./filterArea.jsx";
import BiasBar from "./BiasBar.jsx";
import ArticleCard from "./ArticleCard.jsx";
import InfoCard from "./InfoCard.jsx";
import Spinner from "./Spinner.jsx";
import TruthIcon from "../assets/Truth_Icon.png";
import FakeIcon from "../assets/Fake_Icon.png";
import NeedsContextIcon from "../assets/Needs_Context_Icon.png";
import { mapVerdictToLabel } from "../utils/scripts.js";
import SearchResultCard from "./SearchResultCard.jsx";
import { Settings } from "lucide-react";
import ConfigPopup from "./ConfigPopup.jsx";

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
  phase,
  searchHits,
  results,
  stats,
  isLoading,
}) {
  const [verdictLabel, setVerdictLabel] = useState(
    mapVerdictToLabel(overallVerdict),
  );
  const [colors, setColors] = useState(
    getColorClasses(mapVerdictToLabel(overallVerdict), isLoading),
  );
  const [truthScore, setTruthScore] = useState(0);
  const [biasDivergence, setBiasDivergence] = useState(0);
  const [biasConsistency, setBiasConsistency] = useState(0);
  const [finalVerdictScore, setFinalVerdictScore] = useState(0);
  const [overallVerdictScore, setOverallVerdictScore] = useState(0);
  const [archivedIds, setArchivedIds] = useState(new Set());
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Helper to get a unique id for an article
  function getArticleId(item, idx) {
    return (
      item.id ||
      `${item.source || ""}_${item.title || ""}_${item.publish_date || ""}_${idx}`
    );
  }

  // Handler to archive an article by id
  const handleArchive = (id) => {
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Handler to unarchive an article by id
  const handleUnarchive = (id) => {
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Update values when stats change
  const [active, setActive] = useState("All");

  // Reset filter to 'All' when selectedText (claim) changes
  useEffect(() => {
    setActive("All");
  }, [selectedText]);
  // Determine which data set to use
  const items = phase === 0 ? searchHits : results;
  // Collect unique categories and counts using mapVerdictToLabel
  const categoryMap = items.reduce((acc, item) => {
    let cat = item.archived ? "Archived" : mapVerdictToLabel(item.verdict);
    cat = cat.charAt(0).toUpperCase() + cat.slice(1);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Map verdict labels for filter display only
  const verdictDisplayMap = {
    true: "Support",
    fake: "Refute",
    neutral: "Neutral",
  };

  // Precompute lists for each category for consistency
  const categorizedArticles = {
    Support: [],
    Refute: [],
    Neutral: [],
    Archived: [],
  };
  items.forEach((item, idx) => {
    const uniqueId = getArticleId(item, idx);
    const isArchived = archivedIds.has(uniqueId) || item.archived;
    const itemWithId = { ...item, id: uniqueId };
    if (isArchived) {
      categorizedArticles.Archived.push({ ...itemWithId, archived: true });
    } else {
      const verdict = mapVerdictToLabel(item.verdict);
      const display = verdictDisplayMap[verdict] || verdict;
      if (categorizedArticles[display]) {
        categorizedArticles[display].push(itemWithId);
      }
    }
  });
  // Compute non-archived items for correct filter counts
  const nonArchivedItems = items.filter((item, idx) => {
    const uniqueId =
      item.id ||
      `${item.source || ""}_${item.title || ""}_${item.publish_date || ""}_${idx}`;
    return !(archivedIds.has(uniqueId) || item.archived);
  });

  const filters = [
    { label: "All", count: nonArchivedItems.length },
    { label: "Support", count: categorizedArticles.Support.length },
    { label: "Refute", count: categorizedArticles.Refute.length },
    { label: "Neutral", count: categorizedArticles.Neutral.length },
    { label: "Archived", count: categorizedArticles.Archived.length },
  ].filter((f) => f.count > 0 || f.label === "All");

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
      const overallVerdictValue = stats.overall_verdict ?? 0;
      const newVerdictLabel = mapVerdictToLabel(overallVerdictValue);
      const newOverallVerdictScore = Math.round(
        ((overallVerdictValue + 1) / 2) * 100,
      );

      setVerdictLabel(newVerdictLabel);
      setColors(getColorClasses(newVerdictLabel, false));
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
              <div className="flex flex-col items-center w-full mt-1">
                <span
                  className={`font-bold text-3xl text-black mb-0 ${colors.textColor}`}
                >
                  {overallVerdictScore}%
                </span>
                <div className="flex items-center gap-1 text-[15px] font-semibold text-black/70">
                  <span>Overall Verdict</span>
                  <InfoCard
                    title="Overall Verdict"
                    definition="This score represents the overall verdict based on aggregated article evidence."
                  />
                </div>
              </div>
              <BiasBar type="consistency" value={overallVerdictScore} />
              <div className="flex flex-row items-end justify-between p-1 w-full border-t-2 border-black/20 mt-2">
                {/* Truth Confidence */}
                <div className="flex flex-col items-center mt-0 flex-1">
                  <span className="font-semibold text-[22px] text-black mb-1">
                    {truthScore}%
                  </span>
                  <div className="relative flex flex-row items-center gap-1 text-[13px] text-black leading-tight">
                    <span>Truth</span>
                    <span className="absolute -right-4 -top-1">
                      <InfoCard
                        title="Truth Confidence Score"
                        definition="This score represents the confidence level in the truthfulness of the statement based on the analysis of supporting and refuting articles."
                      />
                    </span>
                  </div>
                  <span className="text-[13px] text-black mt-0">
                    Confidence
                  </span>
                </div>
                {/* Bias Divergence */}
                <div className="flex flex-col items-center mt-0 flex-1">
                  <span className="font-semibold text-[22px] text-black mb-1">
                    {biasDivergence}%
                  </span>
                  <div className="relative flex flex-row items-center gap-1 text-[13px] text-black leading-tight">
                    <span>Bias</span>
                    <span className="absolute -right-4 -top-1">
                      <InfoCard
                        title="Bias Divergence"
                        definition="This score measures the extent of divergence in bias among different sources."
                      />
                    </span>
                  </div>
                  <span className="text-[13px] text-black mt-0">
                    Divergence
                  </span>
                </div>
                {/* Bias Consistency */}
                <div className="flex flex-col items-center mt-0 flex-1">
                  <span className="font-semibold text-[22px] text-black mb-1">
                    {biasConsistency}%
                  </span>
                  <div className="relative flex flex-row items-center gap-1 text-[13px] text-black leading-tight">
                    <span>Bias</span>
                    <span className="absolute -right-4 -top-1">
                      <InfoCard
                        title="Bias Consistency Scoring"
                        definition="This score indicates how consistent the bias is across different sources supporting the statement."
                      />
                    </span>
                  </div>
                  <span className="text-[13px] text-black mt-0">
                    Consistency
                  </span>
                </div>
              </div>
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
<div className={`${colors.statement} text-white flex justify-between items-center pl-2 pr-1 py-2`}>
  <p className="font-bold text-[13px]">Supporting Articles</p>
  
  <button 
    onClick={() => setIsConfigOpen(!isConfigOpen)}
    className="!bg-transparent !border-none !p-1 !rounded-full opacity-100 hover:opacity-60 hover:bg-white/10 transition-all duration-300 ease-in-out will-change-opacity cursor-pointer flex items-center justify-center !outline-none focus:!ring-0"
  >
    <Settings size={17} />
  </button>
</div>

      {/* Filter bar outside colored area */}
      <FilterArea
        active={active}
        setActive={setActive}
        filters={filters} 
        bgClass={colors.statement}
      />
      {/* Scrollable article list fills remaining space */}
      <div className="flex-1 bg-white min-h-0 p-0 overflow-hidden overflow-y-auto flex flex-col gap-0">
        {(() => {
          let list = items;
          if (active === "Support") list = categorizedArticles.Support;
          else if (active === "Refute") list = categorizedArticles.Refute;
          else if (active === "Neutral") list = categorizedArticles.Neutral;
          else if (active === "Archived") list = categorizedArticles.Archived;
          else if (active === "All")
            list = items
              .map((item, idx) => {
                const uniqueId =
                  item.id ||
                  `${item.source || ""}_${item.title || ""}_${item.publish_date || ""}_${idx}`;
                return { ...item, id: uniqueId };
              })
              .filter((item) => !(archivedIds.has(item.id) || item.archived));
          const Card = phase === 0 ? SearchResultCard : ArticleCard;
          return list.map((item, idx) => (
            <Card
              key={item.id || idx}
              {...(phase === 0
                ? { searchHit: item }
                : {
                    score: item,
                    onArchive: !item.archived ? handleArchive : undefined,
                    onUnarchive: item.archived ? handleUnarchive : undefined,
                  })}
            />
          ));
        })()}
      </div>
      {isConfigOpen && (
        <ConfigPopup 
          onClose={() => setIsConfigOpen(false)} 
          colors={colors}
        />
      )}
    </div>
  );
}
