declare module 'multicast-dns' {
  import type { RemoteInfo } from 'dgram'

  interface Question {
    name: string
    type: string
  }

  interface Answer {
    name: string
    type: string
    ttl: number
    data?: unknown | { port: number; target: string }
    class?: number
    flush?: boolean
  }

  interface QueryPacket {
    type: 'query'
    questions?: Question[]
    answers?: Answer[]
    additionals?: Answer[]
  }

  interface ResponsePacket {
    type: 'response'
    questions?: Question[]
    answers?: Answer[]
    additionals?: Answer[]
  }

  interface MDNSSocketOptions {
    multicast?: boolean
    interface?: string
    port?: number
    ip?: string
    ttl?: number
    loopback?: boolean
    reuseAddr?: boolean
  }

  type MDNS = {
    on(event: 'query', listener: (query: QueryPacket, rinfo?: RemoteInfo) => void): void
    on(event: 'response', listener: (response: ResponsePacket, rinfo?: RemoteInfo) => void): void
    respond(response: { answers?: Answer[]; additionals?: Answer[] }, callback?: () => void): void
    query(query: { questions?: Question[] }, callback?: () => void): void
    destroy(): void
  }

  function mDNS(options?: MDNSSocketOptions): MDNS

  export = mDNS
}
