function login() {
  cy.contains('Connexion').click();

  cy.wait(2000); // Attendre que le bouton Google charge sinon ça reset les input avant de les remplir

  const emailInput = cy.get('#email');
  const passwordInput = cy.get('#password');

  emailInput.type('admin@admin.com', { delay: 100 });
  passwordInput.type('password', { delay: 100 });

  cy.contains('Se connecter').click();

  cy.contains('add').click();
}

function createHolidayPeriod() {
  const nameInput = cy.get('#name');
  const startInput = cy.get('#start');
  const endInput = cy.get('#end');
  const streetInput = cy.get('#street');
  const numInput = cy.get('#num');
  const zipInput = cy.get('#zip');
  const cityInput = cy.get('#city');
  const countryInput = cy.get('#country');

  nameInput.type('Test');
  startInput.type('2023-11-23')
  endInput.type('2023-11-24')
  streetInput.type('Test');
  numInput.type('1');
  zipInput.type('1000');
  cityInput.type('Test');
  countryInput.select('BE');

  cy.contains('Créer').click();
}

function deleteHolidayPeriod() {
  cy.contains('delete').click();

    cy.contains('Confirmer').should('be.visible').click();

    cy.wait(1000);
}

describe('Tests acceptation', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('should display number of users and number of users par country', () => {
    cy.get('h3').last().invoke('text').should('match', /[1-9]\d* utilisateurs nous font déjà confiance !/);

    const startInput = cy.get('#start').first();
    const endInput = cy.get('#end').first();

    startInput.type('2023-11-23')
    endInput.type('2023-11-24')

    cy.contains('Valider').click();

    const messageCard = cy.get('#message-card');
    messageCard.should('be.visible');
  })

  it('should login on correct credentials and reject on bad credentials', () => {
    cy.contains('Connexion').click();

    cy.wait(2000); // Attendre que le bouton Google charge sinon ça reset les input avant de les remplir

    const emailInput = cy.get('#email');
    const passwordInput = cy.get('#password');

    emailInput.type('admin@admin.com', { delay: 100 });
    passwordInput.type('wrongpassword', { delay: 100 });

    cy.contains('Se connecter').click();

    cy.get('#message-card').should('be.visible').contains('Email ou mot de passe incorect.');

    cy.wait(1000);

    passwordInput.clear();
    passwordInput.type('password', { delay: 100 });

    cy.contains('Se connecter').click();

    cy.contains('Mes vacances').should('be.visible');
  })

  it('should create a new Holiday Period and show then deletes it', () => {
    login();

    createHolidayPeriod();

    const testPeriod = cy.contains('Test');
    testPeriod.should('be.visible').click();

    cy.get('h1').first().invoke('text').should('match', /Test/);
    cy.contains('Test 1, 1000 Test BE').should('be.visible');

    deleteHolidayPeriod();

    cy.contains('Mes vacances').should('be.visible');
    cy.contains('Test').should('not.exist');
  })

  it('should create a new Holiday Period and add activity then deletes HolidayPeriod', () => {
    login();

    createHolidayPeriod();

    const testPeriod = cy.contains('Test');
    testPeriod.should('be.visible').click();

    cy.contains('Ajouter').should('be.visible').click();

    const nameInput = cy.get('#name');
    const streetInput = cy.get('#street');
    const numInput = cy.get('#num');
    const zipInput = cy.get('#zip');
    const cityInput = cy.get('#city');
    const countryInput = cy.get('#country');

    nameInput.type('Activite Test');
    streetInput.type('Rue Test');
    numInput.type('1');
    zipInput.type('1000');
    cityInput.type('Ville Test');
    countryInput.select('BE');

    cy.contains('Ajouter').click();

    cy.contains('Activite Test').should('be.visible');
    cy.contains('Rue Test 1, 1000 Ville Test').should('be.visible');

    deleteHolidayPeriod();
  })
})