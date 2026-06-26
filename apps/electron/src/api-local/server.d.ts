import type { Server } from 'http'

export declare function createLocalApiServer(): Server
export declare function setSystemPrinterResolver(fn: () => Array<{ name: string; isDefault: boolean }>): void
