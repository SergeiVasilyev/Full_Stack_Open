const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  // describe('Login', () => {
  //   test('succeeds with correct credentials', async ({ page }) => {
  //     // ...
        // await page.locator('input[name="Username"]').fill('User1');
        // await page.locator('input[name="Password"]').fill('salainen');
        // await page.getByRole('button', { name: 'login' }).click();
        // await expect(page.getByText('Superuser logged in')).toBeVisible()
  //   })

  //   test('fails with wrong credentials', async ({ page }) => {
  //     // ...
  //   })
  // })
})