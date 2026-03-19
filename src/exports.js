import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { companies, revEUR, fmt } from './data.js'

export function exportExcel() {
  const rows = companies.map(c => ({
    Company: c.company,
    HQ: c.hq,
    'Fiscal Year': c.fy,
    Currency: c.currency,
    Revenue: c.revenue.value ? `${c.revenue.value}${c.revenue.unit}` : '',
    'Revenue (€B)': revEUR(c).toFixed(2),
    'Rev YoY %': c.revenueYoY,
    EBITDA: c.ebitda.value ? `${c.ebitda.value}${c.ebitda.unit}` : '',
    'EBITDA Margin %': c.ebitdaMargin.value || '',
    'Op. Income': c.opIncome.value ? `${c.opIncome.value}${c.opIncome.unit}` : '',
    'Op. Margin %': c.opMargin.value || '',
    'Net Income': c.netIncome.value ? `${c.netIncome.value}${c.netIncome.unit}` : '',
    'Total Assets': c.totalAssets.value ? `${c.totalAssets.value}${c.totalAssets.unit}` : '',
    'Net Debt': c.netDebt.value ? `${c.netDebt.value}${c.netDebt.unit}` : '',
    Employees: c.employees.value || '',
    'Revenue Source': c.revenue.source || '',
    'EBITDA Source': c.ebitda.source || '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 18 }, { wch: 16 }, { wch: 10 }, { wch: 6 },
    { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
    { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
    { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 40 }, { wch: 40 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Competitor Analysis')

  // Sources sheet
  const sourceRows = companies.flatMap(c => {
    const fields = ['revenue', 'ebitda', 'ebitdaMargin', 'opIncome', 'opMargin', 'netIncome', 'totalAssets', 'netDebt', 'employees']
    return fields.filter(f => c[f]?.source).map(f => ({
      Company: c.company,
      Field: f,
      Value: c[f].value,
      Source: c[f].source,
      Note: c[f].note || '',
    }))
  })
  const ws2 = XLSX.utils.json_to_sheet(sourceRows)
  ws2['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 60 }, { wch: 40 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Data Sources')

  XLSX.writeFile(wb, `competitor-analysis-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export function exportPDF() {
  const doc = new jsPDF({ orientation: 'landscape' })

  // Header
  doc.setFillColor(0, 40, 85) // Jotun blue
  doc.rect(0, 0, 297, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('Competitor Intelligence Report', 14, 16)
  doc.setFontSize(10)
  doc.text(`Generated ${new Date().toLocaleDateString()} — FY 2025 Data`, 14, 23)
  doc.text('Sources: Official earnings releases', 200, 23)

  // Table
  const headers = ['Company', 'HQ', 'Revenue', 'EBITDA', 'EBITDA %', 'Op. Income', 'Op. %', 'Net Debt', 'Employees', 'YoY %']
  const rows = companies.map(c => [
    c.company,
    c.hq,
    fmt(c.revenue, c.currency),
    fmt(c.ebitda, c.currency),
    c.ebitdaMargin.value ? c.ebitdaMargin.value + '%' : '—',
    fmt(c.opIncome, c.currency),
    c.opMargin.value ? c.opMargin.value + '%' : '—',
    fmt(c.netDebt, c.currency),
    c.employees.value?.toLocaleString() || '—',
    (c.revenueYoY > 0 ? '+' : '') + c.revenueYoY + '%',
  ])

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 34,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 40, 85], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 245, 255] },
  })

  // Sources section
  const finalY = doc.lastAutoTable.finalY + 10
  doc.setTextColor(0, 40, 85)
  doc.setFontSize(11)
  doc.text('Data Sources', 14, finalY)
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  companies.forEach((c, i) => {
    const y = finalY + 6 + i * 5
    if (y < 195) {
      doc.text(`${c.company}: ${c.revenue.source || 'N/A'}`, 14, y)
    }
  })

  doc.save(`competitor-analysis-${new Date().toISOString().slice(0, 10)}.pdf`)
}
