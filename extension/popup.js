const scrapeBtn = document.getElementById('scrapeBtn');
const exportBtn = document.getElementById('exportBtn');
const totalStat = document.getElementById('totalStat');
const avgRating = document.getElementById('avgRating');
const statusStat = document.getElementById('statusStat');
const messageBox = document.getElementById('messageBox');
const maxResultsInput = document.getElementById('maxResults');
const autoScrollDelayInput = document.getElementById('autoScrollDelay');
const progressSection = document.getElementById('progressSection');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const currentBusiness = document.getElementById('currentBusiness');

let scrapedBusinesses = [];
let port = null;

const setStatus = (status) => {
  const statusMap = {
    idle: 'READY',
    scraping: 'ACTIVE',
    done: 'DONE',
    error: 'ERROR'
  };
  statusStat.textContent = statusMap[status] || status.toUpperCase();
  statusStat.style.fontSize = '12px';
};

const showMessage = (message, type = 'success') => {
  messageBox.textContent = message;
  messageBox.className = `message show ${type}`;
  setTimeout(() => {
    messageBox.classList.remove('show');
  }, 5000);
};

const updateStats = () => {
  totalStat.textContent = scrapedBusinesses.length;
  
  // Calculate average rating
  const ratings = scrapedBusinesses.filter(b => b.rating).map(b => parseFloat(b.rating));
  if (ratings.length > 0) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    avgRating.textContent = avg.toFixed(1);
  } else {
    avgRating.textContent = '0.0';
  }
};

const updateProgress = (current, total, businessName = '') => {
  progressText.textContent = `${current}/${total}`;
  const percentage = total > 0 ? (current / total) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
  
  if (businessName) {
    currentBusiness.textContent = `> ${businessName}`;
  }
};

const downloadCSV = () => {
  if (scrapedBusinesses.length === 0) {
    showMessage('No data to export', 'error');
    return;
  }

  const headers = ['name', 'phone', 'email', 'website', 'address', 'category', 'rating', 'reviews_count', 'price_range', 'hours', 'open_now', 'plus_code', 'latitude', 'longitude', 'google_maps_url'];
  const csvContent = [
    headers.join(','),
    ...scrapedBusinesses.map(business =>
      headers.map(header => {
        let value = business[header] || '';
        value = String(value).replace(/"/g, '""');
        return `"${value}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `google-maps-businesses-${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showMessage(`✅ Exported ${scrapedBusinesses.length} businesses to CSV`);
};

const scrapeBusinesses = async () => {
  setStatus('scraping');
  scrapeBtn.disabled = true;
  progressSection.classList.add('active');
  showMessage('⚡ Scraper initiated...', 'success');

  try {
    const maxResults = parseInt(maxResultsInput.value) || 0;
    const autoScrollDelay = parseInt(autoScrollDelayInput.value) || 2000;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes('google.com/maps')) {
      throw new Error('ERROR: Open Google Maps first');
    }

    port = chrome.tabs.connect(tab.id, { name: 'scraper' });
    
    port.onMessage.addListener((msg) => {
      if (msg.type === 'progress') {
        updateProgress(msg.current, msg.total, msg.businessName);
        setStatus('scraping');
      } else if (msg.type === 'status') {
        currentBusiness.textContent = `> ${msg.message}`;
      }
    });

    const result = await chrome.tabs.sendMessage(tab.id, {
      action: 'scrapeBusinesses',
      maxResults,
      autoScrollDelay
    });

    if (result.error) {
      throw new Error(result.error);
    }

    scrapedBusinesses = result.businesses || [];
    updateStats();
    setStatus('done');
    exportBtn.disabled = false;
    progressSection.classList.remove('active');
    showMessage(`✅ COMPLETE! Scraped ${scrapedBusinesses.length} businesses`, 'success');
  } catch (error) {
    setStatus('error');
    progressSection.classList.remove('active');
    showMessage(`ERROR: ${error.message}`, 'error');
    console.error('Scraping error:', error);
  } finally {
    scrapeBtn.disabled = false;
    if (port) {
      port.disconnect();
      port = null;
    }
  }
};

scrapeBtn.addEventListener('click', scrapeBusinesses);
exportBtn.addEventListener('click', downloadCSV);

// Load previously scraped businesses from storage on startup
try {
  chrome.storage.local.get('scrapedBusinesses', (data) => {
    if (chrome.runtime.lastError) {
      console.warn('Failed to load from chrome.storage:', chrome.runtime.lastError);
      return;
    }
    
    if (data.scrapedBusinesses && data.scrapedBusinesses.length > 0) {
      scrapedBusinesses = data.scrapedBusinesses;
      updateStats();
      exportBtn.disabled = false;
      showMessage(`⚡ Loaded ${scrapedBusinesses.length} cached records`, 'info');
    }
  });
} catch (error) {
  console.warn('Chrome storage error:', error.message);
}
