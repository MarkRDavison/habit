/// <reference types="cypress" />


describe('zeno habit sanity', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit(Cypress.env('WEB_URL'))
    })

    it('sanity go to web', () => {
      cy.contains('Zeno Habit')
      cy.contains('HOME')
      cy.task('log', 'CYPRESS_WEB_URL: ' + Cypress.env('WEB_URL'))
      cy.task('log', 'CYPRESS_BFF_URL: ' + Cypress.env('BFF_URL'))
    })

});