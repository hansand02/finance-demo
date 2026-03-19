import { companies } from '../data.js'

const FIELDS = [
  { key: 'revenue', label: 'Revenue', type: 'financial' },
  { key: 'ebitda', label: 'EBITDA', type: 'financial' },
  { key: 'ebitdaMargin', label: 'EBITDA Margin %', type: 'pct' },
  { key: 'opIncome', label: 'Operating Income', type: 'financial' },
  { key: 'opMargin', label: 'Operating Margin %', type: 'pct' },
  { key: 'netIncome', label: 'Net Income', type: 'financial' },
  { key: 'totalAssets', label: 'Total Assets', type: 'financial' },
  { key: 'netDebt', label: 'Net Debt', type: 'financial' },
  { key: 'employees', label: 'Employees', type: 'number' },
]

function trustIcon(field) {
  if (!field || field.value === null) return '<span class="trust-na" title="Not available">N/A</span>'
  if (field.source && field.source.includes('akzonobel.com') || field.source && field.source.includes('prnewswire') || field.source && field.source.includes('jotun.com') || field.source && field.source.includes('hempel.com') || field.source && field.source.includes('nipponpaint') || field.source && field.source.includes('investor.ppg')) {
    return '<span class="trust-high" title="Official company source">Official</span>'
  }
  if (field.source && field.source.includes('macrotrends')) {
    return '<span class="trust-med" title="Third-party aggregator">3rd party</span>'
  }
  if (field.source) return '<span class="trust-high" title="Sourced">Sourced</span>'
  return '<span class="trust-na" title="Not available">N/A</span>'
}

export function render() {
  return `
    <div class="view-header">
      <div>
        <h1>Data & Sources</h1>
        <p class="view-sub">Inspect, verify, and edit every data point. All values link to their original source.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Data Validity Overview</h2>
        <span class="card-badge">${companies.length} companies, ${FIELDS.length} fields each</span>
      </div>
      <div class="validity-summary">
        <div class="validity-stat">
          <span class="validity-num">${countSourced()}</span>
          <span class="validity-label">Sourced values</span>
        </div>
        <div class="validity-stat">
          <span class="validity-num">${countOfficial()}</span>
          <span class="validity-label">From official releases</span>
        </div>
        <div class="validity-stat">
          <span class="validity-num">${countThirdParty()}</span>
          <span class="validity-label">From 3rd-party aggregators</span>
        </div>
        <div class="validity-stat">
          <span class="validity-num">${countMissing()}</span>
          <span class="validity-label">Missing / not available</span>
        </div>
      </div>
    </div>

    ${companies.map(c => `
      <div class="card data-card" id="data-${c.id}">
        <div class="card-header">
          <h2>${c.company} <span class="data-meta">${c.hq} — FY ${c.fy} — ${c.currency}</span></h2>
          <span class="card-badge ${c.private ? 'badge-private' : 'badge-public'}">${c.private ? 'Private' : 'Public (' + c.ticker + ')'}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
              <th>Trust</th>
              <th>Source</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            ${FIELDS.map(f => {
              const field = c[f.key]
              if (!field) return ''
              const val = field.value !== null && field.value !== undefined
                ? (f.type === 'financial' ? `${field.value}${field.unit || ''}` : f.type === 'pct' ? `${field.value}%` : field.value?.toLocaleString())
                : '—'
              return `<tr>
                <td class="field-name">${f.label}</td>
                <td class="field-value">
                  <input type="text" class="edit-input" value="${val}" data-company="${c.id}" data-field="${f.key}" ${field.value === null ? 'placeholder="Not available"' : ''} />
                </td>
                <td>${trustIcon(field)}</td>
                <td>${field.source ? `<a href="${field.source}" target="_blank" class="source-link">View source</a>` : '<span class="no-source">No source</span>'}</td>
                <td class="field-note">${field.note || ''}</td>
              </tr>`
            }).join('')}
          </tbody>
        </table>
      </div>
    `).join('')}

    <div class="card">
      <div class="card-header"><h2>Trust Legend</h2></div>
      <div class="trust-legend">
        <div><span class="trust-high">Official</span> Value from official company earnings release, press release, or annual report</div>
        <div><span class="trust-med">3rd party</span> Value from financial data aggregator (MacroTrends, etc.) — verify against primary source</div>
        <div><span class="trust-na">N/A</span> Not available — company does not disclose this metric, or data not yet collected</div>
      </div>
    </div>
  `
}

function countSourced() { return companies.reduce((s, c) => s + FIELDS.filter(f => c[f.key]?.source).length, 0) }
function countOfficial() { return companies.reduce((s, c) => s + FIELDS.filter(f => c[f.key]?.source && !c[f.key].source.includes('macrotrends')).length, 0) }
function countThirdParty() { return companies.reduce((s, c) => s + FIELDS.filter(f => c[f.key]?.source?.includes('macrotrends')).length, 0) }
function countMissing() { return companies.reduce((s, c) => s + FIELDS.filter(f => !c[f.key]?.value && c[f.key]?.value !== 0).length, 0) }

export function init() {
  // Wire up editable inputs
  document.querySelectorAll('.edit-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const { company, field } = e.target.dataset
      const c = companies.find(x => x.id === company)
      if (!c) return
      const val = e.target.value
      if (val === '—' || val === '') {
        c[field].value = null
      } else {
        const num = parseFloat(val.replace(/[^0-9.-]/g, ''))
        if (!isNaN(num)) c[field].value = num
      }
      e.target.classList.add('edited')
      e.target.title = 'Edited by user'
    })
  })
}
