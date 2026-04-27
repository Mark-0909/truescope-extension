function clearSelectedText() {
  chrome.storage.local.remove('selectedText')
}

// Create context menu on extension install/update
chrome.runtime.onInstalled.addListener(() => {
  clearSelectedText()

  chrome.contextMenus.create({
    id: 'truescope-analyze',
    title: 'Analyze with TrueScope',
    contexts: ['selection'],
  })
})

// Ensure a fresh side panel state on browser startup
chrome.runtime.onStartup.addListener(() => {
  clearSelectedText()
})

// Best-effort cleanup when the extension worker is being unloaded
chrome.runtime.onSuspend.addListener(() => {
  clearSelectedText()
})

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'truescope-analyze') {
    const selectedText = info.selectionText

    // Store the selected text in Chrome storage
    chrome.storage.local.set({ selectedText: selectedText }, () => {
      // Open the side panel
      chrome.sidePanel.open({ tabId: tab.id })
    })
  }
})
