import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

test('<CreateBlog /> calls the received event handler with the right details', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<CreateBlog createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('Title')
  const inputAuthor = screen.getByPlaceholderText('Author')
  const inputUrl = screen.getByPlaceholderText('Url')
  const submitButton = screen.getByText('create')

  await user.type(inputTitle, 'My first blog')
  await user.type(inputAuthor, 'Nicola Casagrande')
  await user.type(inputUrl, 'www.myfirstblog.com')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('My first blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Nicola Casagrande')
  expect(createBlog.mock.calls[0][0].url).toBe('www.myfirstblog.com')
})