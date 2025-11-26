Cypress.Commands.add("getByTest", (id) => cy.get(`[data-testid=${id}]`));
