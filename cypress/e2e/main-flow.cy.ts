describe("Parcours principal - Accueil vers succès", () => {
    beforeEach(() => {
        cy.exec("php artisan migrate:fresh --seed");
    });
    it("Accède à la page des bénévoles depuis l'accueil", () => {
        cy.visit("http://localhost:8000/");

        // Accueil visible
        cy.get("#portalSideBar").should("be.visible");
        cy.findByRole("link", { name: /bénévoles/i }).click();

        // Vérifier que la page des bénévoles est affichée
        cy.url().should("include", "/volunteers");
        cy.contains("Créer un bénévole").should("be.visible");
    });
    it("Affiche les erreurs de validation sur soumission invalide", () => {
        cy.visit("http://localhost:8000/");

        // Accueil visible
        cy.get("#portalSideBar").should("be.visible");
        cy.findByRole("link", { name: /bénévoles/i }).click();

        // Formulaire vide
        cy.getByTest("submit-button").click();
        // Messages d'erreur attendus
        cy.getByTest("error-nom").contains("Le nom ne peut pas être vide");
        cy.getByTest("error-email").contains(
            "L'adresse courriel n'est pas valide"
        );
        cy.getByTest("error-slack").contains(
            "L'identifiant Slack ne peut pas être vide"
        );
    });
    it("Créé un bénévole avec succès", () => {
        cy.visit("http://localhost:8000");

        // Accueil visible
        cy.get("#portalSideBar").should("be.visible");
        cy.findByRole("link", { name: /bénévoles/i }).click();

        cy.getByTest("input-nom").type("Dupont");
        cy.getByTest("select-comite").select("2");
        cy.getByTest("input-slack").type("U12345678");
        cy.getByTest("input-email").type("jean.dupont2@example.com{enter}");

        // Succès
        cy.contains("Bénévole créé avec succès !").should("be.visible");
    });
});
