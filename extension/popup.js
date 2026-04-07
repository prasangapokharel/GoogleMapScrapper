const scrapeBtn = document.getElementById('scrapeBtn');
const exportBtn = document.getElementById('exportBtn');
const countBusinesses = document.getElementById('countBusinesses');
const lastScraped = document.getElementById('lastScraped');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const messageBox = document.getElementById('messageBox');
const maxResultsInput = document.getElementById('maxResults');
const autoScrollDelayInput = document.getElementById('autoScrollDelay');
const progressSection = document.getElementById('progressSection');
const currentProgress = document.getElementById('currentProgress');
const totalProgress = document.getElementById('totalProgress');
const progressFill = document.getElementById('progressFill');
const currentBusiness = document.getElementById('currentBusiness');

let scrapedBusinesses = [];
let port = null;

const setStatus = (status, text) => {
  statusBadge.className = `status-badge status-${status}`;
  const statusMap = {
    idle: 'Ready',
    scraping: 'Scraping...',
    done: 'Complete',
    error: 'Error'
  };
  statusText.textContent = text || statusMap[status] || status;
};

const showMessage = (message, type = 'success') => {
  messageBox.textContent = message;
  messageBox.className = `message show ${type}`;
  setTimeout(() => {
    messageBox.classList.remove('show');
  }, 5000);
};

const updateStats = () => {
  countBusinesses.textContent = scrapedBusinesses.length;
  const now = new Date();
  lastScraped.textContent = now.toLocaleTimeString();
};

const updateProgress = (current, total, businessName = '') => {
  currentProgress.textContent = current;
  totalProgress.textContent = total;
  const percentage = total > 0 ? (current / total) * 100 : 0;
  progressFill.style.width = `${percentage}%`;
  
  if (businessName) {
    currentBusiness.textContent = `📍 ${businessName}`;
  }
};

const downloadCSV = () => {
  if (scrapedBusinesses.length === 0) {
    showMessage('No data to export', 'error');
    return;
  }

  const headers = ['name', 'phone', 'email', 'website', 'google_maps_url', 'address', 'rating', 'category'];
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
  setStatus('scraping', 'Loading...');
  scrapeBtn.disabled = true;
  progressSection.classList.add('show');
  showMessage('🚀 Starting powerful scraper...', 'success');

  try {
    const maxResults = parseInt(maxResultsInput.value) || 0;
    const autoScrollDelay = parseInt(autoScrollDelayInput.value) || 2000;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes('google.com/maps')) {
      throw new Error('❌ Please open Google Maps with search results first');
    }

    port = chrome.tabs.connect(tab.id, { name: 'scraper' });
    
    port.onMessage.addListener((msg) => {
      if (msg.type === 'progress') {
        updateProgress(msg.current, msg.total, msg.businessName);
        setStatus('scraping', `Scraping ${msg.current}/${msg.total}`);
      } else if (msg.type === 'status') {
        currentBusiness.textContent = msg.message;
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
    setStatus('done', 'Complete!');
    exportBtn.disabled = false;
    progressSection.classList.remove('show');
    showMessage(`🎉 Successfully scraped ${scrapedBusinesses.length} businesses with complete details!`);
  } catch (error) {
    setStatus('error', 'Failed');
    progressSection.classList.remove('show');
    showMessage(`❌ Error: ${error.message}`, 'error');
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
      showMessage(`✨ Loaded ${scrapedBusinesses.length} previously scraped businesses`, 'success');
    }
  });
} catch (error) {
  console.warn('Chrome storage error:', error.message);
}
