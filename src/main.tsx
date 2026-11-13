import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'

// Figma frames are 1440px wide: scale the whole app on narrower viewports so the layout stays exact.
// transform (not zoom) keeps browser minimum-font-size rules from distorting text.
const DESIGN_W = 1440
const fit = () => {
  const z = Math.min(1, window.innerWidth / DESIGN_W)
  const root = document.getElementById('root')!
  root.style.transform = z < 1 ? `scale(${z})` : ''
  root.style.width = `${window.innerWidth / z}px`
  root.style.height = `${window.innerHeight / z}px`
  document.documentElement.style.setProperty('--app-h', `${window.innerHeight / z}px`)
}
fit()
window.addEventListener('resize', fit)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div id="scroller">
      <App />
    </div>
  </StrictMode>,
)
