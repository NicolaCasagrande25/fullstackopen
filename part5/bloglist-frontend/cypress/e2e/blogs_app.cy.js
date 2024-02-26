describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Mario Rossi',
      username: 'mariorossi',
      password: 'password'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.get('#username').should('exist').and('be.visible')
    cy.get('#password').should('exist').and('be.visible')
    cy.get('#login-button').should('exist').and('be.visible')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mariorossi')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Mario Rossi logged in')
      cy.get('.success').contains('Mario Rossi logged in successfully')
      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mariorossi')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'Mario Rossi logged in')
      cy.get('.error').contains('wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mariorossi', password: 'password' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('A new blog')
      cy.get('#author').type('Mario Rossi')
      cy.get('#url').type('www.newblog.com')
      cy.get('#create-button').click()
      cy.contains('A new blog Mario Rossi')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title: 'A new blog', url: 'www.newblog.com', author: 'Mario Rossi' })
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted', function() {
      cy.createBlog({ title: 'A new blog', url: 'www.newblog.com', author: 'Mario Rossi' })
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'A new blog Mario Rossi')
    })

    it('Only the creator can see the remove blog button', function() {
      cy.createBlog({ title: 'A new blog', url: 'www.newblog.com', author: 'Mario Rossi' })
      cy.contains('logout').click()
      const user = {
        name: 'Luigi Verdi',
        username: 'luigiverdi',
        password: 'password'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
      cy.login({ username: 'luigiverdi', password: 'password' })
      cy.contains('view').click()
      cy.get('.remove').should('not.exist')
    })

    it('Blogs are ordered by likes', async function() {
      cy.createBlogWithLikes({ title: 'The second blog', url: 'www.secondblog.com', author: 'Mario Rossi', likes: 3 })
      cy.createBlogWithLikes({ title: 'The first blog', url: 'www.firstblog.com', author: 'Mario Rossi', likes: 5 })
      cy.createBlogWithLikes({ title: 'The last blog', url: 'www.lastblog.com', author: 'Mario Rossi', likes: 1 })

      cy.get('.blog').eq(0).should('contain', 'The first blog')
      cy.get('.blog').eq(1).should('contain', 'The second blog')
      cy.get('.blog').eq(2).should('contain', 'The last blog')

      cy.get('.blog').eq(2).contains('view').click()
      await cy.get('.blog').eq(2).contains('like').click()
      await cy.get('.blog').eq(2).contains('like').click()
      await cy.get('.blog').eq(2).contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'The first blog')
      cy.get('.blog').eq(1).should('contain', 'The last blog')
      cy.get('.blog').eq(2).should('contain', 'The second blog')
    })
  })
})