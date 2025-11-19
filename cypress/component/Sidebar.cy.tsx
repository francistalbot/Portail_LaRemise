import { Sidebar } from "../../resources/js/Layouts/Partials/Sidebar";

describe("Sidebar - Navigation locale avec route() helper Inertia", () => {
    let activeRoute = "";

    beforeEach(() => {
        cy.window().then((win) => {
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
        it("rend le composant Syncfusion SidebarComponent", () => {
            // Given: La sidebar est montée
            cy.mount(<Sidebar />);

            // When: Le composant est rendu
            // Then: Le conteneur principal existe
            cy.get("#portalSideBar").should("exist");
            cy.get(".dock").should("exist");
        });

        it("tous les liens sont accessibles et cliquables", () => {
            // Given: La sidebar avec tous les liens
            cy.mount(<Sidebar />);

            // When/Then: Chaque lien est visible et cliquable
            cy.get('a[href="/"]').should("be.visible");
            cy.get('a[href="/calendar"]').should("be.visible");
            cy.get('a[href="/volunteers"]').should("be.visible");
        });

        it("applique la classe active-item quand route().current('welcome') est vrai", () => {
            // Given: La route active est 'welcome'
            activeRoute = "welcome";
            cy.mount(<Sidebar />);

            // When: La sidebar est rendue
            // Then: L'élément dashboard a la classe active-item
            cy.get("#dashboard").should("have.class", "active-item");
        });

        it("change visuellement l'élément actif selon la route", () => {
            // Given: Route welcome active
            activeRoute = "welcome";
            cy.mount(<Sidebar />);

            // When: On simule un changement de route vers calendar
            activeRoute = "calendar";
            cy.mount(<Sidebar />);

            // Then: Calendar devient actif et dashboard ne l'est plus
            cy.get("#calendar").should("have.class", "active-item");
            cy.get("#dashboard").should("not.have.class", "active-item");
        });
    });
});
