import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const TOKEN_FILE = '_auth_tokens.json'

function getTokenPath(): string {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, TOKEN_FILE)
}

function readTokens(): Record<string, string> {
  try {
    const tokenPath = getTokenPath()
    if (fs.existsSync(tokenPath)) {
      const raw = fs.readFileSync(tokenPath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch {
    // Corrupted file — start fresh
  }
  return {}
}

function writeTokens(tokens: Record<string, string>): void {
  try {
    fs.writeFileSync(getTokenPath(), JSON.stringify(tokens), 'utf-8')
  } catch {
    // Fail silently — tokens will be refreshed on next auth
  }
}

export function setAccessToken(token: string): void {
  const tokens = readTokens()
  tokens.accessToken = token
  writeTokens(tokens)
}

export function setRefreshToken(token: string): void {
  const tokens = readTokens()
  tokens.refreshToken = token
  writeTokens(tokens)
}

export function getAccessToken(): string | null {
  return readTokens().accessToken ?? null
}

export function getRefreshToken(): string | null {
  return readTokens().refreshToken ?? null
}

export function setCloudAccessToken(token: string): void {
  const tokens = readTokens()
  tokens.cloudAccessToken = token
  writeTokens(tokens)
}

export function getCloudAccessToken(): string | null {
  return readTokens().cloudAccessToken ?? null
}

export function clearTokens(): void {
  try {
    const tokenPath = getTokenPath()
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath)
    }
  } catch {
    // Already gone — nothing to do
  }
}
