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

		// Create first list
		cy.get('.new-list button').click()
		cy.get('#newListInput').type('Test List').type('{enter}')
		
		// Create Second List
		cy.get('.new-list button').click()
		cy.get('#newListInput').type('Another Test List').type('{enter}')
	

		// Create first card
		cy.get('.new-task-button').first().click()
		cy.get('#newTaskInput').type('Test Card').type('{enter}')

		// Create second card
		cy.get('.new-task-button').eq(1).click()
		cy.get('#newTaskInput').type('Another Test Card').type('{enter}')

		cy.get('.list:not(.new-list)').should('have.length', 2) // two lists
		cy.get('.task-card').should('have.length', 2) // two tasks
	})
})