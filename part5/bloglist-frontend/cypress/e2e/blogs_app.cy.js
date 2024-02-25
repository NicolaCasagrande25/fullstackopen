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
  })
})