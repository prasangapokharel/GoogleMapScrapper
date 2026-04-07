# NinjaScrapi - Release History

## v1.1.0 - Production Release 🚀

**Release Date**: April 7, 2025  
**GitHub Tag**: [v1.1.0](https://github.com/prasangapokharel/NinjaScrapi/releases/tag/v1.1.0)

### 🎉 What's New

#### Performance Optimizations (40% Faster!)
- **Detail Panel Extraction**: 1800ms → 1200ms (-33% faster)
- **Click-to-Wait Default**: 1500ms → 1000ms (-33% faster)
- **Close Panel ESC**: 800ms → 500ms (-37% faster)
- **Pre-Click Scroll**: 300ms → 150ms (-50% faster)
- **Sequential Click Wait**: 2500ms → 1500ms (-40% faster)
- **Post-Extraction Delay**: 600ms → 300ms (-50% faster)
- **DOM Stabilization**: 1000ms → 500ms (-50% faster)

#### Critical Fixes
- ✅ **ESC Key Innovation**: Replaced button clicks with keyboard events to prevent browser navigation redirects
- ✅ **Multi-Business Scraping**: Maintains search page URL throughout entire scraping process
- ✅ **Data Accuracy**: Enhanced CSS selectors for reliable field extraction

#### Features
- ✅ 15+ data fields per business (name, phone, email, website, address, rating, reviews, hours, GPS, etc.)
- ✅ Terminal-style UI with hacker aesthetic (green scanlines, pulsing animations)
- ✅ Real-time progress tracking with extraction counter
- ✅ CSV export functionality
- ✅ No backend required - 100% client-side extension

#### Project Rebranding
- ✅ Renamed to **NinjaScrapi** for production readiness
- ✅ Production-ready README with comprehensive documentation
- ✅ Organized docs structure (all .md files in docs/ folder)
- ✅ Facebook marketing caption ready
- ✅ Clean root directory with only essential files

### 📊 Performance Comparison

| Metric | v1.0 | v1.1 | Improvement |
|--------|------|------|-------------|
| Average Scrape Time (20 businesses) | ~180s | ~110s | **⚡ 39% faster** |
| Detail Panel Load | 1800ms | 1200ms | **-33%** |
| Close Panel Time | 800ms | 500ms | **-37%** |
| Total Delay Reduction | Baseline | -40% | **Ultra-optimized** |

### 🐛 Bug Fixes

1. **URL Navigation Bug** (CRITICAL)
   - **Issue**: After scraping 1 business, clicking close button caused redirect to map view
   - **Root Cause**: Close button was `history.back()` trigger
   - **Fix**: ESC key event dispatch (no navigation)
   - **Status**: ✅ FIXED

2. **Port Disconnection Errors**
   - **Issue**: Background service worker connection drops
   - **Fix**: Added try-catch blocks and onDisconnect listeners
   - **Status**: ✅ FIXED

3. **Chrome Storage Errors**
   - **Issue**: Storage access failures during scraping
   - **Fix**: Added existence checks and error callbacks
   - **Status**: ✅ FIXED

### 📦 Installation

```bash
# Clone repository
git clone https://github.com/prasangapokharel/NinjaScrapi.git
cd NinjaScrapi

# Install in Chrome
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension/ folder
```

### 🎯 Next Steps for Users

1. Download the latest version
2. Reload extension in `chrome://extensions/`
3. Test with a simple search (e.g., "coffee shop near me")
4. Share your feedback on GitHub!

---

## v1.0.0 - Initial Release

**Release Date**: March 2025  
**Status**: ✅ Functional but slower (180s for 20 businesses)

### Features
- Basic Google Maps scraping
- Terminal UI design
- CSV export
- 15+ data fields

### Known Limitations
- Slower performance (40% slower than v1.1)
- Button-based close mechanism caused navigation issues
- Limited optimization

---

## 🚀 Future Roadmap

### v1.2.0 (Planned)
- [ ] Parallel batch processing for 2-3x speed increase
- [ ] Advanced filtering options (price range, ratings, hours)
- [ ] Built-in data validation and cleaning
- [ ] Excel export support
- [ ] Scheduled scraping tasks
- [ ] Local database storage

### v1.3.0 (Planned)
- [ ] Dark/light theme toggle
- [ ] Custom field selection
- [ ] Data analytics dashboard
- [ ] Duplicate detection
- [ ] Proxy rotation support

### v2.0.0 (Long-term)
- [ ] Native desktop app version
- [ ] API endpoint for programmatic access
- [ ] Advanced ML-based data enrichment
- [ ] Real-time monitoring dashboard

---

## 📝 Version Comparison

| Feature | v1.0 | v1.1 | Status |
|---------|------|------|--------|
| Multi-business scraping | ❌ | ✅ | Fixed |
| 40% speed boost | ❌ | ✅ | Achieved |
| Terminal UI | ✅ | ✅ | Improved |
| CSV Export | ✅ | ✅ | Stable |
| 15+ Data Fields | ✅ | ✅ | Stable |
| ESC Key Fix | ❌ | ✅ | Critical Fix |
| Production Ready | ⚠️ | ✅ | Ready |

---

## 🤝 Contributing

Interested in contributing? We're always looking for:
- Bug reports and fixes
- Performance optimizations
- New features
- Documentation improvements
- Testing and QA

Visit our GitHub repository to contribute!

---

## 📄 License

MIT License - See LICENSE file for details

---

**🥷 Keep scraping like a ninja! Happy data collection!** 🚀
