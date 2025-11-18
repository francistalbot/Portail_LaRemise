// cypress.config.ts (component only)
import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import path from "path";

export default defineConfig({
    component: {
        specPattern: "cypress/component/**/*.{feature,cy.tsx}",
        supportFile: "cypress/support/component.ts",
        indexHtmlFile: "cypress/support/component-index.html",
        devServer: {
            framework: "react",
            bundler: "vite",
            viteConfig: {
                resolve: {
                    alias: {
                        // Mock Syncfusion pour les tests Cypress
                        "@syncfusion/ej2-react-dropdowns": path.resolve(
                            __dirname,
                            "cypress/support/mocks/syncfusion.tsx"
                        ),
                        "@": path.resolve(__dirname, "./resources/js"),
                    },
                },
            },
        },
        async setupNodeEvents(on, config) {
            await addCucumberPreprocessorPlugin(on, config);
            on(
                "file:preprocessor",
                createBundler({ plugins: [createEsbuildPlugin(config)] })
            );
            return config;
        },
    },
});
