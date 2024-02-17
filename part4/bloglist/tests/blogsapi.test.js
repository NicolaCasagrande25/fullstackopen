const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogsObject = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogsObject.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('blogs api test', () => {
    describe('viewing blogs', () => {
        test('correct number of blogs returned', async () => {
            const response = await api.get('/api/blogs')
            expect(response.body).toHaveLength(helper.initialBlogs.length)
        })
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
        test('blog has id property', async () => {
            const response = await api.get('/api/blogs')
            expect(response.body[0].id).toBeDefined()
        })
    })
    describe('adding blogs', () => {
        test('a valid blog can be added', async () => {
            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsInDb = await helper.blogsInDb()

            const titles = blogsInDb.map(b => b.title)

            expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1)
            expect(titles).toContain('Type wars')
        })
        test('if the like property is missing in the request, it will default to 0', async () => {
            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            }

            await api
                .post('/api/blogs')
                .send(newBlog)

            const blogsInDb = await helper.blogsInDb()
            expect(blogsInDb[blogsInDb.length - 1].likes).toBe(0)
        })
        test('if the title is missing, backend responds with status code 400', async () => {
            const newBlog = {
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })
        test('if the url is missing, backend responds with status code 400', async () => {
            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                likes: 2,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })
    })
    describe('deleting blogs', () => {
        test('deleting blogs succeeds with code 204 if the blog exists', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

            const titles = blogsAtEnd.map(b => b.title)

            expect(titles).not.toContain(blogToDelete.title)
        })
        test('still returns 204 if the blog does not exist', async () => {
            const validNonExistingId = await helper.nonExistingId()
            
            const blogsAtStart = await helper.blogsInDb()

            await api
                .delete(`/api/blogs/${validNonExistingId}`)
                .expect(204)
            
            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        })
    })
    describe('updating blogs', () => {
        test('updating a blog succeeds with code 200 if the blog exists', async () => {
            const blogs = await helper.blogsInDb()
            const blogToUpdate = blogs[0]

            const updatedBlog = {
                title: blogToUpdate.title,
                author: blogToUpdate.author,
                url: blogToUpdate.url,
                likes: blogToUpdate.likes + 1
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)

            const blogsAfterUpdate = await helper.blogsInDb()

            expect(blogsAfterUpdate[0].likes).toBe(blogToUpdate.likes + 1)
        })
        test('updating a blog with invalid id returns 400', async () => {
            const validNonExistingId = await helper.nonExistingId()
            const blogToUpdate = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 23,
            }
            await api
                .put(`/api/blogs/${validNonExistingId}`)
                .send(blogToUpdate)
                .expect(400)
        })
    })
})

afterAll(async () => {
    await Blog.deleteMany({})
    mongoose.connection.close()
})