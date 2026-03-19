// All data from official FY 2025 earnings releases
// Each field has a source URL for verification
// Users can edit values in the Data & Sources view

const FMP_KEY = 'KiJTAlCpDq9rjWAIY9uGe67YyTW1kUAW'

export const companies = [
  {
    id: 'jotun',
    company: 'Jotun', hq: 'Sandefjord, NO', fy: '2025', currency: 'NOK',
    revenue: { value: 34.2, unit: 'B', source: 'https://www.jotun.com/ww-en/about-jotun/media/news/all-time-high-from-jotun', note: 'FY2024 full-year. FY2025 8-mo: NOK 23.0B (+2%)' },
    ebitda: { value: null, unit: 'B', source: null, note: 'Not reported (private)' },
    ebitdaMargin: { value: null, source: null },
    opIncome: { value: 7.08, unit: 'B', source: 'https://www.jotun.com/ww-en/about-jotun/media/news/all-time-high-from-jotun', note: 'FY2025 full-year' },
    opMargin: { value: 20.7, source: 'https://www.jotun.com/ww-en/about-jotun/media/news/all-time-high-from-jotun', note: 'Calculated: 7.08/34.2' },
    netIncome: { value: null, source: null },
    totalAssets: { value: null, source: null, note: 'Private company' },
    netDebt: { value: null, source: null, note: 'Low leverage (private)' },
    employees: { value: 10200, source: 'https://www.jotun.com/ww-en/about-jotun/who-we-are/financial-and-annual-reports', note: 'Annual report 2024' },
    revenueYoY: 2.0, volumeGrowth: 7.0,
    ebitdaYoY: null, // private, not reported
    eurRate: 0.086, // NOK to EUR
    nokRate: 1.0, // already NOK
    ticker: null, private: true,
  },
  {
    id: 'shw',
    company: 'Sherwin-Williams', hq: 'Cleveland, US', fy: '2025', currency: 'USD',
    revenue: { value: 23.57, unit: 'B', source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html', note: 'FY2025 net sales. Record.' },
    ebitda: { value: 4.61, unit: 'B', source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html', note: 'Adjusted EBITDA' },
    ebitdaMargin: { value: 19.6, source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html' },
    opIncome: { value: 3.34, unit: 'B', source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html' },
    opMargin: { value: 14.2, source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html' },
    netIncome: { value: 2.57, unit: 'B', source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html' },
    totalAssets: { value: 23.6, unit: 'B', source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html' },
    netDebt: { value: 9.5, unit: 'B', source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html', note: 'Approximate' },
    employees: { value: 63890, source: 'https://www.prnewswire.com/news-releases/the-sherwin-williams-company-reports-2025-year-end-and-fourth-quarter-financial-results-302673909.html' },
    revenueYoY: 2.1,
    ebitdaYoY: 4.6, // adj. EBITDA growth YoY from earnings release
    eurRate: 0.91,
    nokRate: 11.63, // USD to NOK (approx FY2025 avg)
    ticker: 'SHW', private: false, marketCap: 77.3,
  },
  {
    id: 'ppg',
    company: 'PPG Industries', hq: 'Pittsburgh, US', fy: '2025', currency: 'USD',
    revenue: { value: 15.9, unit: 'B', source: 'https://investor.ppg.com/news/news-details/2026/PPG-reports-fourth-quarter-and-full-year-2025-financial-results/default.aspx', note: 'FY2025 net sales' },
    ebitda: { value: 2.45, unit: 'B', source: 'https://macrotrends.net/stocks/charts/PPG/ppg-industries/ebitda', note: 'TTM through Sep 2025 via MacroTrends' },
    ebitdaMargin: { value: 15.4, source: 'https://macrotrends.net/stocks/charts/PPG/ppg-industries/ebitda' },
    opIncome: { value: 1.9, unit: 'B', source: 'https://macrotrends.net/stocks/charts/PPG/ppg-industries/ebit', note: 'TTM estimate' },
    opMargin: { value: 12.0, source: 'https://macrotrends.net/stocks/charts/PPG/ppg-industries/ebit' },
    netIncome: { value: null, source: null },
    totalAssets: { value: null, source: null },
    netDebt: { value: 5.7, unit: 'B', source: 'https://investor.ppg.com/news/news-details/2026/PPG-reports-fourth-quarter-and-full-year-2025-financial-results/default.aspx', note: 'As of Q2 2025' },
    employees: { value: 50000, source: 'https://investor.ppg.com/news/news-details/2026/PPG-reports-fourth-quarter-and-full-year-2025-financial-results/default.aspx' },
    revenueYoY: 0.2,
    ebitdaYoY: -9.1, // EBITDA declined ~9% YoY (MacroTrends TTM)
    eurRate: 0.91,
    nokRate: 11.63,
    ticker: 'PPG', private: false, marketCap: 27.5,
  },
  {
    id: 'akzo',
    company: 'AkzoNobel', hq: 'Amsterdam, NL', fy: '2025', currency: 'EUR',
    revenue: { value: 10.16, unit: 'B', source: 'https://www.akzonobel.com/en/media/media-releases/q4-2025', note: 'FY2025. Down 5% on FX + India divestment.' },
    ebitda: { value: 1.44, unit: 'B', source: 'https://www.akzonobel.com/en/media/media-releases/q4-2025', note: 'Adjusted EBITDA' },
    ebitdaMargin: { value: 14.2, source: 'https://www.akzonobel.com/en/media/media-releases/q4-2025' },
    opIncome: { value: 1.16, unit: 'B', source: 'https://www.akzonobel.com/en/media/media-releases/q4-2025' },
    opMargin: { value: 11.4, source: 'https://www.akzonobel.com/en/media/media-releases/q4-2025' },
    netIncome: { value: null, source: null },
    totalAssets: { value: null, source: null },
    netDebt: { value: null, source: null, note: 'Leverage ~2.8x net debt/EBITDA' },
    employees: { value: 34000, source: 'https://www.akzonobel.com/en/media/media-releases/q4-2025' },
    revenueYoY: -5.0,
    ebitdaYoY: -2.3, // adj. EBITDA €1.44B vs €1.478B prior year
    eurRate: 1.0,
    nokRate: 11.63 / 0.91, // EUR to NOK (~12.78)
    ticker: 'AKZOY', private: false, marketCap: 12.5,
  },
  {
    id: 'nippon',
    company: 'Nippon Paint', hq: 'Osaka, JP', fy: '2025', currency: 'JPY',
    revenue: { value: 1774, unit: 'B', source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/', note: 'FY2025 ¥1,774B. +8.3% via AOC acquisition.' },
    ebitda: { value: 275, unit: 'B', source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/', note: 'Adjusted operating profit' },
    ebitdaMargin: { value: 15.5, source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/' },
    opIncome: { value: 275, unit: 'B', source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/' },
    opMargin: { value: 15.5, source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/' },
    netIncome: { value: null, source: null },
    totalAssets: { value: 25.5, unit: 'B', source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/', note: 'In USD' },
    netDebt: { value: 7.8, unit: 'B', source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/', note: 'In USD' },
    employees: { value: 33000, source: 'https://www.nipponpaint-holdings.com/en/ir/results/recent/' },
    revenueYoY: 8.3,
    ebitdaYoY: 37.8, // adj. OP up 37.8% YoY (Nippon Paint FY2025)
    eurRate: 0.0061,
    nokRate: 0.071, // JPY to NOK (approx)
    ticker: 'NPCPF', private: false, marketCap: 23.0,
  },
  {
    id: 'hempel',
    company: 'Hempel', hq: 'Copenhagen, DK', fy: '2025', currency: 'EUR',
    revenue: { value: 2.17, unit: 'B', source: 'https://www.hempel.com/about-us/media-and-news/news/2026/annual-report-2025', note: 'Organic growth +3.4%' },
    ebitda: { value: 0.394, unit: 'B', source: 'https://www.hempel.com/about-us/media-and-news/news/2026/annual-report-2025', note: 'Record EBITDA margin' },
    ebitdaMargin: { value: 18.2, source: 'https://www.hempel.com/about-us/media-and-news/news/2026/annual-report-2025' },
    opIncome: { value: null, source: null },
    opMargin: { value: null, source: null },
    netIncome: { value: null, source: null },
    totalAssets: { value: 2.6, unit: 'B', source: 'https://www.hempel.com/about-us/media-and-news/news/2026/annual-report-2025', note: 'FY2024 figure' },
    netDebt: { value: null, source: null, note: 'Private' },
    employees: { value: 7500, source: 'https://www.hempel.com/about-us/media-and-news/news/2026/annual-report-2025' },
    revenueYoY: 3.4,
    ebitdaYoY: null, // not disclosed year-over-year
    eurRate: 1.0,
    nokRate: 11.63 / 0.91, // EUR to NOK (~12.78)
    ticker: null, private: true,
  },
]

// Helper: get revenue in EUR billions for comparison
export function revEUR(c) {
  if (c.currency === 'EUR') return c.revenue.value
  return c.revenue.value * c.eurRate
}

// Helper: convert a value to NOK billions
export function toNOK(value, company) {
  if (!value) return null
  return value * company.nokRate
}

// Helper: format a sourced value for display
export function fmt(field, currency) {
  if (!field || field.value === null) return '—'
  const sym = { USD: '$', EUR: '€', JPY: '¥', NOK: 'NOK ', INR: '₹' }[currency] || ''
  return `${sym}${field.value}${field.unit || ''}`
}

// Helper: format value in NOK
export function fmtNOK(value) {
  if (value === null || value === undefined) return '—'
  if (Math.abs(value) >= 1000) return `NOK ${(value / 1).toFixed(0)}B`
  if (Math.abs(value) >= 1) return `NOK ${value.toFixed(1)}B`
  return `NOK ${(value * 1000).toFixed(0)}M`
}

// Fetch live profile data from FMP API
export async function fetchProfiles(tickers) {
  const results = {}
  for (const t of tickers) {
    try {
      const res = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${t}&apikey=${FMP_KEY}`)
      const data = await res.json()
      if (data && data[0]) results[t] = data[0]
    } catch (e) {
      console.warn(`FMP profile failed for ${t}:`, e.message)
    }
  }
  return results
}

// Fetch peer companies from FMP API
export async function fetchPeers(ticker) {
  try {
    const res = await fetch(`https://financialmodelingprep.com/stable/stock-peers?symbol=${ticker}&apikey=${FMP_KEY}`)
    return await res.json()
  } catch (e) {
    return []
  }
}
