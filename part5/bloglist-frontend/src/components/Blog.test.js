import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'My first blog',
    author: 'Nicola Casagrande',
    url: 'www.myfirstblog.com',
    creator: {
      username: 'nicolacasagrande',
      name: 'Nicola Casagrande',
      id: 'dnwbi47rtg934ubf293ufw'
    },
    likes: 5
  }

  const user = {
    username: 'nicolacasagrande',
    name: 'Nicola Casagrande',
    token: 'cjwibefu9234fu32odo1jnfco1ejn2i3uf1h82u1fbe1'
  }

  const mockLikeBlog = jest.fn()
  const mockRemoveBlog = jest.fn()

  let container

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={user} likeBlog={mockLikeBlog} removeBlog={mockRemoveBlog}/>
    ).container
  })

  test('blog renders title and author by default', () => {
    const blogDiv = container.querySelector('.blog')
    const titleAuthorDiv = blogDiv.querySelector('.title-author-div')

    expect(titleAuthorDiv).toHaveTextContent('My first blog')
    expect(titleAuthorDiv).toHaveTextContent('Nicola Casagrande')
    expect(titleAuthorDiv).not.toHaveStyle('display: none')
  })

  test('blog does not render url and likes by default', () => {
    const blogDiv = container.querySelector('.blog')
    const urlAndLikesDiv = blogDiv.querySelector('.url-likes-div')

    expect(urlAndLikesDiv).toHaveTextContent('www.myfirstblog.com')
    expect(urlAndLikesDiv).toHaveTextContent('likes 5')
    expect(urlAndLikesDiv).toHaveStyle('display: none')
  })

  test('blog renders url and likes when the view button is clicked', async () => {
    const user = userEvent.setup()
    const blogDiv = container.querySelector('.blog')
    const urlAndLikesDiv = blogDiv.querySelector('.url-likes-div')

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(urlAndLikesDiv).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the corresponding event handler is called twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeBlog.mock.calls).toHaveLength(2)
  })
})