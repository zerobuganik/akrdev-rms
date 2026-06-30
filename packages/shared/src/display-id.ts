export type DisplayIdPrefix = 'D' | 'T'

export function generateDisplayId(prefix: DisplayIdPrefix, year: number, seq: number): string {
  const shortYear = year % 100
  return `${prefix}/${shortYear}/${seq}`
}
