import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Share } from '@capacitor/share'
import { App } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'

export const platform = Capacitor.getPlatform()
export const isNative = Capacitor.isNativePlatform()
export const isAndroid = platform === 'android'
export const isIOS = platform === 'ios'
export const isWeb = platform === 'web'

export async function initNative() {
  if (!isNative) return

  try {
    await SplashScreen.hide()
  } catch { /* splash already hidden */ }

  try {
    if (isAndroid) {
      await StatusBar.setStyle({ style: Style.Dark })
      await StatusBar.setBackgroundColor({ color: '#0f172a' })
    } else if (isIOS) {
      await StatusBar.setStyle({ style: Style.Dark })
    }
    await StatusBar.show()
  } catch { /* status bar not available */ }
}

export async function hideKeyboard() {
  if (isNative) {
    try { await Keyboard.hide() } catch { /* ignore */ }
  }
}

export async function lightHaptic() {
  if (isNative) {
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch { /* ignore */ }
  }
}

export async function mediumHaptic() {
  if (isNative) {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch { /* ignore */ }
  }
}

export async function successHaptic() {
  if (isNative) {
    try {
      await Haptics.notification({ type: NotificationType.Success })
    } catch { /* ignore */ }
  }
}

export async function shareText(title: string, text: string) {
  try {
    await Share.share({ title, text, dialogTitle: title })
  } catch { /* user cancelled or not available */ }
}

export function addBackButtonListener(callback: () => void) {
  if (!isNative) return () => {}
  let removed = false
  const handlerPromise = App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      callback()
    }
  })
  return async () => {
    if (removed) return
    removed = true
    ;(await handlerPromise).remove()
  }
}

export function addAppStateListener(onPause: () => void, onResume: () => void) {
  if (!isNative) return () => {}
  let removed = false
  const pausePromise = App.addListener('pause', onPause)
  const resumePromise = App.addListener('resume', onResume)

  return async () => {
    if (removed) return
    removed = true
    ;(await pausePromise).remove()
    ;(await resumePromise).remove()
  }
}
