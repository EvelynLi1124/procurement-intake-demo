import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'
import './ui.css'

/* ---------- Stepper ---------- */
export type StepState = 'active' | 'default' | 'success'
export type Step = { label: string; state: StepState; sub?: string; optional?: boolean }

// inset: Figma's horizontal tracker variant (1.6, 1.7, 1.8) offsets the stepper by an extra 12px
export function Stepper({ steps, inset }: { steps: Step[]; inset?: boolean }) {
  return (
    <div className="tracker" style={inset ? { paddingLeft: 24 } : undefined}>
      <div className="stepper">
        {steps.map((s, i) => (
          <div key={s.label} className={'step step-' + s.state}>
            <div className="step-circle">
              {s.state === 'success' ? <Icon name="tick-check-24" /> : i + 1}
            </div>
            <div className="step-labels">
              <div className="step-label">{s.label}</div>
              {(s.sub || s.optional) && (
                <div className="step-sub">{s.optional ? <span style={{ fontWeight: 300 }}>(Optional)</span> : s.sub}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Buttons ---------- */
type BtnProps = { children: ReactNode; onClick?: () => void; icon?: string; external?: boolean; hug?: boolean; title?: string }

export function PrimaryButton({ children, onClick, external, hug, title }: BtnProps) {
  return (
    <button className={'btn btn-primary' + (hug || external ? ' hug' : '')} onClick={onClick} title={title}>
      <span>{children}</span>
      {external && <Icon name="external-link-18" color="#ffffff" />}
    </button>
  )
}
export function SecondaryButton({ children, onClick, external, hug, title }: BtnProps) {
  return (
    <button className={'btn btn-secondary' + (hug || external ? ' hug' : '')} onClick={onClick} title={title}>
      <span>{children}</span>
      {external && <Icon name="external-link-18" color="#ec6453" />}
    </button>
  )
}
export function TertiaryButton({ children, onClick, icon = 'arrow-left-24', title }: BtnProps) {
  return (
    <button className="btn-tertiary" onClick={onClick} title={title}>
      <Icon name={icon} />
      <span>{children}</span>
    </button>
  )
}

/* ---------- Card ---------- */
type CardProps = {
  title: string
  titleColor?: string
  titleRight?: ReactNode
  children: ReactNode
  footer?: ReactNode
  contentPad?: string
}
export function Card({ title, titleColor, titleRight, children, footer, contentPad = '0 12px' }: CardProps) {
  return (
    <section className="card">
      <div className="card-title-row">
        <h2 className="card-title" style={{ color: titleColor }}>{title}</h2>
        {titleRight}
      </div>
      <div className="card-content" style={{ padding: contentPad }}>{children}</div>
      {footer && (
        <>
          <div className="divider" />
          <div className="cta-row">{footer}</div>
        </>
      )}
    </section>
  )
}

/* ---------- Scroll area with CDS-style scrollbar ---------- */
export function ScrollArea({ children, gap = 0, barGap = 12 }: { children: ReactNode; gap?: number; barGap?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ top: 0, h: 156 })
  const update = () => {
    const el = ref.current
    if (!el) return
    const track = el.clientHeight - 16
    const max = el.scrollHeight - el.clientHeight
    // Figma's scrollbar component uses a fixed 156px thumb
    const h = Math.max(0, Math.min(156, track))
    const top = max > 0 ? (el.scrollTop / max) * (track - h) : 0
    if (h !== thumb.h || top !== thumb.top) setThumb({ h, top })
  }
  useLayoutEffect(update)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(update)
    ro.observe(ref.current)
    ro.observe(ref.current.firstElementChild as Element)
    return () => ro.disconnect()
  })
  return (
    <div className="scroll-area" style={{ gap: barGap }}>
      <div className="scroll-content no-scrollbar" ref={ref} onScroll={update}>
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
      </div>
      <div className="scrollbar">
        <div className="scrollbar-track">
          <div className="scrollbar-thumb" style={{ height: thumb.h, transform: `translateY(${thumb.top}px)` }} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Alert ---------- */
export function Alert({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="alert">
      <Icon name="circle-warning-32" />
      <div className="alert-content">
        <div className="alert-heading">{heading}</div>
        <div className="alert-body">{children}</div>
      </div>
    </div>
  )
}

/* ---------- Tags ---------- */
export function StatusTag({ active }: { active: boolean }) {
  return (
    <span className={'status-tag ' + (active ? 'is-active' : 'is-inactive')}>
      <span className="status-dot" />
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
export function CountTag({ tone, children }: { tone: 'coral' | 'gold' | 'green'; children: ReactNode }) {
  return <span className={'count-tag tone-' + tone}>{children}</span>
}
export function SmallTag({ tone, children }: { tone: 'green' | 'light'; children: ReactNode }) {
  return <span className={'small-tag tone-' + tone}>{children}</span>
}

/* ---------- Field card + inputs ---------- */
export type FieldStatus = 'warning' | 'check' | 'circle-check' | 'unchecked'
const STATUS_ICON: Record<FieldStatus, string> = {
  warning: 'circle-warning-20',
  check: 'button-checkmark-outlined-20',
  'circle-check': 'circle-checkmark-20',
  unchecked: 'radio-button-unchecked-20',
}
export function FieldCard({ status, children, width }: { status: FieldStatus; children: ReactNode; width?: number }) {
  return (
    <div className="field-card" style={{ width }}>
      <div className="field-card-row">
        <Icon name={STATUS_ICON[status]} />
        <div className="field-card-body">{children}</div>
      </div>
    </div>
  )
}

type LabelProps = { label: ReactNode; help?: ReactNode; counter?: string; optional?: boolean; disabled?: boolean }
function FieldLabel({ label, help, counter, optional, disabled }: LabelProps) {
  return (
    <div className="field-label-wrap">
      <div className="field-label-row">
        <span className={'field-label' + (disabled ? ' disabled' : '')}>
          {label}
          {optional && <span className="optional"> (Optional)</span>}
        </span>
        {counter && <span className="counter">{counter}</span>}
      </div>
      {help && <div className="field-help">{help}</div>}
    </div>
  )
}

type DropdownProps = LabelProps & { value: string; width?: number; grow?: number }
// `grow` sets a proportional share of the row (e.g. 4:1), shrinking/growing with the container.
const groupStyle = (width?: number, grow?: number) => (grow ? { flex: `${grow} 1 0` } : { width, flex: width ? 'none' : 1 })
export function Dropdown({ value, width, grow, ...l }: DropdownProps) {
  return (
    <div className="input-group" style={groupStyle(width, grow)}>
      <FieldLabel {...l} />
      <button className={'field dropdown' + (l.disabled ? ' disabled' : '')} disabled={l.disabled} title="Option list not defined in Figma">
        <span className="dropdown-value">{value}</span>
        <Icon name="button-down-icon-24" color={l.disabled ? '#8e90a2' : '#282b3e'} />
      </button>
    </div>
  )
}

type TextInputProps = LabelProps & { placeholder?: string; defaultValue?: string; width?: number; grow?: number }
export function TextInput({ placeholder, defaultValue, width, grow, ...l }: TextInputProps) {
  return (
    <div className="input-group" style={groupStyle(width, grow)}>
      <FieldLabel {...l} />
      <input
        className={'field text-input' + (l.disabled ? ' disabled' : '')}
        disabled={l.disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  )
}

export function TextArea({ placeholder, max = 100, ...l }: LabelProps & { placeholder?: string; max?: number }) {
  const [v, setV] = useState('')
  return (
    <div className="input-group fill">
      <FieldLabel {...l} counter={`${v.length}/${max}`} />
      <textarea className="field text-area" placeholder={placeholder} maxLength={max} value={v} onChange={(e) => setV(e.target.value)} />
    </div>
  )
}

export function DatePicker(l: LabelProps) {
  return (
    <div className="input-group fill">
      <FieldLabel {...l} />
      <label className="field date-picker">
        <input type="text" placeholder="dd / mm / yyyy" />
        <Icon name="calendar-24" />
      </label>
    </div>
  )
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="field-row">{children}</div>
}

/* ---------- Radio ---------- */
export function Radio({ checked, onChange, children, align = 'start' }: { checked: boolean; onChange: () => void; children: ReactNode; align?: 'start' | 'center' }) {
  return (
    <label className="radio" style={{ alignItems: align === 'center' ? 'center' : 'flex-start' }}>
      <input type="radio" checked={checked} onChange={onChange} />
      <span className={'radio-circle' + (checked ? ' checked' : '')} />
      <span className="radio-label">{children}</span>
    </label>
  )
}

export function YesNo({ label, initial, gap = 16 }: { label: string; initial?: 'Yes' | 'No'; gap?: number }) {
  const [v, setV] = useState<string | undefined>(initial)
  return (
    <div className="input-group">
      <FieldLabel label={label} />
      <div className="radio-inline" style={{ gap }}>
        {['Yes', 'No'].map((o) => (
          <Radio key={o} checked={v === o} onChange={() => setV(o)} align="center">{o}</Radio>
        ))}
      </div>
    </div>
  )
}

/* ---------- Pills ---------- */
export function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button className={'pill' + (selected ? ' selected' : '')} onClick={onClick} aria-pressed={selected}>
      {children}
    </button>
  )
}

/* ---------- Accordion ---------- */
export function Accordion({ title, tag, children, defaultOpen = true }: { title: string; tag?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="accordion">
      <button className="accordion-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="accordion-title">
          <Icon name={open ? 'chevron-up-20' : 'chevron-down-20'} />
          {title}
        </span>
        {tag}
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  )
}

/* ---------- Links ---------- */
export function TextLink({ children, size = 16 }: { children: ReactNode; size?: 16 | 18 }) {
  return (
    <a className="text-link" style={{ fontSize: size }} href="#" onClick={(e) => e.preventDefault()} title="URL not provided in Figma">
      {children}
      <Icon name="external-link-14" />
    </a>
  )
}

/* ---------- Modal ---------- */
export function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={onClose} aria-label="Close"><Icon name="cross-20" /></button>
        </div>
        <div className="modal-container">{children}</div>
      </div>
    </div>
  )
}
