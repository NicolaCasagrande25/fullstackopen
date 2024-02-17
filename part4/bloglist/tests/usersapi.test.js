const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe("users api test", () => {
  describe('when there is in itially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(result.body.error).toContain('expected `username` to be unique')
  
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and error message when username is not provided', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')
  
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and error message when username is too short', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'ro',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(result.body.error).toContain(`User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3).`)
  
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and error message when password is not provided', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(result.body.error).toContain('Password is required.')
  
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and error message when password is too short', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        password: 'sa',
        name: 'Superuser',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(result.body.error).toContain('Password is too short, it should be at least 3 characters long.')
  
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})