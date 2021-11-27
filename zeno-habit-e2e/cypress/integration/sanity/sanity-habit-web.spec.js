/// <reference types="cypress" />


describe('zeno habit sanity', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.task('log', 'CYPRESS_WEB_URL: ' + Cypress.env('WEB_URL') ?? 'https://habit-web-dev.markdavison.kiwi/')
      cy.task('log', 'CYPRESS_BFF_URL: ' + Cypress.env('BFF_URL') ?? 'https://habit-bff-dev.markdavison.kiwi/')
      cy.visit(Cypress.env('WEB_URL') ?? 'https://habit-web-dev.markdavison.kiwi/')
    })

    it('sanity go to web', () => {
      cy.contains('Zeno Habit')
      cy.contains('HOME')
    })

});