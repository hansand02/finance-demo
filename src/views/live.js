import { companies, fetchProfiles, fetchPeers } from '../data.js'

export function render() {
  const publicTickers = companies.filter(c => c.ticker).map(c => c.ticker)

  return `
    <div class="view-header">
      <div>
        <h1>Live Market Data</h1>
        <p class="view-sub">Real-time company profiles and peer discovery via Financial Modeling Prep API</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" id="fetch-live-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Fetch Live Data
        </button>
      </div>
    </div>

    <div id="live-status" class="card" style="display:none">
      <div class="live-status-content"></div>
    </div>

    <div id="live-profiles"></div>
    <div id="live-peers"></div>

    <div class="card">
      <div class="card-header"><h2>API Information</h2></div>
      <div class="api-info">
        <div class="api-row"><span>Provider</span><strong>Financial Modeling Prep</strong></div>
        <div class="api-row"><span>Endpoints used</span><strong>/stable/profile, /stable/stock-peers</strong></div>
        <div class="api-row"><span>Available tickers</span><strong>${publicTickers.join(', ')}</strong></div>
        <div class="api-row"><span>Rate limit</span><strong>250 requests/day (free tier)</strong></div>
        <div class="api-row"><span>Data freshness</span><strong>Real-time (market hours)</strong></div>
      </div>
    </div>
  `
}

export function init() {
  document.getElementById('fetch-live-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('fetch-live-btn')
    const statusCard = document.getElementById('live-status')
    const statusContent = statusCard.querySelector('.live-status-content')
    const profilesDiv = document.getElementById('live-profiles')
    const peersDiv = document.getElementById('live-peers')

    btn.disabled = true
    btn.textContent = 'Fetching...'
    statusCard.style.display = 'block'
    statusContent.innerHTML = '<div class="loading-pulse">Fetching live profiles from FMP API...</div>'

    const tickers = companies.filter(c => c.ticker).map(c => c.ticker)
    const profiles = await fetchProfiles(tickers)

    statusContent.innerHTML = `<div class="success-msg">Fetched ${Object.keys(profiles).length} company profiles</div>`

    // Render profiles
    profilesDiv.innerHTML = `
      <div class="card">
        <div class="card-header"><h2>Live Company Profiles</h2><span class="card-badge">From FMP API — real-time</span></div>
        <div class="profiles-grid">
          ${Object.entries(profiles).map(([ticker, p]) => `
            <div class="profile-card">
              <div class="profile-header">
                ${p.image ? `<img src="${p.image}" class="profile-img" alt="${p.companyName}" onerror="this.style.display='none'"/>` : ''}
                <div>
                  <h3>${p.companyName}</h3>
                  <span class="profile-ticker">${p.symbol} — ${p.exchangeFullName}</span>
                </div>
              </div>
              <div class="profile-metrics">
                <div class="pm"><span>Price</span><strong>$${p.price?.toFixed(2)}</strong></div>
                <div class="pm"><span>Market Cap</span><strong>$${(p.marketCap / 1e9).toFixed(1)}B</strong></div>
                <div class="pm ${p.changePercentage > 0 ? 'pos' : 'neg'}"><span>Change</span><strong>${p.changePercentage > 0 ? '+' : ''}${p.changePercentage?.toFixed(2)}%</strong></div>
                <div class="pm"><span>Beta</span><strong>${p.beta?.toFixed(2)}</strong></div>
                <div class="pm"><span>Employees</span><strong>${parseInt(p.fullTimeEmployees)?.toLocaleString()}</strong></div>
                <div class="pm"><span>52w Range</span><strong>${p.range}</strong></div>
              </div>
              <div class="profile-meta">
                <span>CEO: ${p.ceo}</span>
                <span>${p.sector} / ${p.industry}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `

    // Fetch peers for SHW
    statusContent.innerHTML += '<div class="loading-pulse" style="margin-top:8px">Discovering peer companies...</div>'
    const peers = await fetchPeers('SHW')

    if (peers && peers.length > 0 && peers[0].peersList) {
      peersDiv.innerHTML = `
        <div class="card">
          <div class="card-header"><h2>Peer Companies (via SHW)</h2><span class="card-badge">Auto-discovered by FMP</span></div>
          <div class="peers-grid">
            ${peers[0].peersList.map(p => `
              <div class="peer-chip">
                <strong>${p.symbol}</strong>
                <span>${p.companyName}</span>
                <span class="peer-mcap">$${(p.mktCap / 1e9).toFixed(1)}B</span>
              </div>
            `).join('')}
          </div>
        </div>
      `
      statusContent.innerHTML = `<div class="success-msg">Done — ${Object.keys(profiles).length} profiles + ${peers[0].peersList.length} peers discovered</div>`
    }

    btn.disabled = false
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> Refresh`
  })
}
