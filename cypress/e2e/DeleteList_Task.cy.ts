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

		// delete individual task first
		cy.get('.task-card .open-context-menu').first().click()
		cy.get('.delete-button').click()
		cy.get('.confirm').click()

		// Delete the list too - this deletes any child tasks
		cy.get('.list .top-section .options-button').eq(1).click()
		cy.get('.delete-button').click()
		cy.get('.confirm').click()
	})
})