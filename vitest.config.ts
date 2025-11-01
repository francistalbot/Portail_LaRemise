// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        react({
            include: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
        }),
    ],
    test: {
        globals: true,
        css: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.ts",
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            reportsDirectory: "./coverage",
            exclude: [
                "node_modules/",
                "src/test/",
                "**/*.d.ts",
                "**/*.config.*",
                "**/coverage/**",
                "resources/js/bootstrap.ts",
                "resources/js/app.tsx",
            ],
            include: ["resources/js/util.tsx", "resources/js/Components/Modal.tsx", "resources/js/Components/Scheduler/PosteAssignmentDropdown.tsx"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/js"),
        },
    },
});
