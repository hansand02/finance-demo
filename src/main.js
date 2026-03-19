import './style.css'
import * as dashboard from './views/dashboard.js'
import * as analysis from './views/analysis.js'
import * as dataview from './views/dataview.js'
import * as live from './views/live.js'

const views = { dashboard, analysis, data: dataview, live }
let currentView = 'dashboard'

function navigate(view) {
  currentView = view
  const content = document.getElementById('content')
  const mod = views[view]
  if (!mod) return

  content.innerHTML = mod.render()
  content.scrollTop = 0
  mod.init()

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view)
  })
}

// Nav click handlers
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault()
    navigate(el.dataset.view)
  })
})

// Initial render
navigate('dashboard')
