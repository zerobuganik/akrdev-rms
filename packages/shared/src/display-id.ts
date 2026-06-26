export type DisplayIdPrefix = 'D' | 'T'

export function generateDisplayId(prefix: DisplayIdPrefix, year: number, seq: number): string {
  const shortYear = String(year).slice(-2)
  return `${prefix}/${shortYear}${String(seq).padStart(4, '0')}`
}
