// cypress/support/component.ts
import { mount } from "@cypress/react";
import { MountOptions, MountReturn } from "@cypress/react";

// Import testing library commands
import "@testing-library/cypress/add-commands";

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: React.ReactElement,
        options?: MountOptions
      ): Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add("mount", mount);