/*
 * Date/number formatting with explicit locale + time zone, so the server
 * render and the browser hydrate to identical strings.
 */

export const fmtNumber = (n: number) => new Intl.NumberFormat('en-IN').format(n)

export function fmtDate(iso: string, timeZone = 'Asia/Kolkata', opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone,
    ...opts,
  }).format(new Date(iso))
}

export function fmtRange(start: string, end: string | null, timeZone?: string) {
  const s = fmtDate(start, timeZone, { day: 'numeric', month: 'short' })
  if (!end) return `${s} – now`
  const sameYear = new Date(start).getUTCFullYear() === new Date(end).getUTCFullYear()
  return `${sameYear ? s : fmtDate(start, timeZone)} – ${fmtDate(end, timeZone)}`
}

export function tripDays(start: string, end: string | null) {
  if (!end) return null
  return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
}

const WEATHER: Record<string, string> = {
  'clear-day': 'Clear',
  'clear-night': 'Clear night',
  'partly-cloudy-day': 'Partly cloudy',
  'partly-cloudy-night': 'Partly cloudy',
  cloudy: 'Cloudy',
  rain: 'Rain',
  snow: 'Snow',
  sleet: 'Sleet',
  wind: 'Windy',
  fog: 'Fog',
}
export const fmtWeather = (c: string) => WEATHER[c] ?? c.replace(/-/g, ' ')
