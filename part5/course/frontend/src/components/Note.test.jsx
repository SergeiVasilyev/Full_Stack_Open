import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // Rendering a component 1
  // render(<Note note={note} />)
  // screen.debug()
  // const element = screen.getByText('Component testing is done with react-testing-library')
  // screen.debug(element) // Show element in console
  // expect(element).toBeDefined()

  // Rendering a component 2
  // const { container } = render(<Note note={note} />)
  // screen.debug() // Show code of component
  // const div = container.querySelector('.note')
  // expect(div).toHaveTextContent(
  //   'Component testing is done with react-testing-library'
  // )

  const mockHandler = vi.fn()
  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('Make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)


})