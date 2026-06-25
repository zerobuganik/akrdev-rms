export type ApiSource = 'local' | 'cloud'

interface DiscoveredEndpoint {
  url: string
  source: ApiSource
}

const STORAGE_KEY = 'akrdev-rms-config'

function getStoredEndpoints(): DiscoveredEndpoint[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function storeEndpoint(endpoint: DiscoveredEndpoint) {
  const existing = getStoredEndpoints()
  const filtered = existing.filter((e) => e.url !== endpoint.url)
  filtered.unshift(endpoint)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 5)))
}

export async function discoverEndpoints(): Promise<DiscoveredEndpoint[]> {
  const results: DiscoveredEndpoint[] = []

  try {
    const mdnsResult = await discoverMDNS()
    if (mdnsResult) results.push(mdnsResult)
  } catch {
    // mDNS not available in browser, skip
  }

  const cached = getStoredEndpoints()
  console.log('[network-discovery] Cached endpoints from localStorage:', cached)
  results.push(...cached)

  const savedCloudUrl = localStorage.getItem('akrdev-cloud-url')
  if (savedCloudUrl) {
    results.push({ url: savedCloudUrl, source: 'cloud' })
  }

  console.log('[network-discovery] Final discovered endpoints:', results)
  return results
}

async function discoverMDNS(): Promise<DiscoveredEndpoint | null> {
  return null
}

export async function tryConnect(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/api/v1/health`, {
      signal: AbortSignal.timeout(3000),
    })
    if (response.ok) {
      const data = await response.json()
      storeEndpoint({ url, source: data.type === 'local-pos' ? 'local' : 'cloud' })
      return true
    }
  } catch {
    // unreachable
  }
  return false
}

export function saveCloudUrl(url: string) {
  localStorage.setItem('akrdev-cloud-url', url)
  storeEndpoint({ url, source: 'cloud' })
}

export function savePOSUrl(url: string) {
  localStorage.setItem('akrdev-pos-url', url)
  storeEndpoint({ url, source: 'local' })
}
