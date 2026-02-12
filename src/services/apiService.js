import axios from "axios";

export const apiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(error.response.data.message);
    }
    return Promise.reject(error);
  },
);

/**
 * Verifies the highlighted claim
 * @param {string} claim - The claim to analyze
 * @returns {Promise<Object>} - Verification results from the API
 */
export const verifyClaim = async (claim) => {
  const res = await apiInstance.post("/verify", {
    claim: claim,
  });

  return res.data;
};
