/**
 * Verifies the highlighted claim via WebSocket with real-time streaming
 * @param {string} claim - The claim to analyze
 * @param {Object} config - Configuration options
 * @param {number} config.maxEvidences - Maximum number of evidence articles to return
 * @param {boolean} config.useNonFactcheck - Whether to include non-factcheck sources
 * @param {Object} callbacks - Callback functions for different message types
 * @param {Function} callbacks.onMetadata - Called with initial metadata
 * @param {Function} callbacks.onResult - Called for each article result
 * @param {Function} callbacks.onComplete - Called when verification is complete
 * @param {Function} callbacks.onError - Called on error
 * @param {Function} callbacks.onWebSocketCreated - Called with the WebSocket instance
 * @returns {Promise<void>}
 */
export const verifyClaim = async (claim, config, callbacks = {}) => {
  return new Promise((resolve, reject) => {
    const baseUrl = import.meta.env.VITE_API_URL
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws'
    const wsHost = baseUrl.replace(/^https?:\/\//, '')
    const wsUrl = `${wsProtocol}://${wsHost}/v1/verify/ws`

    const ws = new WebSocket(wsUrl)
    let hasReceivedData = false

    // Notify that WebSocket was created so caller can store reference
    callbacks.onWebSocketCreated?.(ws)

    ws.onopen = () => {
      console.log(
        'WebSocket connected, sending claim and config:',
        claim,
        config,
      )
      ws.send(JSON.stringify({ claim: claim, config: config }))
    }

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data)
      hasReceivedData = true
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'search_hits') {
          console.log('Search results received:', data)
          callbacks.onSearchHit?.(data.hits)
        } else if (data.type === 'result') {
          console.log('Process results received:', data)
          callbacks.onResult?.(data)
        } else if (data.type === 'stats') {
          console.log('Stats received:', data)
          callbacks.onStats?.(data)
        } else if (data.type === 'remarks') {
          console.log('Remarks received:', data)
          callbacks.onRemarks?.(data)
        } else if (data.type === 'complete') {
          console.log('Verification complete:', data)
          ws.close()
        } else if (data.type === 'error') {
          console.log('Error during verification:', data)
          callbacks.onError?.(new Error(data.message))
          ws.close()
        }
      } catch (error) {
        console.error('Failed to parse message:', error.message)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      const errorMsg = error?.message || 'WebSocket connection failed'
      callbacks.onError?.(new Error(errorMsg))
      reject(error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      resolve()
    }

    // Timeout after 180 seconds (3 minutes)
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        console.warn('WebSocket timeout - closing connection')
        ws.close()
        if (!hasReceivedData) {
          const timeoutError = new Error('Request timeout - no data received')
          callbacks.onError?.(timeoutError)
          reject(timeoutError)
        } else {
          // If we received data, just resolve
          resolve()
        }
      }
    }, 180000)
  })
}
