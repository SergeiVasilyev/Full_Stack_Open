const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
    await request.post('/api/users', {
      data: {
        name: 'User 2',
        username: 'user2',
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
      loginWith(page, 'user1', 'salainen')
      await expect(page.getByText('Superuser logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, 'user2', 'salainen')
      await expect(page.getByText('Superuser logged-in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'user1', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      createBlog(page, 'Test blog', 'Test author', 'https://test.com')

      await expect(page.getByText('a new blog Test blog by Test author added')).toBeVisible()
      await expect(page.getByText('Test author see more')).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      createBlog(page, 'Test blog', 'Test author', 'https://test.com')
      await expect(page.getByText('a new blog Test blog by Test author added')).toBeVisible()

      createBlog(page, 'Test blog2', 'Test author2', 'https://test.com')
      await expect(page.getByText('a new blog Test blog2 by Test author2 added')).toBeVisible()

      await page.getByText('Test author2 see more').getByRole('button').click()
      await expect(page.locator('.blog').nth(1).getByText('likes 0')).toBeVisible()
      await expect(page.locator('.blog').nth(1).getByRole('button', { name: 'like' })).toBeVisible()

      await page.locator('.blog').nth(1).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog').nth(1).getByText('likes 1')).toBeVisible()
    })

    test('blog can be removed', async ({ page }) => {
      createBlog(page, 'Test blog', 'Test author', 'https://test.com')
      await expect(page.getByText('a new blog Test blog by Test author added')).toBeVisible()
      
      createBlog(page, 'Test blog2', 'Test author2', 'https://test.com')
      await expect(page.getByText('a new blog Test blog2 by Test author2 added')).toBeVisible()

      await page.getByText('Test author2 see more').getByRole('button').click()
     
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toContain('confirm')
        expect(dialog.message()).toContain('Are you sure you want to remove Test blog2 by Test author2?')
        await dialog.accept() // or dialog.dismiss()
      })
      const removeButton = page.getByText('Test author2').locator('..').getByRole('button', { name: 'remove' })
      await removeButton.click()
      
      await expect(removeButton).not.toBeVisible()
      await expect(page.getByText('Test author2 hide')).not.toBeVisible()
    })

      
    test('Check that only the user who created the blog can delete it', async ({ page }) => {
      createBlog(page, 'Test blog', 'Test author', 'https://test.com')

      await expect(page.getByText('a new blog Test blog by Test author added')).toBeVisible()
      await expect(page.getByText('Test author see more')).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      loginWith(page, 'user2', 'salainen')

      createBlog(page, 'Test blog2', 'Test author2', 'https://test.com')

      await expect(page.getByText('a new blog Test blog2 by Test author2 added')).toBeVisible()
      await expect(page.getByText('Test author2 see more')).toBeVisible()

      await page.getByText('Test author see more').getByRole('button').click()

      const removeButton = page.getByText('Test author').locator('..').getByRole('button', { name: 'remove' })
      await expect(removeButton).not.toBeVisible()
    })
  })

  describe('Ordered blogs', () => {
    test('Posts are ordered according to likes', async ({ page, request }) => {
      await request.post('/api/testing/reset')
      await request.post('/api/users', {
        data: {
          name: 'Superuser',
          username: 'user1',
          password: 'salainen'
        }
      })
      const loginResponse = await request.post('/api/login', {
        data: {
          username: 'user1',
          password: 'salainen'
        }
      })

      const loginResponseBody = await loginResponse.json()
      console.log('loginResponseBody', loginResponseBody)
      const token = loginResponseBody.token
      console.log('token', token)

      const response = await request.post('/api/blogs', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          title: 'Test blog',
          author: 'Test author',
          url: 'https://test.com',
          likes: 0
        }
      })
      const resJson = await response.json()
      console.log('response', resJson)
        
      const response2 = await request.post('/api/blogs', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          title: 'Test blog2',
          author: 'Test author2',
          url: 'https://test.com',
          likes: 5
        }
      })
      const resJson2 = await response2.json()
      console.log('response', resJson2)

      const response3 = await request.post('/api/blogs', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          title: 'Test blog3',
          author: 'Test author3',
          url: 'https://test.com',
          likes: 2
        }
      })
      const resJson3 = await response3.json()
      console.log('response', resJson3)

      await page.goto('/')

      await expect(page.locator('.blog').nth(0).getByText('Test author2')).toBeVisible()
      await expect(page.locator('.blog').nth(1).getByText('Test author3')).toBeVisible()
      await expect(page.locator('.blog').nth(2).getByText('Test author')).toBeVisible()

      await page.locator('.blog').nth(0).getByText('Test author2 see more').getByRole('button').click()
      await expect(page.locator('.blog').nth(0).getByText('Test author2').locator('..').getByText('likes 5')).toBeVisible()

      await page.locator('.blog').nth(1).getByText('Test author3 see more').getByRole('button').click()
      await expect(page.locator('.blog').nth(1).getByText('Test author3').locator('..').getByText('likes 2')).toBeVisible()

      await page.locator('.blog').nth(2).getByText('Test author see more').getByRole('button').click()
      await expect(page.locator('.blog').nth(2).getByText('Test author').locator('..').getByText('likes 0')).toBeVisible()
    })
  })
})