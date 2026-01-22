/**
 * Fetches analysis data from the TrueScope API
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} - Analysis results from the API
 */
export const fetchAnalysisData = async (text) => {
  try {
    // Replace with your actual API endpoint
    const API_URL = 'https://api.truescope.com/analyze';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    return null;
  }
};
