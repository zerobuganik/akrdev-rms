declare module 'pngjs' {
  import { EventEmitter } from 'events'

  interface PNGColorType {
    readonly COST_TRANSPARENT: 0
  }

  interface PNGMetadata {
    width: number
    height: number
    depth: number
    interlace: boolean
    palette: boolean
    color: boolean
    alpha: boolean
    bpp: number
    colorType: PNGColorType
  }

  export interface PNGOptions {
    width?: number
    height?: number
    fill?: boolean
    inputHasAlpha?: boolean
    deflateChunkSize?: number
    filterType?: number | number[]
  }

  export class PNG extends EventEmitter {
    static sync: {
      read(buffer: Buffer, options?: PNGOptions): PNG
      write(png: PNG, options?: PNGOptions): Buffer
    }

    constructor(options?: PNGOptions)

    width: number
    height: number
    data: Buffer
    gamma: number

    pack(): NodeJS.ReadableStream
    parse(data: Buffer, callback?: (error: Error | null, data: PNG) => void): void
  }

  export interface PNGSyncOptions {
    inputHasAlpha?: boolean
    deflateChunkSize?: number
    filterType?: number | number[]
  }
}
