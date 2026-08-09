function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

function shift(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + amount, g + amount, b + amount)
}

export type ThemeMode = 'dark' | 'light'

export interface ThemePreset {
  id: string
  name: string
  mode: ThemeMode
  accent: string
  background: string
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'godot-dark', name: 'Godot Dark', mode: 'dark', accent: '#478cbf', background: '#15171c' },
  { id: 'godot-light', name: 'Godot Light', mode: 'light', accent: '#478cbf', background: '#f6f8fb' },
  { id: 'midnight', name: 'Midnight', mode: 'dark', accent: '#6d8dff', background: '#0d111a' },
  { id: 'dracula', name: 'Dracula', mode: 'dark', accent: '#bd93f9', background: '#282a36' },
  { id: 'nord', name: 'Nord', mode: 'dark', accent: '#88c0d0', background: '#2e3440' },
]

export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((theme) => theme.id === id)
}

const DARK_NEUTRALS = {
  overlay: '#3a3c43',
  ink: '#f2f3f5',
  muted: '#949ba4',
}

export function applyTheme(
  accent: string,
  background: string,
  mode: ThemeMode = 'dark',
) {
  const root = document.documentElement
  const style = root.style

  root.classList.add('theme-transitioning')
  setTimeout(() => root.classList.remove('theme-transitioning'), 450)

  style.setProperty('--color-accent', accent)
  style.setProperty('--color-accent-dim', shift(accent, -45))
  style.setProperty('--color-accent-bright', shift(accent, 35))

  if (mode === 'light') {
    style.setProperty('--color-base', background)
    style.setProperty('--color-surface', shift(background, 15))
    style.setProperty('--color-raised', shift(background, -6))
    style.setProperty('--color-overlay', shift(background, -12))
    style.setProperty('--color-line', shift(background, -18))
    style.setProperty('--color-ink', '#1b1c1f')
    style.setProperty('--color-muted', '#6b7280')
  } else {
    style.setProperty('--color-base', background)
    style.setProperty('--color-surface', shift(background, 9))
    style.setProperty('--color-raised', shift(background, 18))
    style.setProperty('--color-overlay', DARK_NEUTRALS.overlay)
    style.setProperty('--color-line', shift(background, 28))
    style.setProperty('--color-ink', DARK_NEUTRALS.ink)
    style.setProperty('--color-muted', DARK_NEUTRALS.muted)
  }
}

export function applyThemePreset(themeId: string, fallback: {
  accent: string
  background: string
  mode: ThemeMode
}) {
  const preset = getThemePreset(themeId)
  const theme = preset ?? { id: 'custom', ...fallback }
  document.documentElement.dataset.theme = theme.id
  applyTheme(theme.accent, theme.background, theme.mode)
}
