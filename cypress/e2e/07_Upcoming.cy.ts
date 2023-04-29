import { should } from "chai"

describe('testFillBoard', () => {
	before(function() {
		cy.wrap('throwawayjimothy@gmail.com').as('email')
		cy.wrap('testpass').as('password')
	})

	it('Upcoming view works', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')


		cy.get('a[href="/app/upcoming"]').click()
		cy.url().should('include', 'upcoming')
		cy.get('.task-card').should('have.length', 1) // Only one task

		cy.get('.open-board').first().click()

		cy.url().should('include', 'board')

	})
})