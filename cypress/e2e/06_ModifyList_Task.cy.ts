describe('testFillBoard', () => {
	before(function() {
		cy.wrap('throwawayjimothy@gmail.com').as('email')
		cy.wrap('testpass').as('password')
	})

	it('Can handle modifying lists and tasks', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')

		cy.get('.module-list .module-card:not(.new-module)').first().click()
		cy.get('.board-item:not(.new-board)').first().click()

		// Modify List
		cy.get('.list .top-section .options-button').first().click()
		cy.get('#newNameInput').clear().type('Modified List').type('{enter}')
		cy.get('#Description').clear().type('Modified Description').type('{enter}')
		cy.get('input[type="number"]').clear().type('4').type('{enter}')
		cy.get('.overview .button.primary').click()

		// If the wip limit is present, the changes have been saved
		cy.get('.wip-limit').should('exist')

		// Modify Task
		cy.get('.open-context-menu').eq(1).click()
		cy.get('#newNameInput').clear().type('Modified Task').type('{enter}')
		cy.get('#Description').clear().type('Modified Description').type('{enter}')
		cy.get('input[type="datetime-local"]').eq(0).clear().type('2023-04-22T19:43').trigger('change')
		cy.get('input[type="datetime-local"]').eq(1).clear().type('2023-04-28T19:43').trigger('change')
		cy.get('.overview .button.primary').click()

		// If the date is present, the changes have been saved
		cy.get('.date').should('contain', ' 22/4/2023 - 28/4/2023 ')
	})
})