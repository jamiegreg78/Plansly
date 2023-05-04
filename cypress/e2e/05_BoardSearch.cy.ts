describe('testFillBoard', () => {
	before(function() {
		cy.wrap('jag73@aber.ac.uk').as('email')
		cy.wrap('testpass').as('password')
	})

	it('Can search for a task within a board', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')

		cy.get('.module-list .module-card:not(.new-module)').first().click()
		cy.get('.board-item:not(.new-board)').first().click()

	
		// Search for a task
		cy.get('#BoardSearch').type('another')
		cy.get('.task-info').first().click()


		// Check that the task is the one we searched for
		cy.get('.overview .task-name').invoke('val').should('eq', 'Another Test Card')
	})
})