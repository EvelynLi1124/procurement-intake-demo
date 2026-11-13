import type { ReactNode } from 'react'
import { Icon } from './Icon'
import './shell.css'

type NavProps = { showCreateNew: boolean; onCreateNew?: () => void; onLogo?: () => void }

export function NavHeader({ showCreateNew, onCreateNew, onLogo }: NavProps) {
  return (
    <header className="nav-header">
      <button className="nav-logo" onClick={onLogo} aria-label="Manulife home">
        <Icon name="logo-80" />
      </button>
      <Icon name="logotype-108" className="nav-logotype" />
      <div className="nav-menu">
        {showCreateNew && (
          <button className="btn-header-secondary" onClick={onCreateNew}>
            <Icon name="plus-2-20" />
            <span>Create new request</span>
          </button>
        )}
        <button className="menu-button"><Icon name="globe-20" /><span>FR</span></button>
        <button className="menu-button"><Icon name="night-20" /><span>Dark</span></button>
        <div className="avatar">EL</div>
      </div>
    </header>
  )
}

const NAV_ITEMS = [
  { key: 'home', icon: 'home-1-20', label: 'Home' },
  { key: 'intakes', icon: 'document-20', label: 'My intakes' },
  { key: 'research', icon: 'form-search-20', label: 'Deep\nresearch' },
  { key: 'kpis', icon: 'earning-bar-chart-20', label: 'KPIs' },
]

export function SideMenu({ active, onHome }: { active?: string; onHome: () => void }) {
  return (
    <nav className="side-menu">
      <div className="side-sticky">
      {NAV_ITEMS.map((it) => (
        <button
          key={it.key}
          className={'side-item' + (active === it.key ? ' is-active' : '')}
          onClick={it.key === 'home' ? onHome : undefined}
          title={it.key === 'home' ? undefined : 'Not designed in Figma'}
        >
          <Icon name={it.icon} color="#ffffff" />
          <span className="side-label">{it.label}</span>
        </button>
      ))}
      </div>
    </nav>
  )
}

type ShellProps = {
  chat: ReactNode
  children: ReactNode
  showCreateNew: boolean
  navActive?: string
  onHome: () => void
  overlay?: ReactNode
}

export function AppShell({ chat, children, showCreateNew, navActive, onHome, overlay }: ShellProps) {
  return (
    <div className="app">
      <NavHeader showCreateNew={showCreateNew} onLogo={onHome} />
      <div className="app-body">
        <SideMenu active={navActive} onHome={onHome} />
        <aside className="chat">{chat}</aside>
        <main className="right no-scrollbar" id="right-scroll">{children}</main>
      </div>
      {overlay}
    </div>
  )
}
