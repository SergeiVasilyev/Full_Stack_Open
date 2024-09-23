const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {
  beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      })
  
  test('front page can be opened', async ({ page }) => {

    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()

    // await page.getByRole('textbox').first().fill('user1')
    // await page.getByRole('textbox').last().fill('salainen')
    
    // const textboxes = await page.getByRole('textbox').all()
    // await textboxes[0].fill('user1')
    // await textboxes[1].fill('salainen')

    await page.getByTestId('username').fill('user1')
    await page.getByTestId('password').fill('salainen')

    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Superuser logged in')).toBeVisible()
  })
})




