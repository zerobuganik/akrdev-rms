/// <reference types="vite/client" />

interface ElectronAPI {
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  on: (channel: string, callback: (...args: unknown[]) => void) => () => void
  removeAllListeners: (channel: string) => void
}

interface Window {
  electron?: {
    ipcRenderer: ElectronAPI
  }
}
