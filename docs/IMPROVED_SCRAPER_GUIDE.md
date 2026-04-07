# 🚀 Improved Google Maps Scraper - Complete Guide

## ✨ What's New?

The scraper has been **completely upgraded** to:

1. ✅ **Click each business** to open detail panel
2. ✅ **Extract comprehensive data** (phone, website, email, address)
3. ✅ **Handle pagination** automatically (loads ALL results)
4. ✅ **Better error handling** and status updates
5. ✅ **Works with Nepali/multilingual** Google Maps pages

---

## 🔥 Key Improvements

### Before (Old Version):
- Only scraped visible sidebar data
- Missing phone numbers, websites, emails
- Limited to what's shown in sidebar cards
- Incomplete business information

### After (New Version):
- Clicks EACH business to get full details
- Extracts phone, website, email, complete address
- Automatically scrolls to load ALL results
- Comprehensive business data

---

## 📋 How It Works Now

### Step-by-Step Process:

1. **Load All Results**
   - Scrolls sidebar to load all business cards
   - Continues until no more results load
   - Configurable via "Max Results" setting

2. **Click Each Business**
   - Automatically clicks each business card
   - Opens the detail panel on the right
   - Waits for panel to fully load

3. **Extract Detailed Information**
   - Business Name
   - Phone Number (clicks phone button if needed)
   - Website URL
   - Email Address
   - Complete Address
   - Star Rating
   - Business Category
   - Google Maps URL

4. **Close & Move to Next**
   - Closes detail panel
   - Moves to next business
   - Repeats until all scraped

---

## 🎯 Setup & Testing

### 1. Reload the Extension

```bash
# The extension files have been updated
# You need to reload the extension in Chrome
```

**In Chrome:**
1. Go to `chrome://extensions/`
2. Find "Google Maps Business Scraper"
3. Click the **🔄 Reload** icon
4. Extension is now updated!

### 2. Test on Google Maps

**Open Google Maps:**
```
1. Go to: https://www.google.com/maps
2. Search for: "coffee shop" (or any business type)
3. Wait for results to load in sidebar
```

**Run the Scraper:**
```
1. Click the extension icon (top-right)
2. Settings (optional):
   - Max Results: 10 (for testing, or 0 for unlimited)
   - Auto-scroll delay: 500ms (default)
3. Click "🔍 Scrape Visible"
4. Watch it work:
   - Status changes to "Scraping..."
   - Extension loads all results
   - Clicks each business one by one
   - Extracts detailed information
   - Status changes to "Done"
5. Click "📥 Export CSV"
```

---

## 📊 Expected Results

### CSV Output Will Include:

| Column | Description | Example |
|--------|-------------|---------|
| name | Business name | "The Coffee Bar, Biratnagar" |
| phone | Phone number | "970-2631303" |
| email | Email address | "info@coffeebar.com" |
| website | Business website | "https://coffeebar.com" |
| google_maps_url | Google Maps link | "https://maps.google.com/..." |
| address | Full address | "बिराटनगर 56613" |
| rating | Star rating | "4.0" |
| category | Business type | "कफी पसल" (Coffee Shop) |

---

## ⚙️ Configuration Options

### Max Results
- **0** = Unlimited (scrapes ALL businesses)
- **10** = Scrapes first 10 businesses
- **50** = Scrapes first 50 businesses
- **100** = Scrapes first 100 businesses

### Auto-scroll Delay (milliseconds)
- **100ms** = Very fast (may miss results)
- **500ms** = Recommended (balanced)
- **1000ms** = Slower (more reliable)
- **2000ms** = Very slow (for slow connections)

---

## 🐛 Troubleshooting

### Issue: Extension shows "Error"

**Solution:**
1. Make sure you're on Google Maps with search results
2. Check browser console (F12) for error messages
3. Reload the extension at `chrome://extensions/`
4. Try again with fewer results (e.g., Max Results = 5)

### Issue: Missing phone numbers or websites

**Cause:** Not all businesses display this information on Google Maps

**Solution:** This is normal - some businesses don't have:
- Website listed
- Phone number public
- Email address visible

The scraper extracts what's available.

### Issue: Scraping is very slow

**Cause:** Opening each business takes time (1-2 seconds per business)

**Solution:**
- This is expected behavior for detailed extraction
- For 20 businesses: ~40-60 seconds
- For 100 businesses: ~3-5 minutes
- Increase "Auto-scroll delay" if needed

### Issue: "Please open Google Maps with search results first"

**Solution:**
1. Make sure URL is: `https://www.google.com/maps`
2. Must have active search results visible
3. Sidebar must show business cards
4. Try refreshing the page

---

## 🔍 Code Changes Explained

### Updated Selectors (Works with Nepali/Multilingual)

```javascript
// Finds business cards by link selector
'a.hfpxzc[href*="/maps/place/"]'

// Finds sidebar feed container
'[role="feed"]'

// Finds phone button (Nepali-aware)
'button[aria-label*="फोन"], button[aria-label*="Phone"]'

// Finds website link
'a[data-item-id="authority"]'

// Finds address button (Nepali-aware)
'button[aria-label*="ठेगाना"], button[aria-label*="Address"]'
```

### New Functions

1. **`extractDetailedInfo()`**
   - Clicks on business
   - Waits for detail panel to load
   - Extracts all available fields
   - Closes panel and returns data

2. **`getBusinessCards()`**
   - Finds all business card links in sidebar
   - Returns array of clickable elements

3. **`delay(ms)`**
   - Helper function for waiting
   - Ensures panels load properly

---

## 📈 Performance Tips

### For Best Results:

1. **Start Small**
   - Test with Max Results = 5 first
   - Verify data quality
   - Then increase to desired amount

2. **Stable Connection**
   - Ensure good internet connection
   - Google Maps needs to load quickly
   - Slow connections may cause timeouts

3. **Don't Interrupt**
   - Let the scraper finish completely
   - Don't close the tab while scraping
   - Don't click on the map during scraping

4. **Check Console Logs**
   - Open DevTools (F12)
   - Check Console tab
   - See progress: "Scraping business 5/20"

---

## 🎓 Example Workflow

### Complete Test Run:

```bash
# 1. Reload Extension
chrome://extensions/ → Click Reload

# 2. Open Google Maps
https://www.google.com/maps

# 3. Search
Search: "restaurants in Biratnagar"

# 4. Open Extension
Click extension icon

# 5. Configure
Max Results: 10
Auto-scroll: 500ms

# 6. Start Scraping
Click "Scrape Visible"

# 7. Wait
Status: "Scraping..." (1-2 minutes)

# 8. Export
Click "Export CSV"

# 9. Verify
Open CSV file
Check columns: name, phone, website, etc.
```

---

## 🔐 Data Privacy Note

- Only scrapes **publicly visible** data
- No authentication or login required
- Respects Google Maps public information
- No personal data accessed
- Use responsibly and ethically

---

## 📝 Console Output Example

When scraping, you'll see logs like:

```
Google Maps Scraper content script loaded
Found 20 business cards
Scraping business 1/20
Scraped: The Coffee Bar,Biratnagar
Scraping business 2/20
Scraped: DR CAFE - coffee shop
Scraping business 3/20
...
Finished loading. Starting detailed extraction of 20 businesses
```

---

## ✅ Success Checklist

- [ ] Extension reloaded in Chrome
- [ ] Google Maps open with search results
- [ ] Extension popup shows "Idle" status
- [ ] Clicked "Scrape Visible"
- [ ] Status changed to "Scraping..."
- [ ] Businesses Found count increasing
- [ ] Status changed to "Done"
- [ ] "Export CSV" button enabled
- [ ] CSV file downloaded
- [ ] CSV contains detailed data (phone, website, etc.)

---

## 🚀 Next Steps

### Optional Enhancements:

1. **Add More Fields**
   - Business hours
   - Price range
   - Reviews
   - Images

2. **Batch Processing**
   - Multiple searches
   - Different locations
   - Automated scheduling

3. **Backend Integration**
   - Send to FastAPI backend
   - Data deduplication
   - Database storage

---

## 📞 Support

If you encounter issues:

1. **Check Console** (F12 → Console tab)
2. **Reload Extension** (chrome://extensions/)
3. **Test with Small Dataset** (Max Results = 5)
4. **Verify Google Maps URL** (must be exact)
5. **Check Internet Connection**

---

**Version:** 2.0.0 (Improved)  
**Last Updated:** 2026-04-07  
**Status:** ✅ Enhanced & Ready to Use

---

## 🎉 Enjoy Comprehensive Scraping!

Your scraper now extracts **complete business information** by clicking each listing and gathering all available details. Much more powerful than before!
