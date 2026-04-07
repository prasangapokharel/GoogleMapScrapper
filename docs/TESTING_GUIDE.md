# Complete Testing Guide - Google Maps Business Scraper

## 📋 Table of Contents
1. [Environment Setup](#environment-setup)
2. [Extension Testing](#extension-testing)
3. [Backend API Testing](#backend-api-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Troubleshooting](#troubleshooting)

---

## Environment Setup

### Step 1: Verify System Requirements
```bash
# Check Python version (must be 3.11+)
python3 --version
# Output: Python 3.14.3 ✅

# Check pip version
pip3 --version
# Output: pip 26.0.1 ...

# Check if uv is installed
which uv
# Output: /home/prasanga/.local/bin/uv ✅
```

### Step 2: Create Virtual Environment with UV

```bash
# Navigate to project
cd /home/prasanga/google-maps-scraper

# Create venv using uv (Recommended - faster)
uv venv

# Or alternatively, use standard venv:
# python3 -m venv .venv

# Output: Using CPython 3.11.15
#         Creating virtual environment at: .venv
#         Activate with: source .venv/bin/activate
```

### Step 3: Activate Virtual Environment

```bash
# Activate venv
source .venv/bin/activate

# You should see (.venv) prefix in your terminal prompt
# (.venv) $
```

### Step 4: Install All Dependencies

```bash
# Using uv (faster)
uv pip install -r requirements.txt

# Or alternatively, using pip:
# pip install -r requirements.txt

# Verify installation
pip list | grep -E "fastapi|uvicorn|pydantic|python-dotenv"
```

**Expected Output:**
```
fastapi                  0.104.1
pydantic                 2.5.0
pydantic-settings        2.1.0
python-dotenv            1.0.0
uvicorn                  0.24.0
```

### Step 5: Verify Installation

```bash
# Test FastAPI import
python3 -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"
# Output: FastAPI 0.104.1 ✅

# Test uvicorn import
python3 -c "import uvicorn; print(f'Uvicorn {uvicorn.__version__}')"
# Output: Uvicorn 0.24.0 ✅
```

---

## Extension Testing

### Prerequisites
- Chrome or Chromium-based browser (Edge, Brave, Opera)
- Extension must be loaded in Chrome (see installation steps below)
- Active internet connection
- Google Maps page with search results

### Part 1: Load Extension in Chrome

**Step 1: Open Chrome Extensions Page**
```
1. Open Google Chrome browser
2. Type in address bar: chrome://extensions/
3. Press Enter
```

**Step 2: Enable Developer Mode**
```
1. Look for "Developer mode" toggle in top-right corner
2. Click the toggle to turn ON (should turn blue)
3. You should see "Load unpacked" button appear
```

**Step 3: Load the Extension**
```
1. Click "Load unpacked" button
2. Navigate to: /home/prasanga/google-maps-scraper/extension/
3. Click "Select Folder" button
4. The extension should appear in your list as "Google Maps Business Scraper"
5. Check that it shows "Enabled" status
```

**Step 4: Verify Extension Icon**
```
1. Look at top-right corner of Chrome (near address bar)
2. You should see an icon for "Google Maps Business Scraper"
3. If not visible, click puzzle icon and pin the extension
```

### Part 2: Basic Extension Test

**Test 1: Open Google Maps**
```
1. Go to https://www.google.com/maps
2. Search for any business (e.g., "coffee shops near me", "restaurants in NYC")
3. Wait for results to load (see business cards in sidebar)
```

**Test 2: Access Extension Popup**
```
1. Click the extension icon in top-right
2. A popup window should appear with:
   - "📍 Maps Scraper" title
   - Status badge showing "Idle"
   - "Businesses Found: 0"
   - "Last Scraped: Never"
   - "🔍 Scrape Visible" button
   - "📥 Export CSV" button (disabled)
   - Settings section with:
     - "Max Results" field (default: 0)
     - "Auto-scroll (ms between scrolls)" field (default: 500)
```

**Test 3: Scrape Visible Businesses**
```
1. With Google Maps open and business search active:
2. Click "🔍 Scrape Visible" button
3. Status should change to "Scraping..." (yellow/orange badge)
4. Extension will auto-scroll the sidebar to load more results
5. Wait 30-60 seconds (depends on page speed)
6. Status should change to "Done" (blue badge)
7. "Businesses Found: X" should show a number > 0
8. "📥 Export CSV" button should now be enabled (not grayed out)
```

**Test 4: Check Scraped Data**
```
1. After scraping completes, check stats:
   - "Businesses Found" should show the count
   - "Last Scraped" should show current time
   - Status badge should show "Done" ✅
```

**Test 5: Export CSV File**
```
1. Click "📥 Export CSV" button
2. A CSV file should download to your Downloads folder
3. File name format: business-data-TIMESTAMP.csv
4. Example: business-data-1704067800000.csv
```

**Test 6: Verify CSV Content**
```
1. Open the downloaded CSV file with a text editor or Excel
2. Check that it has these columns:
   - name
   - phone
   - email
   - website
   - google_maps_url
   - address
   - rating
   - category
3. Verify at least one row of data below headers
4. Data should match businesses from Google Maps
```

### Part 3: Settings Configuration Test

**Test 1: Max Results Setting**
```
1. Go to Google Maps with search results active
2. In extension popup, set "Max Results (0 = unlimited)" to 5
3. Click "🔍 Scrape Visible"
4. Wait for scraping to complete
5. Verify "Businesses Found:" shows exactly 5 or fewer
```

**Test 2: Auto-scroll Delay Setting**
```
1. Set "Auto-scroll (ms between scrolls)" to 1000 (1 second)
2. Run scraping
3. Observe slower scrolling behavior
4. Change back to 500ms for normal speed
```

### Part 4: Error Handling Tests

**Test 1: Scrape with No Results**
```
1. Go to Google Maps
2. Search for something very specific that returns no results
3. Try to scrape
4. Should show "Error" status or 0 businesses found
5. Check browser console (F12) for error messages
```

**Test 2: Click Export Before Scraping**
```
1. Open extension popup
2. Click "📥 Export CSV" button (should be disabled/grayed out)
3. Verify nothing happens or error message appears
```

**Test 3: Scrape on Non-Maps Page**
```
1. Go to any non-Google Maps page
2. Try to click the extension
3. Popup should open but scraping should fail gracefully
4. Check for error message
```

---

## Backend API Testing

### Part 1: Start the Backend Server

**In Terminal:**
```bash
# Make sure you're in project directory and venv is activated
cd /home/prasanga/google-maps-scraper
source .venv/bin/activate

# Start the FastAPI server
python -m uvicorn backend.main:app --reload

# Expected output:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete
```

**Keep this terminal open** - the server runs in foreground

### Part 2: Health Check

**Open another terminal (keep backend running):**

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:30:00.000000"}
```

### Part 3: API Root Endpoint

```bash
# Test root endpoint
curl http://localhost:8000/

# Expected response:
# {
#   "message": "Google Maps Business Scraper API",
#   "version": "1.0.0",
#   "timestamp": "2024-01-15T10:30:00.000000",
#   "endpoints": {
#     "health": "/export/health",
#     "export_csv": "/export/csv"
#   }
# }
```

### Part 4: Export CSV Endpoint

**Create a test file: test_export.sh**

```bash
#!/bin/bash

curl -X POST http://localhost:8000/export/csv \
  -H "Content-Type: application/json" \
  -d '{
    "businesses": [
      {
        "name": "Coffee Shop ABC",
        "phone": "+1-234-567-8900",
        "email": "info@coffeeshop.com",
        "website": "https://coffeeshop.com",
        "google_maps_url": "https://maps.google.com/maps/place/Coffee+Shop",
        "address": "123 Main St, New York, NY 10001",
        "rating": 4.5,
        "category": "Coffee Shop"
      },
      {
        "name": "Pizza Restaurant",
        "phone": "+1-555-123-4567",
        "email": "contact@pizza.com",
        "website": "https://pizza-restaurant.com",
        "google_maps_url": "https://maps.google.com/maps/place/Pizza",
        "address": "456 Oak Ave, Brooklyn, NY 11201",
        "rating": 4.8,
        "category": "Italian Restaurant"
      }
    ]
  }'
```

**Run the test:**
```bash
bash test_export.sh

# Expected response:
# {
#   "status": "success",
#   "count": 2,
#   "csv_data": "name,phone,email,...",
#   "filename": "business_data_20240115_103000.csv"
# }
```

### Part 5: Interactive API Documentation

```
1. Backend must be running (see Part 1)
2. Open browser: http://localhost:8000/docs
3. You should see Swagger UI with all endpoints
4. Can test endpoints directly from browser
```

---

## End-to-End Testing

### Complete Workflow Test

**Step 1: Start Backend (Optional)**
```bash
cd /home/prasanga/google-maps-scraper
source .venv/bin/activate
python -m uvicorn backend.main:app --reload

# Keep this running in separate terminal
```

**Step 2: Load Extension in Chrome**
- Follow "Extension Testing" > "Part 1: Load Extension"
- Verify icon appears in top-right

**Step 3: Run Full Scraping Workflow**
```
1. Open https://www.google.com/maps
2. Search for: "restaurants in New York"
3. Wait for results to load
4. Click extension icon
5. Click "🔍 Scrape Visible"
6. Wait for "Done" status (30-60 seconds)
7. Check "Businesses Found:" count
8. Click "📥 Export CSV"
9. Download should start automatically
10. Open CSV file and verify data
```

**Step 4: Verify Data Quality**
```
CSV file should contain:
✅ Proper headers
✅ At least 10+ business rows
✅ Names of restaurants
✅ Phone numbers (if visible on Maps)
✅ Addresses
✅ Ratings
✅ Categories
✅ Google Maps URLs
```

---

## Troubleshooting

### Extension Issues

**Issue: Extension icon doesn't appear**
- Solution: Go to chrome://extensions/ and check if extension is loaded
- If missing: Click "Load unpacked" and select /extension/ folder again
- Restart Chrome if needed

**Issue: "Scrape Visible" button does nothing**
- Solution: Make sure you're on https://www.google.com/maps (exact URL)
- Make sure there are visible business results in the sidebar
- Check DevTools console (F12) for errors
- Reload the extension: toggle off/on at chrome://extensions/

**Issue: No data scraped (0 businesses found)**
- Cause: DOM selectors may have changed or page structure different
- Solution: Check browser console for error messages
- Make sure businesses are visible in the sidebar
- Try scrolling manually first to ensure page loaded
- Verify URL is exactly: https://www.google.com/maps

**Issue: CSV file is empty**
- Solution: Try scraping again on same page
- Make sure at least one business card is visible
- Check that "Businesses Found" shows count > 0 before exporting

**Issue: Export button stays disabled**
- Solution: Make sure scraping completed successfully (status = "Done")
- Try reloading extension and scraping again
- Check browser console for errors

### Backend Issues

**Issue: Backend won't start**
```bash
# Check if port 8000 is in use
lsof -i :8000

# If in use, kill the process
kill -9 <PID>

# Or use different port:
python -m uvicorn backend.main:app --port 8001 --reload
```

**Issue: ImportError with FastAPI**
```bash
# Make sure venv is activated
source .venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Issue: Connection refused on localhost:8000**
- Make sure backend is running (check terminal output)
- Make sure you didn't interrupt it with Ctrl+C
- Try accessing http://localhost:8000/docs in browser

### Data Quality Issues

**Issue: Phone numbers have strange formatting**
- Expected: Backend normalizes to digits only
- Example: "+1-234-567-8900" → "2345678900"
- If not happening: Check backend cleaner.py

**Issue: Duplicate businesses in results**
- Expected: Backend deduplicates by name and phone
- If getting duplicates: Check if backend is running
- Extension scrapes from DOM; backend removes duplicates

**Issue: Missing fields (empty email, website, etc.)**
- This is normal - not all Google Maps listings show all info
- Fields may be empty if business didn't display them
- This is a limitation of Google Maps UI

---

## Quick Reference: Key Files

### Extension Files
```
extension/
├── manifest.json        ← Configuration (Manifest V3)
├── popup.html           ← UI layout
├── popup.js             ← UI logic & events
├── content.js           ← DOM scraper (runs on Maps page)
└── background.js        ← Service worker
```

### Backend Files
```
backend/
├── main.py              ← FastAPI app & routes
├── config.py            ← Settings & environment
├── routers/export.py    ← CSV export endpoint
├── services/csvService.py ← CSV generation
├── schemas/business.py  ← Pydantic models
└── utils/cleaner.py     ← Data cleaning & dedup
```

### Configuration
```
.env.example            ← Copy to .env for settings
requirements.txt        ← Python dependencies
```

---

## Command Quick Reference

```bash
# Setup
cd /home/prasanga/google-maps-scraper
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt

# Run Backend
python -m uvicorn backend.main:app --reload

# Test Backend
curl http://localhost:8000/health
curl http://localhost:8000/

# Test Export
curl -X POST http://localhost:8000/export/csv \
  -H "Content-Type: application/json" \
  -d '{"businesses": [...]}'

# View API Docs
# Open: http://localhost:8000/docs
```

---

## Success Criteria

✅ **Extension Setup Complete:**
- Extension loads in Chrome
- Icon appears in toolbar
- Popup opens when clicked

✅ **Extension Scraping Works:**
- Can scrape businesses from Google Maps
- Businesses Found count > 0
- Status shows "Done"

✅ **CSV Export Works:**
- Export button is enabled after scraping
- CSV file downloads
- File contains proper headers and data

✅ **Backend Setup Complete:**
- Server starts without errors
- Health check returns OK
- API endpoints respond

✅ **End-to-End Works:**
- Full workflow completes successfully
- Data quality is good
- No errors or warnings

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** ✅ Ready for Testing
