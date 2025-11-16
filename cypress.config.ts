// cypress.config.ts (component only)
import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
export default defineConfig({
    component: {
        specPattern: "cypress/component/**/*.{feature,cy.tsx}",
        supportFile: "cypress/support/component.ts",
        indexHtmlFile: "cypress/support/component-index.html",
        devServer: { 
            framework: "react", 
            bundler: "vite"
        },
        async setupNodeEvents(on, config) {
            await addCucumberPreprocessorPlugin(on, config);
            on("file:preprocessor",
                createBundler({ plugins: [createEsbuildPlugin(config)] })
            );
            return config;
        },
    },
});