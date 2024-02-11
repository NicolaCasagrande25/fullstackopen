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

afterAll(() => {
    mongoose.connection.close()
})