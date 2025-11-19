# Tests

## Tests locaux

### Vitest (tests unitaires)

```bash
# Lancer les tests
npm run test

# Avec couverture de code
npm run test:coverage
```

### Cypress (tests d'intégration - Component Testing)

```bash
# Mode interactif
npm run ct:open

# Mode headless (CI)
npm run ct:run
```

## CI/CD

Les tests s'exécutent automatiquement via GitHub Actions :

-   **Vitest** : `.github/workflows/vitest.yml`
-   **Cypress** : `.github/workflows/cypress.yml`

Les workflows se déclenchent sur `push` et `pull_request`.
