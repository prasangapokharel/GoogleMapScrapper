# Quick Start Guide

## 1. Chrome Extension Installation (2 minutes)

```bash
# 1. Open Chrome and go to:
chrome://extensions/

# 2. Enable "Developer mode" (toggle in top right)

# 3. Click "Load unpacked"

# 4. Select: /home/prasanga/google-maps-scraper/extension/

# 5. Go to Google Maps: https://www.google.com/maps
#    Search for any business (e.g., "restaurants in New York")

# 6. Click the extension icon to open the popup UI
```

## 2. Backend Setup (Optional - for advanced processing)

```bash
# Navigate to project directory
cd /home/prasanga/google-maps-scraper

# Install Python dependencies
pip install -r requirements.txt

# Copy environment template (optional)
cp .env.example .env

# Start the FastAPI server
python -m uvicorn backend.main:app --reload

# Visit http://localhost:8000 for API
# Visit http://localhost:8000/docs for interactive docs
```

## 3. Extension Usage

### Standalone Mode (No Backend)
1. Open Google Maps → Search for businesses
2. Click extension icon → Click "🔍 Scrape Visible"
3. Wait for scraping to complete
4. Click "📥 Export CSV" → CSV downloads to your computer

### Advanced: Configure Settings
- **Max Results**: Limit number of businesses to scrape (0 = unlimited)
- **Auto-scroll Delay**: Time between sidebar scrolls (milliseconds)

## 4. Backend API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Export to CSV
curl -X POST http://localhost:8000/export/csv \
  -H "Content-Type: application/json" \
  -d '{
    "businesses": [
      {
        "name": "Coffee Shop",
        "phone": "+1-234-567-8900",
        "email": "info@coffeeshop.com",
        "website": "https://coffeeshop.com",
        "google_maps_url": "https://maps.google.com/...",
        "address": "123 Main St",
        "rating": 4.5,
        "category": "Coffee Shop"
      }
    ]
  }'
```

## 5. File Structure Quick Reference

```
extension/                    # Load this in Chrome
  ├── manifest.json          # Extension config
  ├── popup.html/js          # UI & logic
  ├── content.js             # DOM scraper
  └── background.js          # Service worker

backend/                      # Run with uvicorn
  ├── main.py                # FastAPI app
  ├── config.py              # Settings
  ├── routers/export.py      # CSV endpoint
  ├── services/csvService.py # CSV generation
  ├── schemas/business.py    # Data models
  └── utils/cleaner.py       # Data processing

.env.example                 # Copy to .env
requirements.txt             # pip install
README.md                    # Full docs
```

## 6. Troubleshooting

**Extension not showing scraped data:**
- Make sure you're on google.com/maps (not maps.google.com variations)
- Check Chrome DevTools Console (F12) for errors
- Reload the extension (toggle off/on at chrome://extensions)

**Backend won't start:**
- Verify Python 3.11+: `python --version`
- Check dependencies: `pip list | grep -E "fastapi|pydantic"`
- Try: `python -m pip install --upgrade pip`

**CSV export is empty:**
- Ensure businesses are visible on the map before clicking "Scrape"
- Check that Google Maps DOM structure matches selectors

## 7. Data Fields Captured

Each business includes:
- **name** - Business name
- **phone** - Phone number (digits only)
- **email** - Email address
- **website** - Business website URL
- **google_maps_url** - Direct Google Maps link
- **address** - Full address
- **rating** - Star rating (1-5)
- **category** - Business type/category

## 8. Key Features

✅ No external APIs or authentication needed
✅ Works completely standalone
✅ Automatic scrolling to load more results
✅ Data deduplication & normalization
✅ CSV export with proper formatting
✅ Real-time scraping status in popup
✅ Configurable scroll depth & result limits

---

**Next Steps:**
1. Load extension in Chrome
2. Go to Google Maps
3. Search for any business type
4. Click extension icon
5. Click "Scrape Visible"
6. Click "Export CSV"
7. Done! 🎉
