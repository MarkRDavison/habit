/// <reference types="cypress" />

const webUrl = Cypress.env('WEB_URL');
const username = Cypress.env('KC_USERNAME');
const password = Cypress.env('KC_PASSWORD');

const beforeEachFxn = () => {
  cy.visit(webUrl)
  cy.url().should('contain', 'auth.markdavison.kiwi')
  cy.get('#username', {log:true}).type(username, {force: true})
  cy.get('#password', {log:true}).type(password, {force: true, log: false})
  cy.get('#kc-login').click({force: true})    
  cy.visit(webUrl)
  cy.url().should('contain', webUrl)
};

const afterEachFxn = () => {  
  cy.visit(webUrl)
  cy.get('[data-testid="HomePage_LOGOUT"]').click();
};

const runTest = (name, callback) => {
  it(name, () => {
    beforeEachFxn();
    callback();
    afterEachFxn();
  });
}

describe('zeno habit sanity', () => {

  runTest('logged in', () => {
    cy.url().should('contain', webUrl)
    cy.contains('Zeno Habit')
  });

  runTest('can add habit', () => {
    cy.url().should('contain', webUrl)
    const habitName = 'A new auto habit';
    const habitQuestion = 'A new auto habit?????';

    cy.get('[data-testid="HomePage_AddHabit"]').click();
    
    cy.get('[data-testid="zeno-form-input-name"]').type(habitName);
    cy.get('[data-testid="zeno-form-input-question"]').type(habitQuestion);

    cy.get('[data-testid="zeno-form-input-submit"]').click();

    
    cy.contains('Overview')
    cy.contains('Calendar')
    cy.contains(habitName)
    cy.contains(habitQuestion)
  });

  runTest('visiting public', () => {
    cy.url().should('contain', webUrl)
    const publicUrl = new URL('public', webUrl);
    cy.visit(publicUrl.toString()) 
    cy.contains('zskdjfhlkjsdzfshjgkdblf')
  });

  runTest('visiting home', () => {
    cy.url().should('contain', webUrl)
    cy.contains(/Home/i)
  });

  runTest('shows that there are n habits', () => {
    cy.url().should('contain', webUrl)
    cy.visit(webUrl) 
    cy.contains('There are ')
  });
});