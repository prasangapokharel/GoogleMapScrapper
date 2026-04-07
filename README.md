# 🥷 NinjaScrapi - Google Maps Scraper

**Ultra-optimized Chrome extension for scraping Google Maps business data with terminal-style UI and 40% faster speeds.**

[![GitHub](https://img.shields.io/badge/GitHub-NinjaScrapi-black?style=flat-square&logo=github)](https://github.com/prasangapokharel/NinjaScrapi)
[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen?style=flat-square)](https://github.com/prasangapokharel/NinjaScrapi/releases/tag/v1.1.0)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## ✨ Features

✅ **Blazing Fast** - 40% faster scraping with optimized delays
✅ **Terminal UI** - Hacker-themed interface with scanline effects and green aesthetic
✅ **15+ Data Fields** - Name, phone, email, website, address, rating, hours, GPS coordinates, and more
✅ **No Backend Required** - Works standalone as a Chrome extension
✅ **CSV Export** - Export all business data to downloadable CSV files
✅ **Real-time Updates** - Live progress tracking with extraction counter
✅ **ESC Key Optimization** - Uses keyboard events instead of button clicks to prevent navigation

---

## 🚀 Quick Start

### Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/prasangapokharel/NinjaScrapi.git
   cd NinjaScrapi
   ```

2. **Install in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `extension/` folder

3. **Start scraping**
   - Go to [Google Maps](https://www.google.com/maps/)
   - Search for a business type (e.g., "coffee shop usa")
   - Click the NinjaScrapi extension icon
   - Set `maxResults` and click "EXECUTE SCRAPER"
   - Download CSV when complete

---

## 📊 Data Fields Extracted

| Field | Description |
|-------|-------------|
| **name** | Business name |
| **phone** | Phone number |
| **email** | Email address |
| **website** | Official website URL |
| **address** | Full address |
| **rating** | Google rating (1-5 stars) |
| **reviews_count** | Number of reviews |
| **price_range** | $ / $$ / $$$ / $$$$ |
| **hours** | Operating hours |
| **open_now** | Current open/closed status |
| **plus_code** | Google Plus Code |
| **latitude** | GPS latitude |
| **longitude** | GPS longitude |
| **google_maps_url** | Direct Google Maps link |

---

## 🎮 Usage

### Scraping Parameters

- **MAX RESULTS (0 = ALL)** - Number of businesses to scrape (0 for unlimited)
- **SCROLL DELAY (MS)** - Delay between scroll events (default: 2000ms for stability)

### How It Works

1. **Scrolling Phase** - NinjaScrapi scrolls through the business list loading all results
2. **Extraction Phase** - Clicks each business card and extracts all available data
3. **Export Phase** - Generates a CSV file with all extracted data

---

## ⚡ Performance Improvements (v1.1.0)

| Component | Before | After | Improvement |
|-----------|--------|-------|-------------|
| Detail Panel Extraction | 1800ms | 1200ms | **-33%** |
| Click-to-Wait Default | 1500ms | 1000ms | **-33%** |
| Close Panel ESC | 800ms | 500ms | **-37%** |
| Pre-Click Scroll | 300ms | 150ms | **-50%** |
| Sequential Click Wait | 2500ms | 1500ms | **-40%** |
| DOM Stabilization | 1000ms | 500ms | **-50%** |

**Overall Speed**: ~40% faster than v1.0 ⚡

---

## 🛠️ System Requirements

- **Chrome Browser** - v90 or higher
- **Operating System** - Windows, macOS, or Linux
- **Internet Connection** - Active Google Maps access

---

## 📦 Installation Requirements

See [requirements.txt](requirements.txt) for backend dependencies (optional).

```bash
pip install -r requirements.txt
```

---

## 📁 Project Structure

```
NinjaScrapi/
├── extension/                 # Chrome extension files
│   ├── manifest.json         # Extension configuration
│   ├── popup.html            # Terminal UI interface
│   ├── popup.js              # UI logic
│   ├── content.js            # Scraping engine (OPTIMIZED)
│   └── background.js         # Service worker
├── docs/                      # Documentation
│   ├── QUICKSTART.md
│   ├── TESTING_GUIDE.md
│   ├── V1.1_RELEASE_NOTES.md
│   └── [more guides...]
├── backend/                   # Optional FastAPI backend
├── README.md                  # This file
└── requirements.txt           # Python dependencies
```

---

## 🎯 What Makes NinjaScrapi Different?

1. **ESC Key Innovation** - Uses keyboard events instead of button clicks, preventing Google Maps navigation redirects
2. **Terminal Aesthetic** - Retro hacker-style UI with CRT scanlines and pulsing animations
3. **No Rate Limiting** - Direct client-side scraping without backend bottlenecks
4. **Full Data Extraction** - 15+ fields per business using advanced CSS selectors
5. **Ultra-Optimized** - 40% faster than competitors with aggressive delay optimization

---

## 🐛 Troubleshooting

**Problem**: Extension not loading?
- Check `chrome://extensions/` - ensure "Developer mode" is enabled
- Verify `extension/` folder contains `manifest.json`

**Problem**: Only scraping 1 business?
- Make sure you're using v1.1.0 (ESC key fix)
- Check that Google Maps URL stays on search page throughout scraping
- Try increasing SCROLL_DELAY to 2500ms for slower networks

**Problem**: Missing data fields?
- Ensure the business has that information on Google Maps
- Check browser console (F12) for any selector errors
- Try clearing browser cache and reloading

For more help, see [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)

---

## 📝 Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [Testing Guide](docs/TESTING_GUIDE.md)
- [v1.1.0 Release Notes](docs/V1.1_RELEASE_NOTES.md)
- [Debug Guide](docs/DEBUG_ZERO_EXTRACTION.md)
- [All Documentation](docs/INDEX.md)

---

## 🤝 Contributing

Found a bug or have an idea? Feel free to open an issue on GitHub!

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

**Created by**: Prasanga Pokharel  
**GitHub**: [@prasangapokharel](https://github.com/prasangapokharel)  
**Repository**: [github.com/prasangapokharel/NinjaScrapi](https://github.com/prasangapokharel/NinjaScrapi)

---

**🥷 Happy Scraping! Keep your data ninja status anonymous.** 🚀
