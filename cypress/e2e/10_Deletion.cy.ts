describe('testFillBoard', () => {
	before(function() {
		cy.wrap('throwawayjimothy@gmail.com').as('email')
		cy.wrap('testpass').as('password')
	})

	it('can handle deleting modules, boards, lists and tasks', function() {
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

		// Delete empty list
		cy.get('.list .top-section .options-button').first().click()
		cy.get('.delete-button').click()
		cy.get('.confirm').click()

		// Delete the list too - this deletes any child tasks
		cy.get('.list .top-section .options-button').click()
		cy.get('.delete-button').click()
		cy.get('.confirm').click()

		cy.get('.list:not(.new-list)').should('have.length', 0) // no lists
		cy.get('.task-card').should('have.length', 0) // no tasks

		cy.visit('/app/dashboard')
		cy.get('.module-list .module-card:not(.new-module)').first().click()
		cy.get('.board-item:not(.new-board) button').first().click()
		cy.get('.delete-modal .delete-button').click()
		
		// If there are no boards, pass
		cy.get('.board-item:not(.new-board)').should('have.length', 0) // no boards

		cy.visit('/app/dashboard')
		cy.get('.module-list .module-card:not(.new-module) button').first().click()
		cy.get('.delete-modal .delete-button').click()

		// At this point, there are no modules.
		cy.get('.module-list .module-card:not(.new-module)').should('have.length', 0) // no modules

	})
})