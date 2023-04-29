describe('testCreateBoard', () => {
	before(function() {
		cy.wrap('throwawayjimothy@gmail.com').as('email')
		cy.wrap('testpass').as('password')
	})

	it('can create new board', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')

		cy.get('.module-list .module-card:not(.new-module)').first().click()

		// open new board form
		cy.get('.button.primary').click()

		// Should fail to create a board
		cy.get('#Description').type('Test Description').trigger('change')
		cy.get('#newBoardForm .button.primary').click()

		cy.url().should('include', 'module')

		// Should succeed in creating a board
		cy.get('.color-option').first().click()
		cy.get('#Title').type('Test Board').trigger('change')
		cy.get('#newBoardForm .button.primary').click()

		cy.get('.board-item:not(.new-board)').first().click()

		cy.url().should('include', 'board')
	})
})