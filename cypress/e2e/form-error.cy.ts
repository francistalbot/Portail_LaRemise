import '@testing-library/cypress/';
describe('Formulaire - Cas erreur', () => {
  it('Affiche les erreurs de validation sur soumission invalide', () => {
    cy.visit('http://localhost:3000/benevoles/nouveau');

    // Formulaire vide
    cy.findByRole('form').within(() => {
      cy.findByRole('button').contains(/enregistrer/i).click();
    });

    // Messages d'erreur attendus
    cy.findByRole('alert').contains(/le prénom doit contenir au moins 2 caractères/i).should('be.visible');
    cy.findByRole('alert').contains(/le nom doit contenir au moins 2 caractères/i).should('be.visible');
    cy.findByRole('alert').contains(/email invalide/i).should('be.visible');
    cy.findByRole('alert').contains(/le téléphone doit contenir au moins 10 caractères/i).should('be.visible');
  });
});
