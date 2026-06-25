import { contextBridge, ipcRenderer } from 'electron'

const ALLOWED_INVOKE_CHANNELS = [
  // Sync
  'get-sync-status',
  'force-sync',
  'queue-sync-action',
  // Print
  'print:kot',
  'print:bill',
  'print:reprint-bill',
  'print:test',
  'print:get-printers',
  'print:save-printer',
  'print:delete-printer',
  'print:get-stats',
  'print:get-history',
  'print:discover-system',
]

const ALLOWED_ON_CHANNELS = [
  'table:update',
  'order:status-change',
  'cart:lock',
  'cart:unlock',
  'sync:status-change',
]

const electronAPI = {
  invoke: (channel: string, ...args: unknown[]) => {
    if (!ALLOWED_INVOKE_CHANNELS.includes(channel)) {
      throw new Error(`IPC channel "${channel}" is not allowed`)
    }
    return ipcRenderer.invoke(channel, ...args)
  },
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    if (!ALLOWED_ON_CHANNELS.includes(channel)) {
      throw new Error(`IPC on channel "${channel}" is not allowed`)
    }
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args)
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  removeAllListeners: (channel: string) => {
    if (!ALLOWED_ON_CHANNELS.includes(channel)) {
      throw new Error(`IPC channel "${channel}" is not allowed`)
    }
    ipcRenderer.removeAllListeners(channel)
  },
}

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: electronAPI,
})
