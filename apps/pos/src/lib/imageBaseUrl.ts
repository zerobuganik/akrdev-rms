export function getImageBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  if (!apiUrl) return ''
  return apiUrl.replace(/\/api\/v\d\/?$/, '')
}
