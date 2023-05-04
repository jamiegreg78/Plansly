describe('testFillBoard', () => {
	before(function() {
		cy.wrap('jag73@aber.ac.uk').as('email')
		cy.wrap('testpass').as('password')
	})

	it('Should handle task dependencies', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')

		cy.get('.module-list .module-card:not(.new-module)').first().click()
		cy.get('.board-item:not(.new-board)').first().click()

		cy.get('.open-context-menu').first().click()

		cy.get('.add-dependency-toggle').click()
		cy.get('#DependencySearch').type('mod')
		cy.get('.result').first().click()

		cy.get('.overview .button.primary').click()

		// If the locked class is present, then the dependency was added
		cy.get('.task-card').eq(1).get('.completed-status').should('have.class', 'locked')
		
	})
})