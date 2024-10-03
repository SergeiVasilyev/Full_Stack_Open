const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'user1',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('user1');
      await page.locator('input[name="Password"]').fill('salainen');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Superuser logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('user2');
      await page.locator('input[name="Password"]').fill('salainen');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Superuser logged-in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('user1');
      await page.locator('input[name="Password"]').fill('salainen');
      await page.getByRole('button', { name: 'login' }).click();
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Test author')
      await page.locator('input[name="Url"]').fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()

      await expect(page.getByText('a new blog Test blog by Test author added')).toBeVisible()
      await expect(page.getByText('Test author see more')).toBeVisible()

      // await page.getByText('see more').click()
      // await expect(page.getByText('https://test.com')).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Test author')
      await page.locator('input[name="Url"]').fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()

      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.locator('input[name="Title"]').fill('Test blog2')
      await page.locator('input[name="Author"]').fill('Test author2')
      await page.locator('input[name="Url"]').fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()

      await page.getByText('Test author2 see more').getByRole('button').click()
      await expect(page.getByText('Test author2').locator('..').nth(1).getByText('likes 0')).toBeVisible()
      await expect(page.getByText('Test author2').locator('..').getByRole('button', { name: 'like' })).toBeVisible()

      await page.getByText('Test author2').locator('..').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Test author2').locator('..').getByText('likes 1')).toBeVisible()
    })

    test('blog can be removed', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Test author')
      await page.locator('input[name="Url"]').fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()

      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.locator('input[name="Title"]').fill('Test blog2')
      await page.locator('input[name="Author"]').fill('Test author2')
      await page.locator('input[name="Url"]').fill('https://test.com')
      await page.getByRole('button', { name: 'Create' }).click()

      await page.getByText('Test author2 see more').getByRole('button').click()
     
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toContain('confirm')
        expect(dialog.message()).toContain('Are you sure you want to remove blog Test blog2 by Test author2?')
        await dialog.accept() // or dialog.dismiss()
      })
      const removeButton = page.getByText('Test author2').locator('..').getByRole('button', { name: 'remove' })
      await removeButton.click()
      
      await expect(removeButton).not.toBeVisible()
      await expect(page.getByText('Test author2 hide')).not.toBeVisible()
    })


  })
})