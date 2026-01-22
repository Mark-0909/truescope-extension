// Create context menu on extension install/update
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "truescope-analyze",
    title: "Analyze with TrueScope",
    contexts: ["selection"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "truescope-analyze") {
    const selectedText = info.selectionText;
    
    // Store the selected text in Chrome storage
    chrome.storage.local.set({ selectedText: selectedText }, () => {
      // Open the side panel
      chrome.sidePanel.open({ tabId: tab.id });
    });
  }
});
