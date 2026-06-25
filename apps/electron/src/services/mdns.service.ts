import mDNS from 'multicast-dns'

const hostname = process.env.COMPUTERNAME ?? process.env.HOSTNAME ?? 'pos-local'
const SERVICE_NAME = process.env.MDNS_SERVICE_NAME ?? 'akrdev-rms'
const LOCAL_PORT = Number(process.env.LOCAL_API_PORT) || 3001

let mdnsInstance: ReturnType<typeof mDNS> | null = null

export function startMDNS() {
  try {
    mdnsInstance = mDNS()

    mdnsInstance.on('query', (query) => {
      const questions = query.questions ?? []
      for (const q of questions) {
        if (q.name.includes(SERVICE_NAME) || q.name.includes('_http._tcp.local')) {
          mdnsInstance!.respond({
            answers: [
              {
                name: `${SERVICE_NAME}._http._tcp.local`,
                type: 'SRV',
                data: { port: LOCAL_PORT, target: hostname },
                ttl: 120,
              },
              {
                name: `${SERVICE_NAME}._http._tcp.local`,
                type: 'TXT',
                data: ['path=/', `version=1.0`],
                ttl: 120,
              },
            ],
            additionals: [
              {
                name: hostname,
                type: 'A',
                data: '127.0.0.1',
                ttl: 120,
              },
            ],
          })
        }
      }
    })

    mdnsInstance.on('response', (response) => {
      console.log('[mDNS] Response received:', response.answers?.length, 'answers')
    })

    console.log(`[mDNS] Broadcasting as ${SERVICE_NAME}._http._tcp.local on port ${LOCAL_PORT}`)
  } catch (err) {
    console.warn('[mDNS] Failed to start:', err)
    console.warn('[mDNS] Captain App will need manual IP entry for LAN connection')
  }
}

export function stopMDNS() {
  if (mdnsInstance) {
    mdnsInstance.destroy()
    mdnsInstance = null
  }
}
