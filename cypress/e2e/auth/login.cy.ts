
describe('testLogin', () => {
	before(function() {
		cy.wrap('jamiegreg78@gmail.com').as('email')
		cy.wrap('testpass').as('password')
		cy.wrap('wrongpass').as('wrongPassword')
	})

	it('Can submit login information', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')
	})
	
	it('Can reject user if data is wrong', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.wrongPassword).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/auth/login')
	})
})