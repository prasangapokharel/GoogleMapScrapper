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

const clickAndWait = async (element, waitTime = 1000) => {
  if (element) {
    element.click();
    await delay(waitTime);
    return true;
  }
  return false;
};

// ⚡ OPTIMIZED: Faster extraction with improved selectors
const extractDetailedInfo = async () => {
  await delay(1200); // ⚡ ULTRA-FAST: 1800ms → 1200ms (33% faster)
  
  const business = {};
  
  try {
    // Extract business name
    const nameElement = document.querySelector('h1.fontHeadlineSmall, h1.DUwDvf, h1.qBF1Pd, h1.fontDisplayLarge');
    business.name = nameElement?.textContent?.trim() || '';
    
    if (!business.name) {
      console.warn('Could not find business name');
      return null;
    }
    
    // Extract rating and reviews
    const ratingContainer = document.querySelector('[role="img"][aria-label*="star"], [aria-label*="स्टार"], .F7nice');
    if (ratingContainer) {
      const ariaLabel = ratingContainer.getAttribute('aria-label') || '';
      const ratingMatch = ariaLabel.match(/(\d+\.?\d*)/);
      business.rating = ratingMatch ? parseFloat(ratingMatch[1]) : '';
      
      const reviewMatch = ariaLabel.match(/(\d+[\.,]?\d*)\s*(reviews?|समीक्षा)/i);
      business.reviews_count = reviewMatch ? reviewMatch[1].replace(',', '') : '';
    }
    
    // Extract category
    const categoryButton = document.querySelector('button[jsaction*="category"]');
    business.category = categoryButton?.textContent?.trim() || '';
    
    if (!business.category) {
      const categorySpan = document.querySelector('.DkEaL');
      business.category = categorySpan?.textContent?.trim() || '';
    }
    
    // ⚡ OPTIMIZED: Get all buttons at once
    const allButtons = Array.from(document.querySelectorAll('button[data-item-id], a[data-item-id], button[aria-label]'));
    const allLinks = Array.from(document.querySelectorAll('a[data-item-id], a[href^="http"]'));
    
    // ⚡ IMPROVED: Better website extraction using the provided selectors
    const websiteLink = document.querySelector('a[data-item-id="authority"]') || 
                       allLinks.find(a => a.getAttribute('aria-label')?.includes('Website') || 
                                          a.getAttribute('aria-label')?.includes('वेबसाइट'));
    
    if (websiteLink) {
      business.website = websiteLink.href || '';
      
      // Extract clean website text from div.Io6YTe
      const websiteText = websiteLink.querySelector('.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
      if (websiteText && !business.website) {
        business.website = 'https://' + websiteText.textContent.trim();
      }
    }
    
    // ⚡ IMPROVED: Better phone extraction
    const phoneButton = allButtons.find(btn => {
      const dataId = btn.getAttribute('data-item-id') || '';
      return dataId.includes('phone:tel:');
    }) || allButtons.find(btn => {
      const ariaLabel = btn.getAttribute('aria-label') || '';
      return ariaLabel.includes('Phone') || ariaLabel.includes('फोन');
    });
    
    if (phoneButton) {
      // Try to extract from data-item-id first (most reliable)
      const dataId = phoneButton.getAttribute('data-item-id') || '';
      if (dataId.includes('phone:tel:')) {
        business.phone = dataId.replace('phone:tel:', '').trim();
      }
      
      // Fallback: extract from button text using improved selector
      if (!business.phone) {
        const phoneText = phoneButton.querySelector('.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
        if (phoneText) {
          business.phone = phoneText.textContent.trim();
        } else {
          const phoneMatch = phoneButton.textContent.match(/[\d\s\-\+\(\)]+/);
          business.phone = phoneMatch ? phoneMatch[0].trim() : '';
        }
      }
    }
    
    // ⚡ IMPROVED: Better address extraction
    const addressButton = allButtons.find(btn => {
      const dataId = btn.getAttribute('data-item-id') || '';
      return dataId === 'address';
    });
    
    if (addressButton) {
      // Try to get from aria-label first
      const ariaLabel = addressButton.getAttribute('aria-label') || '';
      business.address = ariaLabel.replace(/Address:|ठेगाना:/gi, '').trim();
      
      // Fallback: use improved selector
      if (!business.address || business.address.length < 5) {
        const addressText = addressButton.querySelector('.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
        if (addressText) {
          business.address = addressText.textContent.trim();
        } else {
          business.address = addressButton.textContent?.trim() || '';
        }
      }
    }
    
    // ⚡ IMPROVED: Email extraction (multiple methods)
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      business.email = emailLink.href.replace('mailto:', '').trim();
    } else {
      // Try to find email in text content
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const bodyText = document.body.textContent;
      const emailMatch = bodyText.match(emailRegex);
      if (emailMatch) {
        business.email = emailMatch[0];
      }
    }
    
    // Extract price range
    const priceElement = document.querySelector('.fontBodyMedium:has(.sBBhZ), [aria-label*="per person"]');
    if (priceElement) {
      const priceText = priceElement.textContent.trim();
      business.price_range = priceText.split('\n')[0] || priceText;
    }
    
    // ⚡ IMPROVED: Better hours extraction
    const hoursButton = allButtons.find(btn => {
      const dataId = btn.getAttribute('data-item-id') || '';
      return dataId === 'oh';
    }) || allButtons.find(btn => {
      const ariaLabel = btn.getAttribute('aria-label') || '';
      return ariaLabel.includes('Open') || ariaLabel.includes('Closed') || ariaLabel.includes('Hours');
    });
    
    if (hoursButton) {
      const hoursText = hoursButton.querySelector('.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
      if (hoursText) {
        business.hours = hoursText.textContent.trim();
      } else {
        business.hours = hoursButton.textContent?.trim() || '';
      }
      
      // Determine open/closed status
      const openMatch = business.hours.match(/(Open|खुला|Closed|बन्द)/i);
      business.open_now = openMatch ? openMatch[0] : '';
    }
    
    // Extract Plus Code
    const plusCodeButton = allButtons.find(btn => {
      const dataId = btn.getAttribute('data-item-id') || '';
      return dataId === 'oloc';
    });
    
    if (plusCodeButton) {
      const plusCodeText = plusCodeButton.querySelector('.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
      if (plusCodeText) {
        business.plus_code = plusCodeText.textContent.trim();
      } else {
        business.plus_code = plusCodeButton.textContent?.trim() || '';
      }
    }
    
    // Extract URL and coordinates
    business.google_maps_url = window.location.href;
    
    const coordinates = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordinates) {
      business.latitude = coordinates[1];
      business.longitude = coordinates[2];
    }
    
    // ⚡ IMPROVED: Better close button detection and click
    const closeButton = document.querySelector('button[aria-label*="Back"]') ||
                       document.querySelector('button[aria-label*="Close"]') ||
                       document.querySelector('button.VfPpkd-icon-LgbsSe[aria-label]') ||
                       Array.from(document.querySelectorAll('button[aria-label]')).find(btn => {
                         const label = btn.getAttribute('aria-label') || '';
                         return label.toLowerCase().includes('back') || 
                                label.includes('फर्क') ||
                                label.toLowerCase().includes('close');
                       });
    
    if (closeButton) {
      console.log('🔙 Closing detail panel with ESC key...');
      // ⚠️ CRITICAL FIX: Use ESC key instead of button click to avoid browser navigation
      // Clicking the back button triggers history.back() which redirects away from search results
      // Pressing ESC closes the panel WITHOUT navigating browser history
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(escapeEvent);
      await delay(500); // ⚡ ULTRA-FAST: 800ms → 500ms (37% faster)
    } else {
      console.warn('⚠️ Close button not found, trying ESC key fallback...');
      // Fallback: Try ESC key even without finding close button
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(escapeEvent);
      await delay(500);
    }
    
    console.log('✅ Scraped:', business.name);
    
  } catch (error) {
    console.error('❌ Error extracting:', error);
  }
  
  return business;
};

const getBusinessCards = () => {
  const selector1 = 'a.hfpxzc[href*="/maps/place/"]';
  const selector2 = 'a[href*="!4m"][href*="!3m"]';
  
  const cards1 = document.querySelectorAll(selector1);
  const cards2 = document.querySelectorAll(selector2);
  
  console.log(`🔍 Found ${cards1.length} cards with selector1, ${cards2.length} with selector2`);
  
  const allCards = document.querySelectorAll(`${selector1}, ${selector2}`);
  const filteredCards = Array.from(allCards).filter(card => {
    const href = card.href || '';
    return href.includes('/maps/place/') || (href.includes('!4m') && href.includes('!3m'));
  });
  
  console.log(`🎯 Total filtered cards: ${filteredCards.length}`);
  return filteredCards;
};

// ⚡ NEW: Parallel scraping with batch processing
const extractBusinessesParallel = async (maxResults, batchSize = 3) => {
  const businesses = [];
  const businessLinks = getBusinessCards();
  
  console.log(`🚀 Found ${businessLinks.length} businesses. Using PARALLEL mode with batch size ${batchSize}`);
  sendStatus(`Found ${businessLinks.length} businesses. Starting PARALLEL extraction...`);
  
  const limit = maxResults > 0 ? Math.min(maxResults, businessLinks.length) : businessLinks.length;
  
  // Process in batches for optimal performance
  for (let i = 0; i < limit; i += batchSize) {
    const batch = [];
    const batchEnd = Math.min(i + batchSize, limit);
    
    for (let j = i; j < batchEnd; j++) {
      const index = j;
      
      // Create async task for each business
      const task = (async () => {
        try {
          const cards = getBusinessCards();
          if (!cards[index]) return null;
          
          const businessName = cards[index].getAttribute('aria-label') || `Business ${index + 1}`;
          sendProgress(index + 1, limit, businessName);
          
          console.log(`📍 [${index + 1}/${limit}] Scraping: ${businessName}`);
          
          await clickAndWait(cards[index], 2000);
          const businessData = await extractDetailedInfo();
          
          if (businessData && businessData.name) {
            console.log(`✅ [${index + 1}/${limit}] Done: ${businessData.name}`);
            return businessData;
          }
          
          return null;
        } catch (error) {
          console.error(`❌ Error on business ${index + 1}:`, error);
          return null;
        }
      })();
      
      batch.push(task);
    }
    
    // Wait for current batch to complete
    const results = await Promise.all(batch);
    
    // Add valid results
    results.forEach(result => {
      if (result) businesses.push(result);
    });
    
    console.log(`📊 Batch complete. Total scraped: ${businesses.length}/${limit}`);
    
    // Small delay between batches
    if (batchEnd < limit) {
      await delay(500);
    }
  }
  
  return businesses;
};

// Standard sequential extraction (original method)
const extractBusinessesSequential = async (maxResults) => {
  const businesses = [];
  
  // Re-query business cards to get fresh references
  let businessLinks = getBusinessCards();
  
  console.log(`🎯 Found ${businessLinks.length} businesses. Using SEQUENTIAL mode`);
  sendStatus(`Found ${businessLinks.length} businesses. Starting extraction...`);
  
  if (businessLinks.length === 0) {
    console.error('❌ No business cards found! Check selectors.');
    return businesses;
  }
  
  const limit = maxResults > 0 ? Math.min(maxResults, businessLinks.length) : businessLinks.length;
  console.log(`📊 Will extract ${limit} businesses (maxResults: ${maxResults}, available: ${businessLinks.length})`);
  
  for (let i = 0; i < limit; i++) {
    try {
      // Re-query cards each iteration to get fresh references
      const cards = getBusinessCards();
      
      if (!cards || cards.length === 0) {
        console.error('❌ No cards found in iteration', i);
        break;
      }
      
      if (!cards[i]) {
        console.log(`❌ No more cards found at index ${i} (total cards: ${cards.length})`);
        break;
      }
      
      const businessName = cards[i].getAttribute('aria-label') || `Business ${i + 1}`;
      sendProgress(i + 1, limit, businessName);
      
      console.log(`📍 [${i + 1}/${limit}] Scraping: ${businessName}`);
      
      // Scroll card into view before clicking
       try {
         cards[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
         await delay(150); // ⚡ ULTRA-FAST: 300ms → 150ms (50% faster)
       } catch (scrollError) {
         console.warn('⚠️ Scroll error:', scrollError);
       }
       
       // Click the business card
       await clickAndWait(cards[i], 1500); // ⚡ ULTRA-FAST: 2500ms → 1500ms (40% faster)
       
       // Extract the data
       const businessData = await extractDetailedInfo();
       
       if (businessData && businessData.name) {
         businesses.push(businessData);
         console.log(`✅ [${i + 1}/${limit}] Done: ${businessData.name}`);
       } else {
         console.warn(`⚠️ Skipped business ${i + 1} - no valid data`);
       }
       
       // Delay before next iteration
       await delay(300); // ⚡ ULTRA-FAST: 600ms → 300ms (50% faster)
      
    } catch (error) {
      console.error(`❌ Error on business ${i + 1}:`, error);
      sendStatus(`Error on business ${i + 1}, continuing...`);
    }
  }
  
  console.log(`🎉 Extraction complete! Got ${businesses.length} businesses`);
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
    return extractBusinessesSequential(maxResults);
  }

  console.log('🔄 Auto-scrolling to load all results...');
  sendStatus('Loading all results. Please wait...');
  
  let previousCount = 0;
  let noChangeCount = 0;
  const maxNoChanges = 5; // Reduced from 6

  while (true) {
    const currentCards = getBusinessCards();
    const currentCount = currentCards.length;

    console.log(`📊 Loaded ${currentCount} businesses`);
    sendStatus(`Loaded ${currentCount} businesses...`);

    if (maxResults > 0 && currentCount >= maxResults) {
      console.log(`🎯 Reached max: ${maxResults}`);
      break;
    }

    if (currentCount === previousCount) {
      noChangeCount++;
      if (noChangeCount >= maxNoChanges) {
        console.log('✅ All results loaded');
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
      console.error('❌ Scroll error:', error);
      break;
    }
  }

  console.log(`✅ Loaded ${previousCount} businesses. Starting extraction...`);
  sendStatus(`Loaded ${previousCount} results. Extracting details...`);
  
  // Wait for DOM to stabilize after scrolling
  await delay(500); // ⚡ ULTRA-FAST: 1000ms → 500ms (50% faster)
  console.log('🔄 DOM stabilization complete, starting extraction...');
  
  // Use sequential extraction for now (can switch to parallel if needed)
  return extractBusinessesSequential(maxResults);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeBusinesses') {
    const maxResults = request.maxResults || 0;
    const autoScrollDelay = request.autoScrollDelay || 2000;
    const useParallel = request.useParallel || false; // New option

    console.log('🚀 Scraper starting:', { maxResults, autoScrollDelay, useParallel });

    scrollToLoadMore(maxResults, autoScrollDelay)
      .then((businesses) => {
        console.log(`🎉 COMPLETE! Scraped ${businesses.length} businesses`);
        
        // Save to chrome.storage with error handling
        try {
          chrome.storage.local.set({ scrapedBusinesses: businesses }, () => {
            if (chrome.runtime.lastError) {
              console.warn('Storage error:', chrome.runtime.lastError);
            }
          });
        } catch (error) {
          console.warn('Storage error:', error.message);
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

console.log('⚡ Google Maps Scraper v1.1 - OPTIMIZED & READY!');
