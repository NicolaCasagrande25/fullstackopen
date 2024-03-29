const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('creator', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }

  const blog = new Blog(request.body)

  if (!blog.likes) {
    blog.likes = 0
  }

  blog.creator = user._id

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('creator', { username: 1, name: 1, id: 1 })

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }

  if (!blogToDelete) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blogToDelete.creator.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'cannot delete a blog that you did not create' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    creator: body.creator,
    url: body.url,
    likes: body.likes
  }
  console.log(blog)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('creator', { username: 1, name: 1, id: 1 })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(400).end()
  }
})

module.exports = blogsRouter