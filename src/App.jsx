import { useState, useEffect } from "react";
import Popup from "./components/Popup.jsx";
import { verifyClaim } from "./services/apiService.js";
import Spinner from "./components/Spinner.jsx";
import { useQuery } from "@tanstack/react-query";

function App() {
  const [overallVerdict, setOverallVerdict] = useState(null);
  const [scores, setScores] = useState(null);
  const [selectedText, setSelectedText] = useState(null);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["verify"],
    queryFn: () => verifyClaim(selectedText),
    enabled: selectedText !== null,
  });

  useEffect(() => {
    // Get selected text on page render
    chrome.storage.local.get(["selectedText"], async (result) => {
      if (result.selectedText) {
        setSelectedText(result.selectedText);
      }
    });
  }, []);

  useEffect(() => {
    if (!data) return;

    setScores(data.results);
    setOverallVerdict(data.overall_verdict);
  }, [data]);

  if (!data || isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner size={100} />
      </div>
    );
  }

  return (
    <>
      {overallVerdict && scores && (
        <Popup
          overallVerdict={overallVerdict}
          selectedText={selectedText}
          scores={scores}
        />
      )}
    </>
  );
}

export default App;
