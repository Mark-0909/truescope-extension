import { useState, useEffect } from 'react'
import Popup from './components/Popup.jsx'
import { fetchAnalysisData } from './services/apiService.js'

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for selected text from the background script
    chrome.storage.local.get(['selectedText'], async (result) => {
      if (result.selectedText) {
        setLoading(true);
        const data = await fetchAnalysisData(result.selectedText);
        setAnalysisData(data);
        setLoading(false);
      }
    });
  }, []);

  return(
    <Popup Verdict="fake"/>
  )
}

export default App
