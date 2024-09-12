import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders content', async () => {
    const blog = {
        title: 'Test title',
        author: 'Sergey',
        url: 'https://example.com/',
        likes: 0
    }

    const mockHandler = vi.fn()

    const { container } = render(<Blog blog={blog} />)
    screen.debug()

    const p = screen.getByText('Test title')
    const author = screen.getByText('Sergey')

    expect(p).toBeDefined()
    expect(author).toBeDefined()

    const divBlogInfo = container.querySelector('.blog-info')
    expect(divBlogInfo).toHaveStyle('display: none')

    const user = userEvent.setup()
    const button = screen.getByText('see more')
    button.onclick = mockHandler
    screen.debug(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(divBlogInfo).toHaveStyle('display: block')
})



