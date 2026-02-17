import { useState, useEffect, useRef } from "react";
import Popup from "./components/Popup.jsx";
import { verifyClaim } from "./services/apiService.js";

function App() {
  const [overallVerdict, setOverallVerdict] = useState(null);
  const [scores, setScores] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Get selected text on initial load
    chrome.storage.local.get(["selectedText"], (result) => {
      if (result.selectedText) {
        setSelectedText(result.selectedText);
      }
    });

    // Listen for storage changes (when user selects new text while panel is open)
    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local" && changes.selectedText) {
        console.log("New text selected:", changes.selectedText.newValue);
        setSelectedText(changes.selectedText.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!selectedText) return;

    // Close any previous WebSocket connection
    if (wsRef.current) {
      console.log("Closing previous WebSocket");
      wsRef.current.close();
      wsRef.current = null;
    }

    // Reset all state for new claim
    setIsLoading(true);
    setError(null);
    setScores([]); // Clear previous scores
    setOverallVerdict(0);
    setStats({
      overall_verdict: 0,
      bias_divergence: 0,
      truth_confidence_score: 0,
      bias_consistency: 0,
      total_processed: 0,
    });

    verifyClaim(selectedText, {
      onMetadata: (data) => {
        console.log("Received metadata:", data);
        setMetadata(data);
      },
      onResult: (result) => {
        console.log("Received result:", result);
        // Extract article data from result.data and add to scores
        setScores((prev) => [...prev, result.data]);
        // Update stats as each result comes in
        if (result.stats) {
          setStats(result.stats);
        }
      },
      onComplete: (data) => {
        console.log("Verification complete:", data);
        // Extract final stats from complete message
        if (data.stats) {
          setOverallVerdict(data.stats.overall_verdict);
          setStats(data.stats);
        }
        setIsLoading(false);
      },
      onError: (err) => {
        console.error("Verification error:", err);
        setError(err.message);
        setIsLoading(false);
      },
      onWebSocketCreated: (ws) => {
        wsRef.current = ws;
      },
    }).catch((err) => {
      console.error("Failed to verify claim:", err);
      setError(err.message);
      setIsLoading(false);
    });

    // Cleanup function when component unmounts or selectedText changes
    return () => {
      if (wsRef.current) {
        console.log("Cleaning up WebSocket");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [selectedText]);

  if (error) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (selectedText) {
    return (
      <Popup
        overallVerdict={overallVerdict || 0}
        selectedText={selectedText}
        scores={scores}
        stats={stats}
        isLoading={isLoading}
      />
    );
  }

  return "No relevant article found :(";
}

export default App;
