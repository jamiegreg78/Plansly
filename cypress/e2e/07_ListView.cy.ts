describe('testFillBoard', () => {
	before(function() {
		cy.wrap('throwawayjimothy@gmail.com').as('email')
		cy.wrap('testpass').as('password')
	})

	it('can fill board with cards', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')

		cy.get('.module-list .module-card:not(.new-module)').first().click()
		cy.get('.board-item:not(.new-board)').first().click()
		cy.get('.link-container a').eq(2).click()

		cy.url().should('include', 'list')
		cy.get('.task-card').should('have.length', 2) 

	})
})