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
    let hasReceivedStats = false
    let timeoutId = null
    let didFinish = false

    const finishWithError = (error) => {
      if (didFinish) return
      didFinish = true
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      reject(error)
    }

    const finishSuccess = () => {
      if (didFinish) return
      didFinish = true
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      resolve()
    }

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
          hasReceivedStats = true
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
          finishWithError(new Error(data.message))
          ws.close()
        }
      } catch (error) {
        console.error('Failed to parse message:', error.message)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      const errorMsg = error?.message || 'WebSocket connection failed'
      finishWithError(new Error(errorMsg))
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      if (ws.__clientClose) {
        finishSuccess()
        return
      }
      if (!didFinish && !hasReceivedStats) {
        finishWithError(new Error('Connection closed before stats'))
        return
      }
      finishSuccess()
    }

    // Timeout after 180 seconds (3 minutes)
    timeoutId = setTimeout(() => {
      if (didFinish) return
      console.warn('WebSocket timeout - closing connection')
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close()
      }
      const timeoutError = hasReceivedData
        ? new Error('Request timeout - analysis incomplete')
        : new Error('Request timeout - no data received')
      finishWithError(timeoutError)
    }, 180000)
  })
}

export const calculateStats = async (evidences) => {
  const baseUrl = import.meta.env.VITE_API_URL
  const url = `${baseUrl}/v1/verify/calculate`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evidences),
  })
  if (!response.ok) {
    throw new Error('Failed to calculate stats')
  }
  return await response.json()
}
