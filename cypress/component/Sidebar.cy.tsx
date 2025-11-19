import { Sidebar } from "../../resources/js/Layouts/Partials/Sidebar";

describe("Sidebar - Navigation locale avec route() helper Inertia", () => {
    let activeRoute = "";

    beforeEach(() => {
        // Mock de la licence Syncfusion pour éviter les warnings
        cy.window().then((win) => {
            (win as any).Syncfusion = {
                Licensing: { validateLicense: () => {} },
            };

            // Mock global de route() helper Inertia
            (win as any).route = (name?: string) => {
                if (!name) {
                    return {
                        current: (routeName: string) => {
                            return activeRoute === routeName;
                        },
                    };
                }
                // Retourne des URLs mockées pour les routes
                const routes: Record<string, string> = {
                    welcome: "/",
                    calendar: "/calendar",
                    volunteers: "/volunteers",
                };
                return routes[name] || "/";
            };
        });
    });

    describe("Rendu : Affichage initial de la sidebar", () => {
        it("affiche tous les éléments de navigation dans l'état initial", () => {
            // Given: Le composant Sidebar est monté
            cy.mount(<Sidebar />);

            // When: Le composant est rendu
            // Then: Tous les liens de navigation sont visibles
            cy.contains("Tableau de bord").should("be.visible");
            cy.contains("Calendrier").should("be.visible");
            cy.contains("Bénévoles").should("be.visible");
            cy.contains("Préférences").should("be.visible");
            cy.contains("À propos").should("be.visible");
        });

        it("affiche les informations de l'utilisateur", () => {
            // Given: Le composant Sidebar est monté
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: Le nom et le rôle de l'utilisateur sont affichés
            cy.contains("Jane Doe").should("be.visible");
            cy.contains("Admin").should("be.visible");
        });

        it("rend le composant Syncfusion SidebarComponent", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When: Le composant est rendu
            // Then: Le conteneur principal existe
            cy.get("#portalSideBar").should("exist");
            cy.get(".dock").should("exist");
        });
    });

    describe("Navigation locale : Routes Inertia avec route() helper", () => {
        it("affiche le lien vers le tableau de bord avec la bonne URL", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When: Le lien tableau de bord est rendu
            // Then: L'attribut href pointe vers la route welcome
            cy.get('a[href="/"]').should("exist");
            cy.get('a[href="/"]').within(() => {
                cy.contains("Tableau de bord").should("exist");
            });
        });

        it("affiche le lien vers le calendrier avec la bonne URL", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When: Le lien calendrier est rendu
            // Then: L'attribut href pointe vers la route calendar
            cy.get('a[href="/calendar"]').should("exist");
            cy.get('a[href="/calendar"]').within(() => {
                cy.contains("Calendrier").should("exist");
            });
        });

        it("affiche le lien vers les bénévoles avec la bonne URL", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When: Le lien bénévoles est rendu
            // Then: L'attribut href pointe vers la route volunteers
            cy.get('a[href="/volunteers"]').should("exist");
            cy.get('a[href="/volunteers"]').within(() => {
                cy.contains("Bénévoles").should("exist");
            });
        });

        it("tous les liens sont accessibles et cliquables", () => {
            // Given: La sidebar avec tous les liens
            cy.mount(<Sidebar />);

            // When/Then: Chaque lien est visible et cliquable
            cy.get('a[href="/"]').should("be.visible");
            cy.get('a[href="/calendar"]').should("be.visible");
            cy.get('a[href="/volunteers"]').should("be.visible");
        });
    });

    describe("État actif : Gestion de la classe active-item via route().current()", () => {
        it("applique la classe active-item quand route().current('welcome') est vrai", () => {
            // Given: La route active est 'welcome'
            activeRoute = "welcome";
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: L'élément dashboard a la classe active-item
            cy.get("#dashboard").parent().should("have.class", "active-item");
        });

        it("applique la classe active-item quand route().current('calendar') est vrai", () => {
            // Given: La route active est 'calendar'
            activeRoute = "calendar";
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: L'élément calendar a la classe active-item
            cy.get("#calendar").parent().should("have.class", "active-item");
        });

        it("applique la classe active-item quand route().current('volunteers') est vrai", () => {
            // Given: La route active est 'volunteers'
            activeRoute = "volunteers";
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: L'élément volunteers a la classe active-item
            cy.get("#volunteers").parent().should("have.class", "active-item");
        });

        it("n'applique pas active-item aux éléments non actifs", () => {
            // Given: La route active est 'welcome'
            activeRoute = "welcome";
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: Seul dashboard a la classe active-item
            cy.get("#dashboard").parent().should("have.class", "active-item");
            cy.get("#calendar")
                .parent()
                .should("not.have.class", "active-item");
            cy.get("#volunteers")
                .parent()
                .should("not.have.class", "active-item");
        });

        it("maintient un seul élément actif à la fois", () => {
            // Given: La route active est 'calendar'
            activeRoute = "calendar";
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: Un seul élément a la classe active-item
            cy.get(".active-item").should("have.length", 1);
            cy.get("#calendar").parent().should("have.class", "active-item");
        });
    });

    describe("Rendu conditionnel : Classes CSS basées sur l'état de la route", () => {
        it("change visuellement l'élément actif selon la route", () => {
            // Given: Route welcome active
            activeRoute = "welcome";
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: Dashboard est visuellement actif
            cy.get("#dashboard").parent().should("have.class", "active-item");

            // When: On simule un changement de route vers calendar
            activeRoute = "calendar";
            cy.mount(<Sidebar />);

            // Then: Calendar devient actif et dashboard ne l'est plus
            cy.get("#calendar").parent().should("have.class", "active-item");
            cy.get("#dashboard")
                .parent()
                .should("not.have.class", "active-item");
        });

        it("applique les classes de base à tous les sidebar-items", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When: Les éléments sont rendus
            // Then: Tous ont la classe sidebar-item
            cy.get(".sidebar-item").should("have.length", 5);
            cy.get("#dashboard").parent().should("have.class", "sidebar-item");
            cy.get("#calendar").parent().should("have.class", "sidebar-item");
            cy.get("#volunteers").parent().should("have.class", "sidebar-item");
        });
    });

    describe("Intégration : Scénario complet de navigation Inertia", () => {
        it("simule un parcours utilisateur complet entre les routes", () => {
            // Given: L'utilisateur arrive sur la page d'accueil
            activeRoute = "welcome";
            cy.mount(<Sidebar />);

            // Then: Dashboard est actif
            cy.get("#dashboard").parent().should("have.class", "active-item");
            cy.contains("Tableau de bord").should("be.visible");

            // When: L'utilisateur navigue vers le calendrier (simulation)
            activeRoute = "calendar";
            cy.mount(<Sidebar />);

            // Then: Calendar devient actif
            cy.get("#calendar").parent().should("have.class", "active-item");
            cy.get("#dashboard")
                .parent()
                .should("not.have.class", "active-item");

            // When: L'utilisateur navigue vers les bénévoles
            activeRoute = "volunteers";
            cy.mount(<Sidebar />);

            // Then: Volunteers devient actif
            cy.get("#volunteers").parent().should("have.class", "active-item");
            cy.get("#calendar")
                .parent()
                .should("not.have.class", "active-item");

            // When: L'utilisateur retourne au tableau de bord
            activeRoute = "welcome";
            cy.mount(<Sidebar />);

            // Then: Dashboard redevient actif
            cy.get("#dashboard").parent().should("have.class", "active-item");
        });

        it("conserve les URLs correctes pendant toute la navigation", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When/Then: Toutes les URLs restent cohérentes
            cy.get('a[href="/"]').should("exist");
            cy.get('a[href="/calendar"]').should("exist");
            cy.get('a[href="/volunteers"]').should("exist");

            // When: On change de route active
            activeRoute = "calendar";
            cy.mount(<Sidebar />);

            // Then: Les URLs ne changent pas
            cy.get('a[href="/"]').should("exist");
            cy.get('a[href="/calendar"]').should("exist");
            cy.get('a[href="/volunteers"]').should("exist");
        });

        it("maintient la sidebar visible et interactive pendant toute la navigation", () => {
            // Given: Navigation entre plusieurs routes
            const routes = ["welcome", "calendar", "volunteers"];

            routes.forEach((route) => {
                activeRoute = route;
                cy.mount(<Sidebar />);

                // Then: La sidebar et tous ses éléments restent visibles
                cy.get("#portalSideBar").should("be.visible");
                cy.contains("Jane Doe").should("be.visible");
                cy.contains("Admin").should("be.visible");
                cy.contains("Tableau de bord").should("be.visible");
                cy.contains("Calendrier").should("be.visible");
                cy.contains("Bénévoles").should("be.visible");
                cy.contains("Préférences").should("be.visible");
                cy.contains("À propos").should("be.visible");
            });
        });
    });

    describe("Assertions via rôles et texte", () => {
        it("identifie les éléments de navigation par leur texte visible", () => {
            // Given: La sidebar est rendue
            cy.mount(<Sidebar />);

            // When/Then: Tous les éléments sont identifiables par leur texte
            cy.contains("Tableau de bord").should("exist");
            cy.contains("Calendrier").should("exist");
            cy.contains("Bénévoles").should("exist");
            cy.contains("Préférences").should("exist");
            cy.contains("À propos").should("exist");
        });

        it("vérifie l'état actif via la classe CSS selon la route", () => {
            // Given: La route calendar est active
            activeRoute = "calendar";
            cy.mount(<Sidebar />);

            // When/Then: L'état actif est vérifié via la classe
            cy.get("#calendar").parent().should("have.class", "active-item");

            // Et les autres ne sont pas actifs
            cy.get("#dashboard")
                .parent()
                .should("not.have.class", "active-item");
            cy.get("#volunteers")
                .parent()
                .should("not.have.class", "active-item");
        });

        it("identifie les liens par leur attribut href", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When/Then: Les liens sont accessibles via href
            cy.get('a[href="/"]').within(() => {
                cy.contains("Tableau de bord");
            });
            cy.get('a[href="/calendar"]').within(() => {
                cy.contains("Calendrier");
            });
            cy.get('a[href="/volunteers"]').within(() => {
                cy.contains("Bénévoles");
            });
        });
    });
});
