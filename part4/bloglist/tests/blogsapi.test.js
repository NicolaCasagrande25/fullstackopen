const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let validToken;

beforeAll(async () => {
    await User.deleteMany({})

    const newUser = {
        username: "root",
        password: "password"
    }

    await api
        .post('/api/users')
        .send(newUser)

    const loginResponse = await api.post('/api/login').send({username: "root", password: "password"})
    validToken = loginResponse.body.token
})

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
                .set('Authorization', `Bearer ${validToken}`)
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
                .set('Authorization', `Bearer ${validToken}`)
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
                .set('Authorization', `Bearer ${validToken}`)
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
                .set('Authorization', `Bearer ${validToken}`)
                .send(newBlog)
                .expect(400)
        })
        test('if the token is missing, backend responds with status code 401', async () => {
            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
        })
    })
    describe('deleting blogs', () => {
        beforeEach(async () => {
            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${validToken}`)
                .send(newBlog)
        })
        test('deleting blogs succeeds with code 204 if the blog exists', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${validToken}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

            const titles = blogsAtEnd.map(b => b.title)

            expect(titles).not.toContain(blogToDelete.title)
        })
        test('returns 404 if the blog does not exist', async () => {
            const validNonExistingId = await helper.nonExistingId()

            const blogsAtStart = await helper.blogsInDb()

            await api
                .delete(`/api/blogs/${validNonExistingId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .expect(404)

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