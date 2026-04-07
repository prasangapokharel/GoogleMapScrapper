# Google Maps Business Data Scraper

A Chrome Extension + Python FastAPI backend for scraping visible business listings from Google Maps and exporting them as CSV files.

## Features

- **Chrome Extension (Manifest V3)**: Scrapes visible business cards from Google Maps sidebar
- **Bulk Scraping**: Automatically scroll and load more results before scraping
- **Data Extraction**: Captures name, phone, email, website, address, rating, category, and Google Maps URL
- **Flexible Export**: Download data directly as CSV or send to Python backend for processing
- **Deduplication**: Python backend removes duplicate entries based on name and phone
- **Data Normalization**: Cleans and standardizes all extracted fields
- **No Database**: Stateless backend, no persistence required
- **Standalone Mode**: Extension works without backend for direct CSV export

## Project Structure

```
google-maps-scraper/
├── extension/                  # Chrome Extension (Manifest V3)
│   ├── manifest.json          # Extension configuration
│   ├── popup.html             # Popup UI
│   ├── popup.js               # Popup logic & state management
│   ├── content.js             # DOM scraper (injected into Google Maps)
│   └── background.js          # Background service worker
│
├── backend/                   # Python FastAPI backend
│   ├── main.py                # FastAPI app initialization
│   ├── config.py              # Configuration (Pydantic Settings)
│   ├── routers/
│   │   └── export.py          # POST /export/csv endpoint
│   ├── services/
│   │   └── csvService.py      # CSV generation logic
│   ├── schemas/
│   │   └── business.py        # Pydantic models
│   └── utils/
│       └── cleaner.py         # Data cleaning & deduplication
│
├── .env.example               # Example environment variables
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Extension | JavaScript (Manifest V3), HTML, CSS |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| Export | Python `csv` module |
| Config | Pydantic Settings, `.env` |

## Installation

### Chrome Extension Setup

1. **Load the extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `extension/` directory from this project

2. **Navigate to Google Maps:**
   - Go to https://www.google.com/maps
   - Search for any business category (e.g., "restaurants", "coffee shops")
   - Click the extension icon in the Chrome toolbar

### Python Backend Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```

3. **Run the backend:**
   ```bash
   python -m uvicorn backend.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

## Usage

### Standalone Mode (No Backend Required)

1. Open Google Maps and search for businesses
2. Click the extension icon to open the popup
3. Click **"🔍 Scrape Visible"** to start scraping
   - The extension will automatically scroll the sidebar to load more results
   - Configure max results and scroll delay in settings
4. Once scraping completes, click **"📥 Export CSV"** to download the file

### With Python Backend

1. Start the FastAPI backend (see setup above)
2. Scrape businesses using the extension
3. The extension will send data to the backend for processing
4. Backend will:
   - Clean and normalize fields
   - Deduplicate entries
   - Return processed CSV data

## API Endpoints

### GET `/`
Health check and API info

**Response:**
```json
{
  "message": "Google Maps Business Scraper API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000000",
  "endpoints": {
    "health": "/export/health",
    "export_csv": "/export/csv"
  }
}
```

### GET `/health`
Simple health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000000"
}
```

### POST `/export/csv`
Export businesses to CSV

**Request Body:**
```json
{
  "businesses": [
    {
      "name": "Coffee Shop ABC",
      "phone": "+1-234-567-8900",
      "email": "info@coffeeshop.com",
      "website": "https://coffeeshop.com",
      "google_maps_url": "https://maps.google.com/...",
      "address": "123 Main St, City, State 12345",
      "rating": 4.5,
      "category": "Coffee Shop"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "count": 1,
  "csv_data": "name,phone,email,website,google_maps_url,address,rating,category\n\"Coffee Shop ABC\",\"2345678900\",\"info@coffeeshop.com\",\"https://coffeeshop.com\",...",
  "filename": "business_data_20240115_103000.csv"
}
```

## Data Fields Extracted

| Field | Type | Description |
|-------|------|-------------|
| name | string | Business name |
| phone | string | Normalized phone number (digits only) |
| email | string | Email address (if visible) |
| website | string | External website URL (if available) |
| google_maps_url | string | Direct link to Google Maps listing |
| address | string | Full address/location string |
| rating | float | Star rating (1-5) |
| category | string | Business category/type |

## Extension Settings

The popup UI provides configurable options:

- **Max Results (0 = unlimited)**: Stop scraping after reaching this count
- **Auto-scroll Delay (ms)**: Time between scroll actions (default: 500ms)

## Data Processing Pipeline

### Cleaning
- Strips whitespace from all text fields
- Normalizes phone numbers (digits only)
- Normalizes URLs (adds https:// if missing)
- Lowercases email addresses
- Converts ratings to float

### Deduplication
The backend removes duplicates based on:
1. Exact name match (case-insensitive)
2. Phone number match (7+ digits)

If either condition matches an existing record, the duplicate is discarded.

## Constraints & Design Decisions

- **No External APIs**: Pure DOM parsing, no third-party scraping services
- **No Database**: Stateless backend, all data is in-memory and transient
- **No Authentication**: Scrapes only publicly visible data
- **Clean Code**: Self-documenting function names, no comments/docstrings
- **Language Conventions**: camelCase for JS, snake_case for Python
- **Pinned Dependencies**: All versions locked in `requirements.txt`

## Debugging

### Extension Issues
1. Open Chrome DevTools (F12) on the Google Maps tab
2. Check the "Console" tab for any error messages
3. Check the "Network" tab if using the backend

### Backend Issues
1. Check the terminal output where you ran `uvicorn`
2. Enable `DEBUG=True` in `.env` for more verbose logging
3. Visit `http://localhost:8000/docs` for interactive Swagger UI

## Browser Compatibility

- **Chrome**: Version 120+ (Manifest V3)
- **Chromium-based browsers**: Edge, Brave, Opera (same version requirements)

## Limitations

- Scrapes only **visible** business cards on the current map view
- Does not bypass Google Maps pagination or loading delays
- Limited to public data visible on Google Maps
- Does not authenticate or bypass login requirements

## Future Enhancements

- Background scraping scheduling
- Database storage with filtering/search
- Multi-format export (Excel, JSON, PDF)
- Proxy support for large-scale scraping
- Advanced filtering and search capabilities
- Rate limiting and retry logic

## License

MIT

## Contributing

For bugs or feature requests, open an issue on GitHub.

## Support

For help or feedback:
- Check the extension console (DevTools)
- Review API logs from backend
- Verify Google Maps page structure hasn't changed (DOM selectors may need updates)
