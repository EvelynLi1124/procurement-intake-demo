import type { Step } from '../components/ui'

export const screeningSteps = (pct: string): Step[] => [
  { label: 'Screening', state: 'active', sub: pct },
  { label: 'Intake', state: 'default' },
  { label: 'PSQ questions', state: 'default' },
  { label: 'Risk assessment', state: 'default' },
]
export const screeningOnly: Step[] = [{ label: 'Screening', state: 'active', sub: '0%' }]
export const scopeSteps: Step[] = [
  { label: 'Screening', state: 'active', sub: '100%' },
  { label: 'Intake', state: 'default' },
  { label: 'Risk assessment', state: 'default' },
  { label: 'Inherent risk questions', state: 'default', optional: true },
]
export const intakeSteps = (pct: string): Step[] => [
  { label: 'Screening', state: 'success', sub: '100%' },
  { label: 'Intake', state: 'active', sub: pct },
  { label: 'Risk assessment', state: 'default' },
  { label: 'Inherent risk questions', state: 'default', optional: true },
]
