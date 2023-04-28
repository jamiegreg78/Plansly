describe('testCreateModule', () => {
	before(function() {
		cy.wrap('throwawayjimothy@gmail.com').as('email')
		cy.wrap('testpass').as('password')
	})

	it('can create new module', function() {
		cy.visit('/auth/login')
		cy.get('#Email').type(this.email).trigger('change')
		cy.get('#Password').type(this.password).trigger('change')
		cy.get('.button.primary').click()

		cy.url().should('eq', 'http://localhost:4173/app/dashboard')

		cy.get('.button.primary').click()

		// should fail to create module
		cy.get('#Description').type('Test Description').trigger('change')
		cy.get('#newModuleForm .button.primary').click()

		cy.url().should('include', 'dashboard')

		// should succeed in creating module
		cy.get('#Title').type('Test Module').trigger('change')
		cy.get('#newModuleForm .button.primary').click()

		cy.get('.module-list .module-card:not(.new-module)').first().click()
		cy.url().should('include', 'module')
	})
})