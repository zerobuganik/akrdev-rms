import { test, expect } from '@playwright/test'

test('tables page requires authentication', async ({ page }) => {
  await page.goto('/tables')
  await expect(page).toHaveURL(/\/login/)
})

test('unauthenticated users are redirected to login', async ({ page }) => {
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/login/)
})

test('login page renders the app title', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('h1')).toContainText('AKRDev RMS')
})

test('404 redirects to tables', async ({ page }) => {
  await page.goto('/non-existent')
  await expect(page).toHaveURL(/\/login/)
})
