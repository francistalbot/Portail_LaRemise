// cypress/support/component.ts
import { mount } from "cypress/react";
import { registerLicense } from "@syncfusion/ej2-base";

// Enregistrer la licence Syncfusion pour éviter les messages de trial
registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

Cypress.Commands.add("mount", mount);
import "@testing-library/cypress/add-commands";
