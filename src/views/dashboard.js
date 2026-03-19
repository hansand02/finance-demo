import { companies, revEUR, fmt, toNOK, fmtNOK } from '../data.js'
import { exportExcel, exportPDF } from '../exports.js'

function getSorted() {
  if (currencyMode === 'nok') {
    return [...companies].sort((a, b) => toNOK(b.revenue.value, b) - toNOK(a.revenue.value, a))
  }
  return [...companies].sort((a, b) => revEUR(b) - revEUR(a))
}

let currencyMode = 'reported' // 'reported' or 'nok'

function bar(label, value, max, display, isJotun) {
  const pct = Math.max(5, (value / max) * 100).toFixed(0)
  return `<div class="bar-row">
    <span class="bar-label">${label}</span>
    <div class="bar-track">
      <div class="bar-fill ${isJotun ? 'jotun' : 'comp'}" style="width:${pct}%">${display}</div>
    </div>
  </div>`
}

function fmtField(field, company) {
  if (currencyMode === 'nok') {
    if (!field || field.value === null) return '—'
    const nokVal = toNOK(field.value, company)
    return fmtNOK(nokVal)
  }
  return fmt(field, company.currency)
}

function renderRevChart() {
  const isNOK = currencyMode === 'nok'
  if (isNOK) {
    const nokData = getSorted().map(c => ({ label: c.company, value: toNOK(c.revenue.value, c), isJotun: c.company === 'Jotun' }))
    const maxNOK = Math.max(...nokData.map(d => d.value)) * 1.1
    return `
      <div class="card">
        <div class="card-header"><h2>Revenue (NOK B)</h2></div>
        <div class="card-body">
          ${nokData.map(d => bar(d.label, d.value, maxNOK, fmtNOK(d.value), d.isJotun)).join('')}
        </div>
      </div>`
  }
  const maxRev = revEUR(getSorted()[0]) * 1.1
  return `
    <div class="card">
      <div class="card-header"><h2>Revenue (€B)</h2></div>
      <div class="card-body">
        ${getSorted().map(c => bar(c.company, revEUR(c), maxRev, fmt(c.revenue, c.currency), c.company === 'Jotun')).join('')}
      </div>
    </div>`
}

function renderEbitdaChart() {
  const isNOK = currencyMode === 'nok'
  if (isNOK) {
    const nokData = companies
      .filter(c => c.ebitda.value)
      .map(c => ({ label: c.company, value: toNOK(c.ebitda.value, c), isJotun: c.company === 'Jotun' }))
      .sort((a, b) => b.value - a.value)
    const maxNOK = Math.max(...nokData.map(d => d.value)) * 1.1
    return `
      <div class="card">
        <div class="card-header"><h2>EBITDA (NOK B)</h2></div>
        <div class="card-body">
          ${nokData.map(d => bar(d.label, d.value, maxNOK, fmtNOK(d.value), d.isJotun)).join('')}
        </div>
      </div>`
  }
  const marginData = companies
    .filter(c => c.ebitdaMargin.value || c.opMargin.value)
    .map(c => ({ label: c.company, value: c.ebitdaMargin.value || c.opMargin.value, display: c.ebitdaMargin.value ? `${c.ebitdaMargin.value}%` : `${c.opMargin.value}% op.`, isJotun: c.company === 'Jotun' }))
    .sort((a, b) => b.value - a.value)
  const maxMargin = marginData[0].value * 1.2
  return `
    <div class="card">
      <div class="card-header"><h2>EBITDA / Op. Margin</h2></div>
      <div class="card-body">
        ${marginData.map(d => bar(d.label, d.value, maxMargin, d.display, d.isJotun)).join('')}
      </div>
    </div>`
}

function renderReactiveSection() {
  return `
    ${renderTable()}
    <div class="grid-2">
      ${renderRevChart()}
      ${renderEbitdaChart()}
    </div>`
}

function renderTable() {
  const isNOK = currencyMode === 'nok'
  return `
    <div class="card">
      <div class="card-header">
        <h2>Financial Comparison</h2>
        <div class="header-actions" style="gap:8px">
          <div class="toggle-group">
            <button class="toggle-btn ${!isNOK ? 'active' : ''}" data-mode="reported">Rapportert valuta</button>
            <button class="toggle-btn ${isNOK ? 'active' : ''}" data-mode="nok">Alt i NOK</button>
          </div>
          <span class="card-badge">Click "Data & Sources" to verify</span>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th><th>HQ</th>
              <th>Revenue${isNOK ? ' (NOK)' : ''}</th>
              <th>EBITDA${isNOK ? ' (NOK)' : ''}</th>
              <th>EBITDA %</th>
              <th>EBITDA YoY</th>
              <th>Op. Income${isNOK ? ' (NOK)' : ''}</th>
              <th>Op. %</th>
              <th>Net Debt${isNOK ? ' (NOK)' : ''}</th>
              <th>Rev YoY</th>
            </tr>
          </thead>
          <tbody>
            ${getSorted().map(c => `<tr class="${c.company === 'Jotun' ? 'row-jotun' : ''}">
              <td><strong>${c.company}</strong>${c.private ? ' <span class="tag-private">Private</span>' : ''}</td>
              <td>${c.hq}</td>
              <td>${fmtField(c.revenue, c)}</td>
              <td>${fmtField(c.ebitda, c)}</td>
              <td>${c.ebitdaMargin.value ? c.ebitdaMargin.value + '%' : '—'}</td>
              <td class="${c.ebitdaYoY > 0 ? 'pos' : c.ebitdaYoY < 0 ? 'neg' : ''}">${c.ebitdaYoY !== null ? (c.ebitdaYoY > 0 ? '+' : '') + c.ebitdaYoY + '%' : '—'}</td>
              <td>${fmtField(c.opIncome, c)}</td>
              <td>${c.opMargin.value ? c.opMargin.value + '%' : '—'}</td>
              <td>${fmtField(c.netDebt, c)}</td>
              <td class="${c.revenueYoY > 0 ? 'pos' : c.revenueYoY < 0 ? 'neg' : ''}">${c.revenueYoY > 0 ? '+' : ''}${c.revenueYoY}%</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${isNOK ? '<p class="note" style="padding:12px 24px">Omregnet til NOK med gjennomsnittlige FY2025-kurser. USD/NOK ~11.63, EUR/NOK ~12.78, JPY/NOK ~0.071</p>' : ''}
    </div>`
}

export function render() {
  const maxRev = revEUR(getSorted()[0]) * 1.1
  const marginData = companies
    .filter(c => c.ebitdaMargin.value || c.opMargin.value)
    .map(c => ({ label: c.company, value: c.ebitdaMargin.value || c.opMargin.value, display: c.ebitdaMargin.value ? `${c.ebitdaMargin.value}%` : `${c.opMargin.value}% op.`, isJotun: c.company === 'Jotun' }))
    .sort((a, b) => b.value - a.value)
  const maxMargin = marginData[0].value * 1.2

  // EBITDA growth chart data
  const ebitdaGrowthData = companies
    .filter(c => c.ebitdaYoY !== null)
    .map(c => ({ label: c.company, value: c.ebitdaYoY, isJotun: c.company === 'Jotun' }))
    .sort((a, b) => b.value - a.value)
  const maxEbitdaG = Math.max(...ebitdaGrowthData.map(d => Math.abs(d.value))) * 1.3

  return `
    <div class="view-header">
      <div>
        <h1>Competitor Dashboard</h1>
        <p class="view-sub">FY 2025 — Global Coatings Industry</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="window.__exportExcel()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
          Export Excel
        </button>
        <button class="btn btn-secondary" onclick="window.__exportPDF()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          Export PDF
        </button>
      </div>
    </div>

    <div class="kpi-bar">
      <div class="kpi highlight">
        <span class="kpi-label">Jotun Op. Profit</span>
        <span class="kpi-value">NOK 7.08B</span>
        <span class="kpi-sub">+4.7% YoY | Vol. +7%</span>
      </div>
      <div class="kpi highlight">
        <span class="kpi-label">Jotun Op. Margin</span>
        <span class="kpi-value">~20.7%</span>
        <span class="kpi-sub">Highest among peers</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Global Market</span>
        <span class="kpi-value">$194B</span>
        <span class="kpi-sub">CAGR 4.3% → $282B by 2034</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Peer Group</span>
        <span class="kpi-value">6 companies</span>
        <span class="kpi-sub">4 public + 2 private</span>
      </div>
    </div>

    <div id="reactive-container">
      ${renderReactiveSection()}
    </div>

    <div class="card">
      <div class="card-header"><h2>EBITDA / Op. Profit Growth YoY</h2><span class="card-badge">Regular EBITDA, not adjusted</span></div>
      <div class="card-body">
        ${ebitdaGrowthData.map(d => {
          const color = d.value > 0 ? 'var(--green)' : 'var(--red)'
          const pct = Math.max(5, (Math.abs(d.value) / maxEbitdaG) * 100).toFixed(0)
          return `<div class="bar-row">
            <span class="bar-label">${d.label}</span>
            <div class="bar-track">
              <div class="bar-fill ${d.isJotun ? 'jotun' : 'comp'}" style="width:${pct}%;background:${color}">${d.value > 0 ? '+' : ''}${d.value}%</div>
            </div>
          </div>`
        }).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Strategic Insights</h2></div>
      <div class="insight-grid">
        <div class="insight-card threat">
          <span class="tag">THREAT</span>
          <h4>AkzoNobel + Axalta Merger</h4>
          <p>Combined ~€16B+ revenue. India divestment (€922M) funds deal. Direct threat in decorative coatings across Europe and MENA.</p>
        </div>
        <div class="insight-card threat">
          <span class="tag">THREAT</span>
          <h4>Nippon Paint M&A</h4>
          <p>Revenue +8.3% via AOC acquisition. Op. profit +31%. APAC = 43% of global market. Jotun's decorative position under pressure.</p>
        </div>
        <div class="insight-card strength">
          <span class="tag">STRENGTH</span>
          <h4>Best-in-Class Margins</h4>
          <p>~20.7% op. margin leads all peers. SHW next at 19.6% but with $9.5B debt. Private ownership = strategic freedom.</p>
        </div>
        <div class="insight-card strength">
          <span class="tag">STRENGTH</span>
          <h4>Volume Growth +7%</h4>
          <p>Crushes peers (PPG flat, AkzoNobel declining). Signals market share gains in emerging markets.</p>
        </div>
        <div class="insight-card opportunity">
          <span class="tag">OPPORTUNITY</span>
          <h4>Hempel Marine</h4>
          <p>Marine segment grew 9.8% to €750M. Closest Scandinavian peer — any weakness is Jotun's opportunity.</p>
        </div>
        <div class="insight-card strength">
          <span class="tag">STRENGTH</span>
          <h4>Low Leverage</h4>
          <p>SHW: $9.5B, PPG: $5.7B, Nippon: $7.8B debt. Jotun's clean balance sheet is a strategic moat.</p>
        </div>
      </div>
    </div>
  `
}

export function init() {
  window.__exportExcel = exportExcel
  window.__exportPDF = exportPDF
  bindToggles()
}

function bindToggles() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currencyMode = btn.dataset.mode
      const container = document.getElementById('reactive-container')
      if (container) {
        container.innerHTML = renderReactiveSection()
        bindToggles()
      }
    })
  })
}
