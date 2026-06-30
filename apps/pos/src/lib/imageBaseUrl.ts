export function getImageBaseUrl(): string {
  return ''
}

export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  if (!apiUrl) return path
  return apiUrl.replace(/\/api\/v\d\/?$/, '') + path
}
