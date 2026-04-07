const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let messagePort = null;
let portDisconnected = false;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'scraper') {
    messagePort = port;
    portDisconnected = false;
    
    // Handle port disconnection gracefully
    port.onDisconnect.addListener(() => {
      console.log('Port disconnected, continuing scraping without live updates');
      messagePort = null;
      portDisconnected = true;
    });
  }
});

const sendProgress = (current, total, businessName) => {
  if (messagePort && !portDisconnected) {
    try {
      messagePort.postMessage({ type: 'progress', current, total, businessName });
    } catch (error) {
      console.warn('Failed to send progress update:', error.message);
      portDisconnected = true;
      messagePort = null;
    }
  }
};

const sendStatus = (message) => {
  if (messagePort && !portDisconnected) {
    try {
      messagePort.postMessage({ type: 'status', message });
    } catch (error) {
      console.warn('Failed to send status update:', error.message);
      portDisconnected = true;
      messagePort = null;
    }
  }
};

const clickAndWait = async (element, waitTime = 1500) => {
  if (element) {
    element.click();
    await delay(waitTime);
    return true;
  }
  return false;
};

const extractDetailedInfo = async () => {
  await delay(2000);
  
  const business = {};
  
  try {
    const nameElement = document.querySelector('h1.fontHeadlineSmall, h1.DUwDvf, h1.qBF1Pd, h1.fontDisplayLarge');
    business.name = nameElement?.textContent?.trim() || '';
    
    if (!business.name) {
      console.warn('Could not find business name');
      return null;
    }
    
    const ratingContainer = document.querySelector('[role="img"][aria-label*="star"], [aria-label*="स्टार"], .F7nice');
    if (ratingContainer) {
      const ariaLabel = ratingContainer.getAttribute('aria-label') || '';
      const ratingMatch = ariaLabel.match(/(\d+\.?\d*)/);
      business.rating = ratingMatch ? parseFloat(ratingMatch[1]) : '';
      
      const reviewMatch = ariaLabel.match(/(\d+)\s*(reviews?|समीक्षा)/i);
      business.reviews_count = reviewMatch ? parseInt(reviewMatch[1]) : '';
    }
    
    const categoryButton = document.querySelector('button[jsaction*="category"]');
    business.category = categoryButton?.textContent?.trim() || '';
    
    if (!business.category) {
      const categorySpan = document.querySelector('.DkEaL');
      business.category = categorySpan?.textContent?.trim() || '';
    }
    
    const buttons = Array.from(document.querySelectorAll('button[data-item-id], button[data-tooltip], button[aria-label]'));
    
    const phoneButton = buttons.find(btn => {
      const dataId = btn.getAttribute('data-item-id') || '';
      const ariaLabel = btn.getAttribute('aria-label') || '';
      return dataId.includes('phone') || 
             ariaLabel.includes('Phone') || 
             ariaLabel.includes('फोन') ||
             btn.textContent.match(/\d{3}[-.\s]?\d{3}/);
    });
    
    if (phoneButton) {
      await clickAndWait(phoneButton, 800);
      
      const phoneText = phoneButton.textContent?.trim() || '';
      const phoneMatch = phoneText.match(/[\d\s\-\+\(\)]+/);
      business.phone = phoneMatch ? phoneMatch[0].trim() : '';
      
      const copyablePhone = document.querySelector('[data-item-id="phone"] [data-tooltip], [aria-label*="Copy phone"]');
      if (copyablePhone && !business.phone) {
        business.phone = copyablePhone.getAttribute('aria-label')?.replace(/Copy phone number:?/i, '').trim() || '';
      }
    }
    
    const websiteButton = buttons.find(btn => {
      const dataId = btn.getAttribute('data-item-id') || '';
      const ariaLabel = btn.getAttribute('aria-label') || '';
      return dataId === 'authority' || 
             ariaLabel.includes('Website') || 
             ariaLabel.includes('वेबसाइट');
    });
    
    if (websiteButton) {
      await clickAndWait(websiteButton, 500);
      const websiteLink = document.querySelector('a[data-item-id="authority"], a[href^="http"]:not([href*="google.com"])');
      business.website = websiteLink?.href || '';
    }
    
    const addressButton = buttons.find(btn => {
      const dataId = btn.getAttribute('data-item-id') || '';
      const ariaLabel = btn.getAttribute('aria-label') || '';
      return dataId.includes('address') || 
             ariaLabel.includes('Address') || 
             ariaLabel.includes('ठेगाना');
    });
    
    if (addressButton) {
      const ariaLabel = addressButton.getAttribute('aria-label') || '';
      business.address = ariaLabel.replace(/Address:|ठेगाना:/gi, '').trim();
      
      if (!business.address) {
        business.address = addressButton.textContent?.trim() || '';
      }
    }
    
    const emailLink = document.querySelector('a[href^="mailto:"]');
    business.email = emailLink?.href?.replace('mailto:', '') || '';
    
    const priceElement = document.querySelector('[aria-label*="Price"], [aria-label*="रू"]');
    if (priceElement) {
      business.price_range = priceElement.getAttribute('aria-label') || priceElement.textContent?.trim() || '';
    }
    
    const hoursButton = buttons.find(btn => {
      const ariaLabel = btn.getAttribute('aria-label') || '';
      return ariaLabel.includes('Hours') || ariaLabel.includes('घन्टा');
    });
    
    if (hoursButton) {
      const hoursText = hoursButton.textContent?.trim() || '';
      business.hours = hoursText;
      
      const openNow = hoursText.match(/(Open|खुला|Closed|बन्द)/i);
      business.open_now = openNow ? openNow[0] : '';
    }
    
    const plusCodeElement = document.querySelector('[data-item-id*="oloc"], .QSFF4b');
    if (plusCodeElement) {
      business.plus_code = plusCodeElement.textContent?.trim() || '';
    }
    
    business.google_maps_url = window.location.href;
    
    const coordinates = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordinates) {
      business.latitude = coordinates[1];
      business.longitude = coordinates[2];
    }
    
    const closeButtons = document.querySelectorAll('button[aria-label*="Back"], button[aria-label*="फर्क"], button[aria-label*="Close"], button.VfPpkd-icon-LgbsSe');
    for (const btn of closeButtons) {
      const ariaLabel = btn.getAttribute('aria-label') || '';
      if (ariaLabel.toLowerCase().includes('back') || ariaLabel.includes('फर्क')) {
        await clickAndWait(btn, 1000);
        break;
      }
    }
    
    console.log('Scraped business:', business);
    
  } catch (error) {
    console.error('Error extracting detailed info:', error);
  }
  
  return business;
};

const getBusinessCards = () => {
  const cards = document.querySelectorAll('a.hfpxzc[href*="/maps/place/"], a[href*="!4m"][href*="!3m"]');
  return Array.from(cards).filter(card => {
    const href = card.href || '';
    return href.includes('/maps/place/') || (href.includes('!4m') && href.includes('!3m'));
  });
};

const extractBusinessesFromDOM = async (maxResults) => {
  const businesses = [];
  const businessLinks = getBusinessCards();
  
  console.log(`🎯 Found ${businessLinks.length} business cards to scrape`);
  sendStatus(`Found ${businessLinks.length} businesses. Starting detailed extraction...`);
  
  const limit = maxResults > 0 ? Math.min(maxResults, businessLinks.length) : businessLinks.length;
  
  for (let i = 0; i < limit; i++) {
    try {
      console.log(`📍 Scraping business ${i + 1}/${limit}`);
      
      const cards = getBusinessCards();
      if (!cards[i]) {
        console.log('❌ No more cards found, breaking');
        break;
      }
      
      const businessName = cards[i].getAttribute('aria-label') || `Business ${i + 1}`;
      sendProgress(i + 1, limit, businessName);
      
      await clickAndWait(cards[i], 2500);
      
      const businessData = await extractDetailedInfo();
      
      if (businessData && businessData.name) {
        businesses.push(businessData);
        console.log(`✅ Scraped: ${businessData.name} (${businesses.length}/${limit})`);
      } else {
        console.warn(`⚠️ Skipped business ${i + 1} - no valid data`);
      }
      
      await delay(800);
      
    } catch (error) {
      console.error(`❌ Error scraping business ${i + 1}:`, error);
      sendStatus(`Error on business ${i + 1}, continuing...`);
    }
  }
  
  return businesses;
};

const scrollToLoadMore = async (maxResults, scrollDelay) => {
  const sidebar = document.querySelector('[role="feed"]') || 
                  document.querySelector('.m6QErb[role="main"]') ||
                  document.querySelector('[aria-label*="परिणाम"]') ||
                  document.querySelector('[aria-label*="Results"]');
  
  if (!sidebar) {
    console.log('⚠️ Sidebar not found, extracting current businesses');
    sendStatus('Sidebar not found. Extracting visible results...');
    return extractBusinessesFromDOM(maxResults);
  }

  console.log('🔄 Starting to scroll and load more results...');
  sendStatus('Loading all results. Please wait...');
  
  let previousCount = 0;
  let noChangeCount = 0;
  const maxNoChanges = 6;

  while (true) {
    const currentCards = getBusinessCards();
    const currentCount = currentCards.length;

    console.log(`📊 Loaded ${currentCount} business cards`);
    sendStatus(`Loaded ${currentCount} businesses...`);

    if (maxResults > 0 && currentCount >= maxResults) {
      console.log(`🎯 Reached max results limit: ${maxResults}`);
      break;
    }

    if (currentCount === previousCount) {
      noChangeCount++;
      console.log(`⏳ No new results (${noChangeCount}/${maxNoChanges})`);
      if (noChangeCount >= maxNoChanges) {
        console.log('✅ No more results to load');
        break;
      }
    } else {
      noChangeCount = 0;
    }

    previousCount = currentCount;

    try {
      sidebar.scrollBy(0, 1500);
      await delay(scrollDelay);
    } catch (error) {
      console.error('Error scrolling:', error);
      break;
    }
  }

  console.log(`✅ Finished loading. Starting detailed extraction of ${previousCount} businesses`);
  sendStatus(`Loaded ${previousCount} results. Extracting details...`);
  
  return extractBusinessesFromDOM(maxResults);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeBusinesses') {
    const maxResults = request.maxResults || 0;
    const autoScrollDelay = request.autoScrollDelay || 2000;

    console.log('🚀 Starting scraper with settings:', { maxResults, autoScrollDelay });

    scrollToLoadMore(maxResults, autoScrollDelay)
      .then((businesses) => {
        console.log(`🎉 Scraping complete! Total: ${businesses.length} businesses`);
        
        // Save to chrome.storage with error handling
        try {
          chrome.storage.local.set({ scrapedBusinesses: businesses }, () => {
            if (chrome.runtime.lastError) {
              console.warn('Failed to save to chrome.storage:', chrome.runtime.lastError);
            }
          });
        } catch (error) {
          console.warn('Chrome storage error:', error.message);
        }
        
        sendResponse({ businesses, success: true });
      })
      .catch((error) => {
        console.error('❌ Scraping failed:', error);
        sendResponse({ error: error.message, businesses: [] });
      });

    return true;
  }
});

console.log('✨ Google Maps Scraper Pro - Content script loaded and ready!');
