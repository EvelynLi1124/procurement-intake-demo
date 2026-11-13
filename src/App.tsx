import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AppShell } from './components/Shell'
import { ChatPanel } from './components/ChatPanel'
import { Card, PrimaryButton } from './components/ui'
import chats from './data/chats.json'
import type { ChatScreen } from './types/chat'
import {
  ConfirmModal, IntakeDetails, Landing, OutcomeCard, Screen11, Screen12, Screen121, Screen13, Screen14, Screen15,
  Screen16, Screen161, Screen17, Screen171, type Nav,
} from './screens/Flow1'

const CHATS = chats as unknown as Record<string, ChatScreen>

export const SCREENS: { id: string; name: string; group: string }[] = [
  { id: '0', name: 'Landing', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.1', name: 'Select supplier type', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.2', name: 'Existing supplier', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.2.1', name: 'New supplier', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.3', name: 'Missing information', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.4', name: 'Confirm supplier', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.5', name: 'Confirm supplier by contract', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.6', name: 'In-scope', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.7', name: 'PSQ questions', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.8', name: 'Intake details', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.9', name: 'Review and confirm modal', group: 'Flow 1 – Set up a new contract (in-scope path)' },
  { id: '1.6.1', name: 'In-scope (Create new variant)', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.6.2', name: 'Direct Purchase', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.6.3', name: 'Simpler way (Treasury)', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.6.4', name: 'Easier way (Ivalua P2P)', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.6.5', name: 'Ready to place order', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.6.6', name: 'Business-managed', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.6.7', name: 'Handled locally', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.6.8', name: 'Easier way (P2P variant)', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.7.1', name: 'Intake summary (collapsed)', group: 'Flow 1 – AI-decided variants (index only)' },
  { id: '1.8.1', name: 'Direct Purchase after PSQ', group: 'Flow 1 – AI-decided variants (index only)' },
]

const readHash = () => decodeURIComponent(location.hash.replace(/^#\/?/, '')) || '0'

function ScreenIndex({ nav }: { nav: Nav }) {
  const groups = [...new Set(SCREENS.map((s) => s.group))]
  return (
    <div className="index">
      <h1>Screen index</h1>
      {groups.map((g) => (
        <div key={g}>
          <h3>{g}</h3>
          <div className="index-grid">
            {SCREENS.filter((s) => s.group === g).map((s) => (
              <button key={s.id} className="index-link" onClick={() => nav(s.id)}>
                {s.id}<small>{s.name}</small>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function NotBuilt({ id, nav }: { id: string; nav: Nav }) {
  return (
    <div className="placeholder">
      <Card title={`Screen ${id} is not built yet`} footer={<PrimaryButton onClick={() => nav('index')}>Screen index</PrimaryButton>}>
        <p>This screen belongs to a later flow and will be built after Flow 1 is approved.</p>
      </Card>
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState(readHash)
  useEffect(() => {
    const on = () => setRoute(readHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => document.getElementById('scroller')?.scrollTo(0, 0), [route])
  const nav: Nav = useCallback((to) => { location.hash = '/' + to }, [])

  const chatKey = route === 'index' || !CHATS[route] ? (route.startsWith('1') ? '1.1' : '0') : route
  const screen = CHATS[chatKey]

  let body: ReactNode
  let overlay: ReactNode
  switch (route) {
    case '0': body = <Landing nav={nav} />; break
    case '1.1': body = <Screen11 />; break
    case '1.2': body = <Screen12 />; break
    case '1.2.1': body = <Screen121 />; break
    case '1.3': body = <Screen13 nav={nav} />; break
    case '1.4': body = <Screen14 nav={nav} />; break
    case '1.5': body = <Screen15 nav={nav} />; break
    case '1.6': body = <Screen16 nav={nav} />; break
    case '1.6.1': body = <Screen161 nav={nav} />; break
    case '1.6.2': case '1.6.3': case '1.6.4': case '1.6.5': case '1.6.6': case '1.6.7': case '1.6.8': case '1.8.1':
      body = <OutcomeCard id={route} nav={nav} />; break
    case '1.7': body = <Screen17 nav={nav} />; break
    case '1.7.1': body = <Screen171 />; break
    case '1.8': body = <IntakeDetails nav={nav} />; break
    case '1.9': body = <IntakeDetails nav={nav} confirmed />; overlay = <ConfirmModal nav={nav} />; break
    case 'index': body = <ScreenIndex nav={nav} />; break
    default: body = <NotBuilt id={route} nav={nav} />
  }

  const onPill = (p: string) => {
    if (route !== '1.1') return
    if (p === 'I have an existing supplier') nav('1.2')
    else if (p === 'I have a new supplier') nav('1.2.1')
  }
  const onSend = () => {
    if (route === '1.2' || route === '1.2.1') nav('1.3')
  }

  return (
    <>
      <AppShell
        chat={<ChatPanel key={chatKey} screen={screen} onPill={onPill} onSend={onSend} />}
        showCreateNew={screen.createNew && route !== 'index'}
        navActive="home"
        onHome={() => nav('0')}
        overlay={overlay}
      >
        {body}
      </AppShell>
      <a className="demo-badge" href="#/index">Screen index · {route}</a>
    </>
  )
}
