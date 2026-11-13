const raw = import.meta.glob('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const icons: Record<string, string> = {}
for (const [path, svg] of Object.entries(raw)) {
  icons[path.split('/').pop()!.replace('.svg', '')] = svg
}

type Props = {
  name: string
  /** Recolours every filled/stroked shape (Figma exports colours baked in). */
  color?: string
  className?: string
  style?: React.CSSProperties
}

export function Icon({ name, color, className, style }: Props) {
  let svg = icons[name]
  if (!svg) {
    console.warn('Missing icon', name)
    return null
  }
  if (color) {
    svg = svg.replace(/(fill|stroke)="(?!none)[^"]*"/g, `$1="${color}"`)
  }
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', flex: 'none', lineHeight: 0, ...style }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
