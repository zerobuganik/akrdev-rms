export function safeParseJSON<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function safeParseZod<T>(raw: unknown, schema: { safeParse: (data: unknown) => { success: boolean; data?: T } }, fallback: T): T {
  const result = schema.safeParse(raw)
  return result.success ? (result.data as T) : fallback
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { fn(...args); timer = null }, ms)
  }
}

export function truncate(str: string, maxLength: number): string {
  if (maxLength < 1) return str
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '\u2026'
}
