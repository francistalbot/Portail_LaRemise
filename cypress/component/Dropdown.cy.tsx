import Dropdown from "../../resources/js/Components/Dropdown";
import { Link } from "@inertiajs/react";

describe("Dropdown - Context et gestion d'état partagé", () => {
    describe("Context : État ouvert/fermé", () => {
        it("affiche le dropdown fermé par défaut (état initial)", () => {
            // Given: Un dropdown est monté
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu utilisateur</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <button>Profile</button>
                        <button>Déconnexion</button>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: Le composant est rendu
            // Then: Le contenu est caché (état initial = fermé)
            cy.contains("Profile").should("not.exist");
            cy.contains("Déconnexion").should("not.exist");
        });

        it("ouvre le dropdown lors du clic sur le trigger (modification de l'état Context)", () => {
            // Given: Un dropdown fermé
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu utilisateur</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <button>Profile</button>
                        <button>Déconnexion</button>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: L'utilisateur clique sur le trigger
            cy.contains("Menu utilisateur").click();

            // Then: Le contenu devient visible (état Context = open: true)
            cy.contains("Profile").should("be.visible");
            cy.contains("Déconnexion").should("be.visible");
        });

        it("ferme le dropdown lors d'un second clic sur le trigger (toggle de l'état)", () => {
            // Given: Un dropdown ouvert
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu utilisateur</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <button>Profile</button>
                        <button>Déconnexion</button>
                    </Dropdown.Content>
                </Dropdown>
            );

            cy.contains("Menu utilisateur").click();
            cy.contains("Profile").should("be.visible");

            // When: L'utilisateur clique à nouveau sur le trigger
            cy.contains("Menu utilisateur").click();

            // Then: Le contenu est caché (état Context = open: false)
            cy.contains("Profile").should("not.exist");
            cy.contains("Déconnexion").should("not.exist");
        });

        it("ferme le dropdown en cliquant sur un élément du contenu", () => {
            // Given: Un dropdown ouvert avec des éléments cliquables
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu utilisateur</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <button>Profile</button>
                        <button>Déconnexion</button>
                    </Dropdown.Content>
                </Dropdown>
            );

            cy.contains("Menu utilisateur").click();
            cy.contains("Profile").should("be.visible");

            // When: L'utilisateur clique sur un élément du menu
            cy.contains("Profile").click();

            // Then: Le dropdown se ferme automatiquement
            cy.contains("Profile").should("not.exist");
            cy.contains("Déconnexion").should("not.exist");
        });
    });
});
