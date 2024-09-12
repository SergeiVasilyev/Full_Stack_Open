import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


const mockHandler = vi.fn()
let container

beforeEach(() => {
    const blog = {
        title: 'Test title',
        author: 'Sergey',
        url: 'https://example.com/',
        likes: 0
    }

    container = render(<Blog blog={blog} />).container

})

test('Rendering title and author', async () => {
    screen.debug()

    const p = screen.getByText('Test title')
    const author = screen.getByText('Sergey')

    expect(p).toBeDefined()
    expect(author).toBeDefined()

})


test("url and likes don't render before click 'see more' button", async () => {
    const divBlogInfo = container.querySelector('.blog-info')
    expect(divBlogInfo).toHaveStyle('display: none')
})

test('Clicking "see more" button calls event handler once and renders url and likes', async () => {
    const divBlogInfo = container.querySelector('.blog-info')
    
    const user = userEvent.setup()
    const button = screen.getByText('see more')
    button.onclick = mockHandler
    screen.debug(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(divBlogInfo).toHaveStyle('display: block')

    const url = screen.getByText('https://example.com/')
    expect(url).toBeDefined()

    const likes = screen.getByText('likes 0')
    expect(likes).toBeDefined()
})









