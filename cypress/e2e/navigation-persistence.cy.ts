import '@testing-library/cypress/';

describe('Navigation multi-pages - Persistance état global', () => {
  it('Ajoute un bénévole, navigue, et vérifie la persistance', () => {
    cy.visit('http://localhost:3000/benevoles/nouveau');

    // Remplir et soumettre le formulaire
    cy.findByLabelText(/prénom/i).type('Alice');
    cy.findByLabelText(/nom/i).type('Martin');
    cy.findByLabelText(/email/i).type('alice.martin@example.com');
    cy.findByLabelText(/téléphone/i).type('0987654321');
    cy.findByRole('button', { name: /enregistrer/i }).click();
    cy.findByRole('alert', { name: /bénévole enregistré avec succès/i }).should('be.visible');

    // Naviguer vers la liste des bénévoles
    cy.findByRole('link', { name: /bénévoles/i }).click();
    cy.findByRole('heading', { name: /bénévoles/i }).should('be.visible');

    // Vérifier que le bénévole ajouté est présent (si affiché dans la liste)
    cy.findByText(/alice martin/i).should('be.visible');

    // Naviguer vers une autre page puis revenir
    cy.findByRole('link', { name: /accueil/i }).click();
    cy.findByRole('heading', { name: /accueil/i }).should('be.visible');
    cy.findByRole('link', { name: /bénévoles/i }).click();
    cy.findByText(/alice martin/i).should('be.visible');
  });
});
