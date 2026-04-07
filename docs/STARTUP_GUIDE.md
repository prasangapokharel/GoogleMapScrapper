# 🚀 COMPLETE STARTUP GUIDE
## Google Maps Business Scraper - Extension + Backend

This guide will help you start **EVERYTHING** perfectly - both the Chrome extension and the backend server.

---

## 📋 QUICK START (Do This First!)

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd /home/prasanga/google-maps-scraper
./start_backend.sh
```

**What this does:**
- ✅ Checks Python environment
- ✅ Activates virtual environment (.venv)
- ✅ Installs all dependencies
- ✅ Creates .env file if missing
- ✅ Starts FastAPI server on http://127.0.0.1:8000

**You'll see:**
```
🚀 Starting Google Maps Scraper Backend...
============================================
✅ Virtual environment found at .venv/
✅ Python: Python 3.14.3
✅ Dependencies installed!
✨ Starting FastAPI server...
📍 Backend will be available at: http://127.0.0.1:8000
📍 API Documentation: http://127.0.0.1:8000/docs
📍 Health Check: http://127.0.0.1:8000/health
```

**Keep this terminal open!** The backend needs to stay running.

---

### Step 2: Load the Chrome Extension

1. **Open Chrome** and go to: `chrome://extensions/`

2. **Enable Developer Mode** (toggle in top-right corner)

3. **Click "Load unpacked"**

4. **Select the extension folder:**
   ```
   /home/prasanga/google-maps-scraper/extension/
   ```

5. **You should see:**
   - 📌 "Google Maps Business Scraper" extension loaded
   - ✨ A purple icon in your Chrome toolbar

---

### Step 3: Test Everything Works

#### Test 1: Backend Health Check

Open a new terminal:
```bash
curl http://127.0.0.1:8000/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2026-04-07T..."}
```

#### Test 2: View API Documentation

Open in browser: http://127.0.0.1:8000/docs

You should see:
- ✅ FastAPI Swagger UI
- ✅ Available endpoints (/export/csv, /health)
- ✅ Interactive API testing

#### Test 3: Extension Scraper

1. **Go to Google Maps** with a search:
   ```
   https://www.google.com/maps/search/coffee/@26.4700643,87.2709286,14z
   ```

2. **Click the extension icon** (purple icon in toolbar)

3. **Click "Start Scraping"**

4. **Watch the live progress:**
   - ✅ Progress bar updates in real-time
   - ✅ Current business name shows
   - ✅ Stats update (total scraped)

5. **Click "Export CSV"** when done
   - ✅ CSV file downloads with all 15+ fields

---

## 🎯 WHAT EACH COMPONENT DOES

### Backend Server (Port 8000)

**Purpose:** Optional API server for advanced features

**Endpoints:**
- `GET /` - API info and status
- `GET /health` - Health check
- `POST /export/csv` - Export data to CSV
- `GET /docs` - Interactive API documentation

**When to use:**
- If you want to export via API instead of browser
- For automated scraping pipelines
- For batch processing multiple searches

**Note:** The extension works **standalone** without the backend! The backend is optional for advanced users.

---

### Chrome Extension (Frontend)

**Purpose:** Main scraper that extracts business data

**Features:**
1. **Auto-scroll** - Loads all results
2. **Individual clicking** - Opens each business detail
3. **15+ fields extracted:**
   - name, phone, email, website, address
   - category, rating, reviews_count, price_range
   - hours, open_now, plus_code
   - latitude, longitude, google_maps_url

4. **Live progress** - Real-time updates while scraping
5. **CSV export** - One-click download

**Files:**
- `popup.html` - Beautiful purple gradient UI
- `popup.js` - UI logic and progress tracking
- `content.js` - Main scraper (clicks, extracts, scrolls)
- `background.js` - Storage management
- `manifest.json` - Extension configuration

---

## 🔧 TROUBLESHOOTING

### Problem: Backend won't start

**Solution 1:** Check if port 8000 is already in use
```bash
lsof -i :8000
kill -9 <PID>  # If something is using port 8000
```

**Solution 2:** Manually start with different port
```bash
cd /home/prasanga/google-maps-scraper
source .venv/bin/activate
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001 --reload
```

**Solution 3:** Check Python and dependencies
```bash
cd /home/prasanga/google-maps-scraper
source .venv/bin/activate
python --version  # Should be 3.10+
pip list  # Should show fastapi, uvicorn, etc.
```

---

### Problem: Extension not loading

**Solution 1:** Check manifest.json syntax
```bash
cat /home/prasanga/google-maps-scraper/extension/manifest.json
```

**Solution 2:** Reload extension
1. Go to `chrome://extensions/`
2. Click the refresh icon on the extension card
3. Check for errors in the extension details

**Solution 3:** Check console for errors
1. Right-click extension icon → "Inspect popup"
2. Check Console tab for errors

---

### Problem: Scraping fails or gets stuck

**Solution 1:** Check Google Maps page structure
- Make sure you're on a search results page
- URL should look like: `/maps/search/...`
- Sidebar should show multiple business cards

**Solution 2:** Increase delays
1. Open extension popup
2. Set "Auto-scroll delay" to 3000ms or higher
3. Try scraping again

**Solution 3:** Check console logs
1. On Google Maps page, press F12
2. Go to Console tab
3. Look for scraper logs and errors

---

### Problem: CSV export is empty

**Solution 1:** Check if businesses were scraped
- Stats should show "Total: X businesses"
- If 0, scraping failed (check console)

**Solution 2:** Check chrome.storage
```javascript
// In extension popup console:
chrome.storage.local.get('scrapedBusinesses', (data) => {
  console.log('Stored businesses:', data.scrapedBusinesses);
});
```

**Solution 3:** Re-scrape the page
- Click "Start Scraping" again
- Wait for completion
- Try export again

---

## 📊 USAGE SCENARIOS

### Scenario 1: Basic Usage (Extension Only)

**No backend needed!**

1. Open Google Maps search
2. Click extension icon
3. Click "Start Scraping"
4. Wait for completion
5. Click "Export CSV"

**Perfect for:** Quick one-time scrapes, small datasets

---

### Scenario 2: Advanced Usage (Extension + Backend)

**Backend required for API access**

1. Start backend: `./start_backend.sh`
2. Use extension to scrape as usual
3. Send data to backend via API:

```javascript
// From extension or external script
fetch('http://127.0.0.1:8000/export/csv', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ businesses: scrapedData })
})
```

**Perfect for:** Automation, batch processing, integration with other tools

---

### Scenario 3: Headless/Automated Scraping

**Coming soon!** Will allow:
- Scheduled scraping
- Multiple searches in parallel
- Automatic data processing
- Database integration

---

## 🎨 FEATURES SHOWCASE

### Live Progress Tracking
```
┌─────────────────────────────────────┐
│  🚀 Scraping Progress               │
│  ████████░░░░░░░░░░ 40%             │
│  Current: Starbucks Coffee          │
│  Progress: 12/30                    │
└─────────────────────────────────────┘
```

### Beautiful Stats Display
```
┌──────────────────────────────────────┐
│  📊 Scraping Stats                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │ Total   │ │ Avg     │ │ Success ││
│  │  156    │ │ 4.2★    │ │  98%    ││
│  └─────────┘ └─────────┘ └─────────┘│
└──────────────────────────────────────┘
```

### Data Fields Extracted
```csv
name,phone,email,website,address,category,rating,reviews_count,price_range,hours,open_now,plus_code,latitude,longitude,google_maps_url
"Himalayan Java Coffee","9841234567","info@himjava.com","https://himjava.com","Thamel, Kathmandu","Coffee shop",4.5,2890,"$$","Mon-Sun: 7am-10pm","Yes","9G8Q+2J Kathmandu",27.7172,85.3240,"https://maps.google.com/?cid=..."
```

---

## 🔐 PRIVACY & SECURITY

✅ **All data stays local** - No external servers
✅ **No tracking** - We don't collect any data
✅ **Open source** - Review the code yourself
✅ **No login required** - Works immediately
✅ **Respects rate limits** - Built-in delays

---

## 📞 SUPPORT

### Need Help?

1. **Check console logs** (F12 in browser)
2. **Read error messages** carefully
3. **Try troubleshooting steps** above
4. **Review code** in `/extension/` folder

### Found a Bug?

1. Note the error message
2. Check browser console (F12)
3. Check extension console (Inspect popup)
4. Note steps to reproduce

---

## ✨ NEXT STEPS

After successful setup:

1. ✅ Scrape some test data
2. ✅ Verify all 15+ fields are extracted
3. ✅ Check CSV export works
4. ✅ Try different search queries
5. ✅ Experiment with delay settings

**Happy Scraping! 🎉**
