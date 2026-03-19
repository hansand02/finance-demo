import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const FMP_KEY = process.env.FMP_API_KEY || 'demo'
const FMP_BASE = 'https://financialmodelingprep.com/api/v3'

const TICKERS = {
  'Sherwin-Williams': { symbol: 'SHW', hq: 'Cleveland, US' },
  'PPG Industries': { symbol: 'PPG', hq: 'Pittsburgh, US' },
  'AkzoNobel': { symbol: 'AKZOY', hq: 'Amsterdam, NL' },
  'Nippon Paint': { symbol: 'NPCPF', hq: 'Osaka, JP' },
}

// Jotun: hardcoded from official published results (jotun.com)
const JOTUN = {
  company: 'Jotun',
  hq: 'Sandefjord, NO',
  fiscal_year: '2025',
  currency: 'NOK',
  revenue: 34200000000,
  revenue_formatted: 'NOK 34.2B (FY2024)',
  revenue_yoy: '+2%',
  ebitda: null,
  ebitda_formatted: '—',
  ebitda_margin_pct: null,
  operating_income: 7081000000,
  operating_income_formatted: 'NOK 7.08B',
  operating_margin_pct: 20.7,
  net_income: null,
  net_income_formatted: '—',
  total_assets: null,
  total_assets_formatted: 'Private',
  net_debt: null,
  net_debt_formatted: 'Private (low leverage)',
  debt_to_equity: null,
  source: 'Jotun official press release — "All-time high from Jotun"',
  source_url: 'https://www.jotun.com/ww-en/about-jotun/media/news/all-time-high-from-jotun',
  hardcoded: true,
}

async function fetchFMP(endpoint) {
  const url = `${FMP_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${FMP_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`FMP ${res.status}: ${res.statusText}`)
  return res.json()
}

function fmt(value, currency = 'USD') {
  if (!value && value !== 0) return null
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  const sym = { USD: '$', EUR: '€', JPY: '¥', NOK: 'NOK ', INR: '₹' }[currency] || currency + ' '
  if (abs >= 1e12) return `${sign}${sym}${(abs / 1e12).toFixed(2)}T`
  if (abs >= 1e9) return `${sign}${sym}${(abs / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `${sign}${sym}${(abs / 1e6).toFixed(0)}M`
  return `${sign}${sym}${abs.toLocaleString()}`
}

async function getCompanyData(name, { symbol, hq }) {
  const [income, balance] = await Promise.all([
    fetchFMP(`/income-statement/${symbol}?limit=2`),
    fetchFMP(`/balance-sheet-statement/${symbol}?limit=1`),
  ])

  const cur = income[0]
  const prev = income[1]
  const bs = balance[0]
  if (!cur) return null

  const ccy = cur.reportedCurrency || 'USD'
  const revYoY = prev?.revenue
    ? (((cur.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)
    : null

  return {
    company: name,
    hq,
    symbol,
    fiscal_year: cur.calendarYear || cur.date?.slice(0, 4),
    currency: ccy,
    revenue: cur.revenue,
    revenue_formatted: fmt(cur.revenue, ccy),
    revenue_yoy: revYoY ? `${revYoY > 0 ? '+' : ''}${revYoY}%` : null,
    ebitda: cur.ebitda,
    ebitda_formatted: fmt(cur.ebitda, ccy),
    ebitda_margin_pct: cur.ebitdaratio ? (cur.ebitdaratio * 100).toFixed(1) : null,
    operating_income: cur.operatingIncome,
    operating_income_formatted: fmt(cur.operatingIncome, ccy),
    operating_margin_pct: cur.operatingIncomeRatio ? (cur.operatingIncomeRatio * 100).toFixed(1) : null,
    net_income: cur.netIncome,
    net_income_formatted: fmt(cur.netIncome, ccy),
    total_assets: bs?.totalAssets,
    total_assets_formatted: fmt(bs?.totalAssets, ccy),
    net_debt: bs?.netDebt,
    net_debt_formatted: fmt(bs?.netDebt, ccy),
    debt_to_equity: bs?.totalDebt && bs?.totalStockholdersEquity
      ? (bs.totalDebt / bs.totalStockholdersEquity).toFixed(2) + 'x'
      : null,
    source: `FMP API — ${symbol} annual filing`,
    source_url: `https://financialmodelingprep.com/financial-statements/${symbol}`,
    filing_date: cur.fillingDate || cur.date,
    hardcoded: false,
  }
}

app.get('/api/competitors', async (req, res) => {
  const results = [JOTUN]
  const errors = []

  for (const [name, info] of Object.entries(TICKERS)) {
    try {
      const data = await getCompanyData(name, info)
      if (data) results.push(data)
      else errors.push({ company: name, error: 'No data' })
    } catch (e) {
      errors.push({ company: name, error: e.message })
    }
  }

  res.json({ companies: results, errors, fetched_at: new Date().toISOString() })
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, fmp_key: FMP_KEY !== 'demo' ? 'configured' : 'demo (get key at financialmodelingprep.com)' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\nCompetitor Intelligence API — http://localhost:${PORT}`)
  console.log(`  FMP key: ${FMP_KEY === 'demo' ? '⚠️  demo — set FMP_API_KEY' : '✓'}`)
  console.log(`  GET /api/competitors — Jotun (hardcoded) + 4 public companies (FMP)`)
  console.log(`  GET /api/health\n`)
})
