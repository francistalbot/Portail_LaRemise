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
            cy.contains("Profile").should("not.be.visible");
            cy.contains("Déconnexion").should("not.be.visible");
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
            cy.contains("Profile").should("not.be.visible");
            cy.contains("Déconnexion").should("not.be.visible");
        });

        it("ferme le dropdown en cliquant sur le backdrop (gestion d'état externe)", () => {
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

            // When: L'utilisateur clique sur le backdrop (zone fixe invisible)
            cy.get(".fixed.inset-0.z-40").click({ force: true });

            // Then: Le dropdown se ferme
            cy.contains("Profile").should("not.be.visible");
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
            cy.contains("Profile").should("not.be.visible");
        });
    });

    describe("Rendu : Affichage conditionnel basé sur l'état Context", () => {
        it("affiche le contenu uniquement quand open = true", () => {
            // Given: Un dropdown avec du contenu
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Actions</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <div>Contenu 1</div>
                        <div>Contenu 2</div>
                        <div>Contenu 3</div>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: L'état est fermé
            // Then: Aucun contenu n'est visible
            cy.contains("Contenu 1").should("not.exist");
            cy.contains("Contenu 2").should("not.exist");
            cy.contains("Contenu 3").should("not.exist");

            // When: L'état passe à ouvert
            cy.contains("Actions").click();

            // Then: Tout le contenu devient visible
            cy.contains("Contenu 1").should("be.visible");
            cy.contains("Contenu 2").should("be.visible");
            cy.contains("Contenu 3").should("be.visible");
        });

        it("applique les classes d'alignement selon la prop align", () => {
            // Given: Un dropdown avec alignement à gauche
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="left">
                        <div>Item</div>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: Le dropdown est ouvert
            cy.contains("Menu").click();

            // Then: Les classes d'alignement gauche sont appliquées
            cy.get(".absolute")
                .should("have.class", "ltr:origin-top-left")
                .and("have.class", "start-0");
        });

        it("applique l'animation de transition lors de l'ouverture", () => {
            // Given: Un dropdown fermé
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <div>Contenu</div>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: Le dropdown s'ouvre
            cy.contains("Menu").click();

            // Then: Les classes de transition sont présentes
            cy.get(".absolute").should("have.class", "transition");
        });
    });

    describe("Navigation locale : Liens accessibles après ouverture", () => {
        it("rend les liens inaccessibles quand le dropdown est fermé", () => {
            // Given: Un dropdown avec des liens de navigation
            const mockNavigate = cy.stub();

            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Navigation</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                        <Dropdown.Link href="/settings">
                            Paramètres
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: Le dropdown est fermé
            // Then: Les liens ne sont pas visibles/accessibles
            cy.contains("Profile").should("not.exist");
            cy.contains("Paramètres").should("not.exist");
        });

        it("rend les liens accessibles après ouverture du dropdown", () => {
            // Given: Un dropdown fermé avec des liens
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Navigation</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                        <Dropdown.Link href="/settings">
                            Paramètres
                        </Dropdown.Link>
                        <Dropdown.Link href="/logout">
                            Déconnexion
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: L'utilisateur ouvre le dropdown
            cy.contains("Navigation").click();

            // Then: Tous les liens sont visibles et cliquables
            cy.contains("Profile")
                .should("be.visible")
                .should("have.attr", "href", "/profile");

            cy.contains("Paramètres")
                .should("be.visible")
                .should("have.attr", "href", "/settings");

            cy.contains("Déconnexion")
                .should("be.visible")
                .should("have.attr", "href", "/logout");
        });

        it("applique les styles hover sur les liens", () => {
            // Given: Un dropdown ouvert avec des liens
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            );

            cy.contains("Menu").click();

            // When: L'utilisateur survole un lien
            // Then: Les classes de style sont présentes
            cy.contains("Profile").should("have.class", "hover:bg-gray-100");
        });

        it("ferme le dropdown après navigation vers un lien", () => {
            // Given: Un dropdown ouvert avec des liens
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Menu</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                        <Dropdown.Link href="/settings">
                            Paramètres
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            );

            cy.contains("Menu").click();
            cy.contains("Profile").should("be.visible");

            // When: L'utilisateur clique sur un lien (simule navigation)
            cy.contains("Profile").click();

            // Then: Le dropdown se ferme
            cy.contains("Profile").should("not.be.visible");
        });
    });

    describe("Intégration : Scénario complet d'utilisation", () => {
        it("permet un cycle complet : ouvrir, naviguer, fermer", () => {
            // Given: Un dropdown avec plusieurs liens
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button" data-testid="user-menu">
                            Jean Dupont
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="right">
                        <Dropdown.Link href="/profile">
                            Mon profil
                        </Dropdown.Link>
                        <Dropdown.Link href="/settings">
                            Paramètres
                        </Dropdown.Link>
                        <Dropdown.Link href="/logout">
                            Déconnexion
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: L'utilisateur ouvre le menu
            cy.get('[data-testid="user-menu"]').click();

            // Then: Le menu est visible avec tous les liens
            cy.contains("Mon profil").should("be.visible");
            cy.contains("Paramètres").should("be.visible");
            cy.contains("Déconnexion").should("be.visible");

            // When: L'utilisateur ferme sans cliquer sur un lien
            cy.get('[data-testid="user-menu"]').click();

            // Then: Le menu se ferme
            cy.contains("Mon profil").should("not.be.visible");

            // When: L'utilisateur rouvre et clique sur un lien
            cy.get('[data-testid="user-menu"]').click();
            cy.contains("Paramètres").click();

            // Then: Le menu se ferme automatiquement
            cy.contains("Paramètres").should("not.be.visible");
        });

        it("gère plusieurs ouvertures/fermetures successives sans problème d'état", () => {
            // Given: Un dropdown
            cy.mount(
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button">Toggle</button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <div>Contenu</div>
                    </Dropdown.Content>
                </Dropdown>
            );

            // When: Plusieurs cycles d'ouverture/fermeture
            for (let i = 0; i < 3; i++) {
                cy.contains("Toggle").click();
                cy.contains("Contenu").should("be.visible");

                cy.contains("Toggle").click();
                cy.contains("Contenu").should("not.be.visible");
            }

            // Then: L'état reste cohérent après plusieurs cycles
            cy.contains("Toggle").click();
            cy.contains("Contenu").should("be.visible");
        });
    });
});
