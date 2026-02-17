/**
 * Verifies the highlighted claim via WebSocket with real-time streaming
 * @param {string} claim - The claim to analyze
 * @param {Object} callbacks - Callback functions for different message types
 * @param {Function} callbacks.onMetadata - Called with initial metadata
 * @param {Function} callbacks.onResult - Called for each article result
 * @param {Function} callbacks.onComplete - Called when verification is complete
 * @param {Function} callbacks.onError - Called on error
 * @param {Function} callbacks.onWebSocketCreated - Called with the WebSocket instance
 * @returns {Promise<void>}
 */
export const verifyClaim = async (claim, callbacks = {}) => {
  return new Promise((resolve, reject) => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const wsHost = baseUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsProtocol}://${wsHost}/v1/verify/ws`;

    const ws = new WebSocket(wsUrl);
    let hasReceivedData = false;

    // Notify that WebSocket was created so caller can store reference
    callbacks.onWebSocketCreated?.(ws);

    ws.onopen = () => {
      console.log("WebSocket connected, sending claim:", claim);
      ws.send(JSON.stringify({ claim: claim }));
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      hasReceivedData = true;
      try {
        const data = JSON.parse(event.data);

        // Handle initial metadata
        if (data.entities && !data.type) {
          console.log("Initial metadata received:", data);
          callbacks.onMetadata?.(data);
        }
        // Handle individual result
        else if (data.type === "result") {
          console.log("Result received:", data);
          callbacks.onResult?.(data);
        }
        // Handle completion
        else if (data.type === "complete") {
          console.log("Verification complete:", data);
          callbacks.onComplete?.(data);
          ws.close();
        }
      } catch (error) {
        console.error("Failed to parse message:", error.message);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      const errorMsg = error?.message || "WebSocket connection failed";
      callbacks.onError?.(new Error(errorMsg));
      reject(error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      resolve();
    };

    // Timeout after 180 seconds (3 minutes)
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        console.warn("WebSocket timeout - closing connection");
        ws.close();
        if (!hasReceivedData) {
          const timeoutError = new Error("Request timeout - no data received");
          callbacks.onError?.(timeoutError);
          reject(timeoutError);
        } else {
          // If we received data, just resolve
          resolve();
        }
      }
    }, 180000);
  });
};
