import { companies, revEUR } from '../data.js'

function bar(label, value, max, display, isJotun, color) {
  const pct = Math.max(5, (value / max) * 100).toFixed(0)
  const style = color ? `background:${color}` : ''
  return `<div class="bar-row">
    <span class="bar-label">${label}</span>
    <div class="bar-track">
      <div class="bar-fill ${isJotun ? 'jotun' : 'comp'}" style="width:${pct}%;${style}">${display}</div>
    </div>
  </div>`
}

function fmtB(v) { return v >= 1 ? `€${v.toFixed(1)}B` : `€${(v * 1000).toFixed(0)}M` }

export function render() {
  // Valuation
  const peers = companies.filter(c => c.marketCap && c.ebitda.value && c.netDebt.value)
  const multiples = peers.map(c => {
    const evLocal = c.marketCap + c.netDebt.value
    const evEUR = evLocal * c.eurRate
    const ebitdaEUR = c.ebitda.value * c.eurRate
    return { company: c.company, ev: evEUR, ebitda: ebitdaEUR, multiple: evEUR / ebitdaEUR }
  })
  const medMultiple = [...multiples].sort((a, b) => a.multiple - b.multiple)[Math.floor(multiples.length / 2)].multiple
  const jotunEbitdaEUR = (7.08 * 1.15) * 0.086
  const jotunEvLow = jotunEbitdaEUR * (medMultiple * 0.85)
  const jotunEvMid = jotunEbitdaEUR * medMultiple
  const jotunEvHigh = jotunEbitdaEUR * (medMultiple * 1.15)

  // Efficiency
  const effData = companies.filter(c => c.employees.value).map(c => {
    const revPerEmp = (revEUR(c) * 1e9) / c.employees.value
    const margin = c.ebitdaMargin.value || c.opMargin.value || 0
    const profPerEmp = margin > 0 ? (revEUR(c) * 1e9 * margin / 100) / c.employees.value : null
    return { ...c, revPerEmp, profPerEmp }
  })
  const maxRevPerEmp = Math.max(...effData.map(d => d.revPerEmp)) * 1.1
  const maxProfPerEmp = Math.max(...effData.filter(d => d.profPerEmp).map(d => d.profPerEmp)) * 1.1

  // Debt
  const debtData = companies.filter(c => c.netDebt.value && c.ebitda.value).map(c => {
    const nd = c.netDebt.value * c.eurRate
    const eb = c.ebitda.value * c.eurRate
    return { company: c.company, leverage: nd / eb, isJotun: c.company === 'Jotun' }
  }).sort((a, b) => b.leverage - a.leverage)
  const maxLev = Math.max(...debtData.map(d => d.leverage)) * 1.1

  // Growth
  const scenarios = [
    { name: 'Conservative', growth: 3, margin: 19, color: 'var(--muted)' },
    { name: 'Base Case', growth: 5, margin: 20.7, color: 'var(--accent)' },
    { name: 'Aggressive', growth: 8, margin: 22, color: 'var(--green)' },
  ]
  const projections = scenarios.map(s => {
    let rev = 2.95
    const revs = []
    for (let y = 0; y <= 5; y++) { revs.push({ year: 2025 + y, rev }); rev *= (1 + s.growth / 100) }
    return { ...s, revs, final: revs[5].rev, finalProfit: revs[5].rev * s.margin / 100 }
  })
  const maxFinal = Math.max(...projections.map(p => p.final))

  // Market share
  const MARKET_EUR = 176 // $194B * 0.91
  const totalPeer = companies.reduce((s, c) => s + revEUR(c), 0)
  const shareData = [...companies].sort((a, b) => revEUR(b) - revEUR(a))

  return `
    <div class="view-header">
      <div>
        <h1>Financial Analysis</h1>
        <p class="view-sub">Valuation, efficiency, leverage, and growth modeling</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Implied Valuation — Jotun (if public)</h2></div>
      <p class="card-desc">Peer EV/EBITDA multiples applied to Jotun's estimated EBITDA (op. profit + ~15% D&A add-back)</p>
      <div class="grid-2" style="margin-top:20px">
        <div>
          <h3 class="mini-header">Peer Multiples</h3>
          <table class="mini-table">
            <thead><tr><th>Company</th><th>EV (€B)</th><th>EBITDA (€B)</th><th>Multiple</th></tr></thead>
            <tbody>
              ${multiples.map(m => `<tr><td>${m.company}</td><td>${fmtB(m.ev)}</td><td>${fmtB(m.ebitda)}</td><td><strong>${m.multiple.toFixed(1)}x</strong></td></tr>`).join('')}
              <tr class="avg-row"><td>Median</td><td></td><td></td><td><strong>${medMultiple.toFixed(1)}x</strong></td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 class="mini-header">Jotun Enterprise Value</h3>
          <div class="val-row"><span>Est. EBITDA</span><strong>${fmtB(jotunEbitdaEUR)}</strong></div>
          <div class="val-row"><span>Median multiple</span><strong>${medMultiple.toFixed(1)}x</strong></div>
          <div class="val-range">
            <div class="range-bar">
              <div>${fmtB(jotunEvLow)}</div>
              <div class="range-mid">${fmtB(jotunEvMid)}</div>
              <div>${fmtB(jotunEvHigh)}</div>
            </div>
            <div class="range-labels">
              <span>${(medMultiple * 0.85).toFixed(1)}x</span>
              <span>Base</span>
              <span>${(medMultiple * 1.15).toFixed(1)}x</span>
            </div>
          </div>
          <p class="note" style="margin-top:12px">Private company discount (15-30%) not applied. Superior margins could justify premium.</p>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h2>Global Market Share</h2></div>
        <p class="card-desc">Share of €${MARKET_EUR}B global coatings market</p>
        <div class="card-body">
          ${shareData.map(c => bar(c.company, revEUR(c) / MARKET_EUR * 100, 14, `${(revEUR(c) / MARKET_EUR * 100).toFixed(1)}%`, c.company === 'Jotun')).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2>Peer Group Share</h2></div>
        <p class="card-desc">Revenue share among tracked competitors</p>
        <div class="card-body">
          ${shareData.map(c => bar(c.company, revEUR(c) / totalPeer * 100, 40, `${(revEUR(c) / totalPeer * 100).toFixed(1)}%`, c.company === 'Jotun')).join('')}
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h2>Revenue per Employee</h2></div>
        <div class="card-body">
          ${effData.sort((a, b) => b.revPerEmp - a.revPerEmp).map(d => bar(d.company, d.revPerEmp, maxRevPerEmp, `€${(d.revPerEmp / 1000).toFixed(0)}K`, d.company === 'Jotun')).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2>Profit per Employee</h2></div>
        <div class="card-body">
          ${effData.filter(d => d.profPerEmp).sort((a, b) => b.profPerEmp - a.profPerEmp).map(d => bar(d.company, d.profPerEmp, maxProfPerEmp, `€${(d.profPerEmp / 1000).toFixed(0)}K`, d.company === 'Jotun')).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Leverage & Financial Risk</h2></div>
      <p class="card-desc">Net Debt / EBITDA — lower is safer</p>
      <div class="card-body" style="max-width:700px">
        ${debtData.map(d => {
          const color = d.leverage > 3 ? 'var(--red)' : d.leverage > 2 ? '#ea580c' : 'var(--green)'
          return bar(d.company, d.leverage, maxLev, `${d.leverage.toFixed(1)}x`, false, color)
        }).join('')}
        ${bar('Jotun', 0.5, maxLev, 'Low / Private', true)}
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>5-Year Growth Scenarios — Jotun</h2></div>
      <p class="card-desc">Revenue projection at different growth rates</p>
      <div class="scenario-grid">
        <div class="scenario-chart-area">
          <svg viewBox="0 0 500 200" class="line-chart">
            ${projections.map(s => {
              const pts = s.revs.map((r, i) => `${i * 100},${200 - (r.rev / (maxFinal * 1.1)) * 190}`).join(' ')
              return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5"/>`
            }).join('')}
            ${[0,1,2,3,4,5].map(i => `<text x="${i * 100}" y="198" fill="var(--muted)" font-size="11">${2025 + i}</text>`).join('')}
          </svg>
        </div>
        <div class="scenario-legend">
          ${projections.map(s => `
            <div class="legend-item">
              <span class="legend-dot" style="background:${s.color}"></span>
              <div>
                <strong>${s.name}</strong> — ${s.growth}% CAGR<br>
                <span class="legend-result">2030: ${fmtB(s.final)} rev, ${fmtB(s.finalProfit)} profit</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

export function init() {}
