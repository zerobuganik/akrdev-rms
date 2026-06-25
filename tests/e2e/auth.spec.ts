import { test, expect } from '@playwright/test'

test('login page loads', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('h1')).toContainText('AKRDev RMS')
  await expect(page.locator('input[type="tel"]')).toBeVisible()
})

test('phone entry enables continue button', async ({ page }) => {
  await page.goto('/login')
  const input = page.locator('input[type="tel"]')
  const button = page.locator('button:has-text("Continue")')

  await expect(button).toBeDisabled()

  await input.fill('9876543210')
  await expect(button).toBeEnabled()

  await button.click()
  await expect(page.locator('text=Enter your 4-digit PIN')).toBeVisible()
})

test('PIN pad displays dots as entered', async ({ page }) => {
  await page.goto('/login')
  await page.locator('input[type="tel"]').fill('9876543210')
  await page.locator('button:has-text("Continue")').click()

  await page.locator('button:has-text("1")').click()
  await page.locator('button:has-text("2")').click()

  const filledDots = page.locator('.rounded-full.border-primary.bg-primary')
  await expect(filledDots).toHaveCount(2)
})

test('protected routes redirect to login when unauthenticated', async ({ page }) => {
  await page.goto('/tables')
  await expect(page).toHaveURL(/\/login/)
})

test('back button returns to phone step', async ({ page }) => {
  await page.goto('/login')
  await page.locator('input[type="tel"]').fill('9876543210')
  await page.locator('button:has-text("Continue")').click()
  await page.locator('button:has-text("Back")').click()
  await expect(page.locator('input[type="tel"]')).toBeVisible()
})
