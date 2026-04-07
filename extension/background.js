chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getScrapedData') {
    try {
      chrome.storage.local.get('scrapedBusinesses', (data) => {
        if (chrome.runtime.lastError) {
          console.warn('Failed to load from chrome.storage:', chrome.runtime.lastError);
          sendResponse([]);
          return;
        }
        sendResponse(data.scrapedBusinesses || []);
      });
    } catch (error) {
      console.warn('Chrome storage error:', error.message);
      sendResponse([]);
    }
    return true;
  }
});
