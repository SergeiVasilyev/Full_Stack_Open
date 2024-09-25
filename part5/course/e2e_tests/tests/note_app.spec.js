const { test, describe, expect, beforeEach  } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset') //http://localhost:3001/api/testing/reset
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Superuser',
        username: 'user1',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })
  
  test('front page can be opened', async ({ page }) => {

    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('user can login with correct credentials', async ({ page }) => {
    await loginWith(page, 'user1', 'salainen')
    await expect(page.getByText('Superuser logged in')).toBeVisible()
  })

  //npm test -- -g "login fails with wrong password"
  test('login fails with wrong password', async ({ page }) => { // test.only
    await loginWith(page, 'mluukkai', 'wrong')
    
    // await expect(page.getByText('wrong credentials')).toBeVisible()
    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Superuser logged in')).not.toBeVisible()
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

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('user1')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Superuser logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'user1', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright')
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = await page.getByText('first note')
        const otherNoteElement = await otherNoteText.locator('..') // Get the parent of the element

        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })

  })
})




