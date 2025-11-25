import '@testing-library/cypress/';
describe('Parcours principal - Accueil vers succès', () => {
  it('Accueil → Formulaire → Succès', () => {
    cy.visit('http://localhost:3000');

    // Accueil visible
    cy.findByRole('heading', { name: /accueil/i }).should('be.visible');
    cy.findByRole('link', { name: /bénévoles/i }).click();

    // Page bénévoles
    cy.findByRole('heading', { name: /bénévoles/i }).should('be.visible');
    cy.findByRole('link', { name: /ajouter un bénévole/i }).click();

    // Formulaire
    cy.findByRole('form').within(() => {
      cy.findByLabelText(/prénom/i).type('Jean');
      cy.findByLabelText(/nom/i).type('Dupont');
      cy.findByLabelText(/email/i).type('jean.dupont@example.com');
      cy.findByLabelText(/téléphone/i).type('1234567890');
      cy.findByRole('button', { name: /enregistrer/i }).click();
    });

    // Succès
    cy.findByRole('alert', { name: /bénévole enregistré avec succès/i }).should('be.visible');
  });
});
