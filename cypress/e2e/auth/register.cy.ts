/// <reference types="cypress-mailslurp" />

describe('testRegistration', () => {
	// Create the email account before testing
	before(function() {
		return cy.mailslurp()
			.then(mailslurp => mailslurp.createInbox())
			.then(inbox => {
				cy.wrap(inbox.id).as('inboxId')
				cy.wrap(inbox.emailAddress).as('emailAddress')
				cy.wrap('testpass').as('password')
			})
	})
		
	it('Can submit a registration', function() {
		cy.visit('/auth/register')
		cy.get('#Email').type(this.emailAddress)
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('#ConfirmPassword').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/auth/verify')
	})

	// Unforunately, testing OTP is not possible with Cypress due to the lack of support for multiple tabs.
})