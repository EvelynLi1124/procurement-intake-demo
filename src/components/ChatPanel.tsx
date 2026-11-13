import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ChatItem, ChatScreen, Run } from '../types/chat'
import { Icon } from './Icon'
import './chat.css'

function splitLines(runs: Run[]): Run[][] {
  const lines: Run[][] = [[]]
  for (const r of runs) {
    r.t.split('\n').forEach((piece, idx) => {
      if (idx > 0) lines.push([])
      if (piece) lines[lines.length - 1].push({ ...r, t: piece })
    })
  }
  return lines
}

function RunSpan({ r }: { r: Run }) {
  return (
    <span style={{ fontWeight: r.w, fontStyle: r.i ? 'italic' : undefined, color: r.c }}>{r.t}</span>
  )
}

function BotBody({ runs, lines: types }: { runs: Run[]; lines: string[] }) {
  const lines = splitLines(runs)
  const out: React.ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    if (types[i] === 'UNORDERED') {
      const items: Run[][] = []
      while (i < lines.length && types[i] === 'UNORDERED') items.push(lines[i++])
      out.push(
        <ul key={i}>
          {items.map((l, k) => (
            <li key={k}>{l.map((r, j) => <RunSpan key={j} r={r} />)}</li>
          ))}
        </ul>,
      )
    } else {
      const l = lines[i++]
      if (i === lines.length && l.length === 0) break
      out.push(
        <div key={i} className="bot-line">
          {l.length ? l.map((r, j) => <RunSpan key={j} r={r} />) : '\u00a0'}
        </div>,
      )
    }
  }
  return <>{out}</>
}

function Welcome() {
  return (
    <div className="welcome-wrap">
      <div className="welcome">
        <p className="welcome-hi">
          <span className="welcome-spark">✦</span> Hi{' '}
          <span className="serif">Evelyn</span>.
        </p>
        <p className="welcome-intro">
          I’m [AGENT NAME], your <span style={{ color: '#0000c1' }}>Manulife Procurement AI Assistant</span>.
          <br />
          Not sure where to start your procurement journey? Tell me what you need and I’ll guide you.
        </p>
      </div>
      <p className="welcome-intro">What would you like to do today?</p>
    </div>
  )
}

function Activity({ item }: { item: Extract<ChatItem, { type: 'activity' }> }) {
  const [open, setOpen] = useState(item.expanded)
  const hasDetail = !!item.status
  return (
    <div className="activity">
      <button className="activity-head" onClick={() => hasDetail && setOpen(!open)} aria-expanded={open}>
        <span className="activity-label">
          <Icon name="robot-20" />
          {item.label}
        </span>
        <Icon name={open ? 'button-up-icon-24' : 'button-down-icon-24'} />
      </button>
      {open && hasDetail && (
        <div className="activity-detail">
          <div className="activity-status">
            <span className="dot" />
            {item.status}
          </div>
          {item.detail.map((d) => (
            <div key={d} className="activity-done">{d}</div>
          ))}
        </div>
      )}
    </div>
  )
}

type Props = {
  screen: ChatScreen
  onPill?: (label: string) => void
  onSend?: (text: string) => void
}

export function ChatPanel({ screen, onPill, onSend }: Props) {
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => setText(''), [screen])
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [screen])
  useLayoutEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = '0px'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [text])

  const isLanding = screen.items[0]?.type === 'welcome'
  const [pt, pr, pb, pl] = screen.chatPad
  const active = text.trim().length > 0
  const send = () => {
    if (!active) return
    onSend?.(text)
  }

  return (
    <>
      <div className="chat-header">
        <button className="chat-action" aria-label="Menu"><Icon name="hamburger-24" /></button>
        <div className="chat-title">AI Storefront</div>
        <button className="chat-action" aria-label="Collapse"><Icon name="collapse-24" /></button>
      </div>
      <div className="chat-area no-scrollbar" ref={scrollRef}>
        <div
          className="chat-stack"
          style={{
            padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
            gap: screen.chatGap,
            justifyContent: isLanding ? 'center' : screen.chatAlign === 'MIN' ? 'flex-start' : 'flex-end',
          }}
        >
          {screen.items.map((it, idx) => (
            <Fragment key={idx}>
              {it.type === 'welcome' && <Welcome />}
              {it.type === 'user' && (
                <div className="bubble-row user">
                  <div className="bubble user">{it.text}</div>
                </div>
              )}
              {it.type === 'activity' && <Activity item={it} />}
              {it.type === 'bot' && (
                <div className="bubble-row bot">
                  <div className="bot-col">
                    <div className="bubble bot"><BotBody runs={it.runs} lines={it.lines} /></div>
                    <div className="bubble-actions">
                      <button aria-label="Like"><Icon name="like-20" /></button>
                      <button aria-label="Dislike"><Icon name="like-20" style={{ transform: 'rotate(180deg)' }} /></button>
                    </div>
                  </div>
                </div>
              )}
              {it.type === 'suggest' && (
                <div className="suggest">
                  <div className="suggest-title">{it.title}</div>
                  {it.pills.length > 0 && (
                    <div className="pills-small">
                      {it.pills.map((p) => (
                        <button key={p} className="pill-small" onClick={() => onPill?.(p.trim())}>{p}</button>
                      ))}
                    </div>
                  )}
                  {it.tile && (
                    <button className="prompt-tile" onClick={() => { setText(it.tile!); taRef.current?.focus() }}>
                      <span>{it.tile}</span>
                    </button>
                  )}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="input-area">
        <div className={'chat-field' + (active ? ' is-active' : '')}>
          <span className="chat-field-main">
            <Icon name="attach-24" color={active ? '#34384b' : '#8e90a2'} />
            <textarea
              ref={taRef}
              rows={1}
              value={text}
              placeholder={screen.input.active ? 'Tell me your objective...' : screen.input.text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
              }}
            />
          </span>
          <button className="send" onClick={send} disabled={!active} aria-label="Send">
            <Icon name={active ? 'send-active-36' : 'send-disabled-36'} />
          </button>
        </div>
      </div>
    </>
  )
}
