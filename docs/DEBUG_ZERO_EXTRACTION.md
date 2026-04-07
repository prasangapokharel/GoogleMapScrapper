# 🐛 DEBUG: 0/0 Extraction Issue

## Problem
Scraper shows:
- ✅ Scroll phase: "Loaded 14 businesses..."
- ❌ Extraction phase: "EXTRACTING DATA... 0/0"
- Result: Total = 0

## Root Cause Analysis

The issue happens when:
1. **Scroll phase completes** and finds 14 business cards
2. **DOM changes** after scrolling stops
3. **Extraction phase starts** but can't find the same cards
4. Result: 0 businesses extracted

## New Debug Features (v1.1 latest)

### 1. Detailed Selector Logging
```javascript
getBusinessCards() now logs:
- 🔍 Found X cards with selector1, Y with selector2
- 🎯 Total filtered cards: Z
```

### 2. Re-query on Each Iteration
```javascript
// OLD: Query once at start
const businessLinks = getBusinessCards();
for (let i = 0; i < limit; i++) {
  // Use businessLinks[i] - may be stale!
}

// NEW: Re-query each time
for (let i = 0; i < limit; i++) {
  const cards = getBusinessCards(); // Fresh refs!
  if (!cards[i]) break;
}
```

### 3. DOM Stabilization Delay
```javascript
// After scrolling completes:
await delay(1000); // Let DOM settle
console.log('🔄 DOM stabilization complete');
return extractBusinessesSequential(maxResults);
```

### 4. Empty Card Detection
```javascript
if (businessLinks.length === 0) {
  console.error('❌ No business cards found! Check selectors.');
  return businesses;
}
```

## How to Debug

### Step 1: Open DevTools Console
```
F12 → Console tab
```

### Step 2: Look for These Messages

**During Scroll:**
```
🔄 Auto-scrolling to load all results...
📊 Loaded 14 businesses
📊 Loaded 14 businesses
📊 Loaded 14 businesses
✅ All results loaded
✅ Loaded 14 businesses. Starting extraction...
🔄 DOM stabilization complete, starting extraction...
```

**During Extraction:**
```
🔍 Found 14 cards with selector1, 0 with selector2
🎯 Total filtered cards: 14
🎯 Found 14 businesses. Using SEQUENTIAL mode
📊 Will extract 14 businesses (maxResults: 20, available: 14)
📍 [1/14] Scraping: Cafe Volan
```

**If Problem:**
```
❌ No business cards found! Check selectors.
// OR
🔍 Found 0 cards with selector1, 0 with selector2
🎯 Total filtered cards: 0
```

### Step 3: Check Selectors Manually

In console, run:
```javascript
// Check if cards exist
document.querySelectorAll('a.hfpxzc[href*="/maps/place/"]').length

// Check sidebar
document.querySelector('[role="feed"]')

// Check if on search page
window.location.href
```

### Step 4: Common Issues

**Issue 1: Wrong URL**
```
URL: https://www.google.com/maps/@25.5799385,-133.3274577,4z
Fix: Must be on SEARCH page: /maps/search/coffee+shop/
```

**Issue 2: No Sidebar**
```
Console: ⚠️ Sidebar not found
Fix: Ensure left sidebar with business list is visible
```

**Issue 3: Google Maps Changed Selectors**
```
Console: 🔍 Found 0 cards with selector1, 0 with selector2
Fix: Selectors need updating (contact developer)
```

## Testing Instructions

### 1. Reload Everything
```bash
1. chrome://extensions/ → Reload extension
2. Close all Google Maps tabs
3. Open NEW tab → Go to maps search
```

### 2. Use Correct URL Format
```
✅ CORRECT:
https://www.google.com/maps/search/coffee+shop+usa/

❌ WRONG:
https://www.google.com/maps/@25.5799385,-133.3274577,4z
```

### 3. Check Console Output
```
F12 → Console → Look for:
- 🔍 selector results
- 🎯 filtered card count
- 📊 extraction progress
```

### 4. Watch for Errors
```
If you see:
❌ No cards found in iteration X
OR
❌ No business cards found

Then the selectors are not matching any elements.
```

## Expected Console Output (Success)

```
🚀 Scraper starting: {maxResults: 20, autoScrollDelay: 2000}
🔄 Auto-scrolling to load all results...
📊 Loaded 5 businesses
📊 Loaded 10 businesses
📊 Loaded 14 businesses
📊 Loaded 14 businesses
✅ All results loaded
✅ Loaded 14 businesses. Starting extraction...
🔄 DOM stabilization complete, starting extraction...
🔍 Found 14 cards with selector1, 0 with selector2
🎯 Total filtered cards: 14
🎯 Found 14 businesses. Using SEQUENTIAL mode
📊 Will extract 14 businesses (maxResults: 20, available: 14)
📍 [1/14] Scraping: Cafe Volan
🔙 Closing detail panel...
✅ [1/14] Done: Cafe Volan
📍 [2/14] Scraping: Catalina Coffee
🔙 Closing detail panel...
✅ [2/14] Done: Catalina Coffee
...
🎉 Extraction complete! Got 14 businesses
🎉 COMPLETE! Scraped 14 businesses
```

## If Still Not Working

**Check this in Console:**
```javascript
// 1. Are you on a search page?
console.log(window.location.href);
// Should contain: /maps/search/

// 2. Do business cards exist?
console.log(document.querySelectorAll('a.hfpxzc').length);
// Should be > 0

// 3. Is sidebar present?
console.log(document.querySelector('[role="feed"]'));
// Should not be null

// 4. Manual extraction test
const cards = document.querySelectorAll('a.hfpxzc[href*="/maps/place/"]');
console.log('Cards found:', cards.length);
if (cards.length > 0) {
  console.log('First card:', cards[0]);
  console.log('First card href:', cards[0].href);
  console.log('First card aria-label:', cards[0].getAttribute('aria-label'));
}
```

## Quick Fix Commands

Run these in console if stuck:

```javascript
// Force reload cards
const cards = document.querySelectorAll('a.hfpxzc[href*="/maps/place/"]');
console.log('Found', cards.length, 'business cards');

// Test click first card
if (cards.length > 0) {
  cards[0].scrollIntoView();
  cards[0].click();
}
```

---

**Status:** Enhanced debugging added to v1.1
**Branch:** https://github.com/prasangapokharel/GoogleMapScrapper/tree/v1.1
