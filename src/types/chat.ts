export type Run = { t: string; w?: number; i?: number; c?: string }
export type ChatItem =
  | { type: 'welcome' }
  | { type: 'user'; text: string }
  | { type: 'activity'; label: string; expanded: boolean; status: string | null; detail: string[] }
  | { type: 'bot'; runs: Run[]; lines: string[] }
  | { type: 'suggest'; title: string; pills: string[]; tile: string | null }
export type ChatScreen = {
  items: ChatItem[]
  input: { text: string; active: boolean }
  createNew: boolean
  chatAlign: string
  chatGap: number
  chatPad: number[]
}
