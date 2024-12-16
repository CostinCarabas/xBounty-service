import eslintPlugin from '@typescript-eslint/eslint-plugin';
import _import from "eslint-plugin-import";
import boundaries from "eslint-plugin-boundaries";
import unusedImports from "eslint-plugin-unused-imports";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import stylisticJs from "@stylistic/eslint-plugin-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: [
            "**/eslint.config.*",
            "libs/db/**/migrations/**/*",
            "**/typeorm.config.ts",
            "**/typeorm.config.example.ts",
            "scripts/*",
            "dist/*",
            "tools/*",
        ],
    },
    ...compat.extends(
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:boundaries/recommended",
    ),
    {
        plugins: {
            "@typescript-eslint": eslintPlugin,
            import: fixupPluginRules(_import),
            boundaries,
            "unused-imports": unusedImports,
            "@stylistic/js": stylisticJs,
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "module",
            parserOptions: {
                project: "tsconfig.json",
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "tsconfig.json",
                },
            },
            "boundaries/elements": [
                {
                    type: "apps",
                    pattern: "apps/*",
                },
                {
                    type: "libs/core",
                    pattern: "libs/core/*",
                },
                {
                    type: "libs/config",
                    pattern: "libs/config/*",
                },
                {
                    type: "libs/db",
                    pattern: "libs/db/*",
                },
                {
                    type: "libs/db-loaders",
                    pattern: "libs/db-loaders/*",
                },
                {
                    type: "libs/http",
                    pattern: "libs/http/*",
                },
                {
                    type: "libs/common",
                    pattern: "libs/common/*",
                },
                {
                    type: "libs/external-apis",
                    pattern: "libs/external-apis/*",
                }
            ],
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", {
                vars: "all",
                args: "after-used",
                ignoreRestSiblings: true,
            }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@stylistic/js/quotes": ["warn", "single"],
            "eol-last": ["warn", "always"],
            "no-multiple-empty-lines": ["warn", {
                max: 1,
                maxEOF: 0,
            }],
            semi: [1, "always"],
            "comma-dangle": ["error", {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "always-multiline",
            }],
            "padded-blocks": ["warn", "never"],
            "object-curly-newline": ["warn", {
                ObjectExpression: {
                    multiline: true,
                    minProperties: 1,
                    consistent: true,
                },

                ObjectPattern: {
                    multiline: true,
                    minProperties: 4,
                    consistent: true,
                },

                ImportDeclaration: {
                    multiline: true,
                    minProperties: 4,
                    consistent: true,
                },

                ExportDeclaration: {
                    multiline: true,
                    minProperties: 4,
                    consistent: true,
                },
            }],
            indent: ["error", 2, {
                FunctionDeclaration: {
                    body: 1,
                    parameters: 1,
                },

                FunctionExpression: {
                    body: 1,
                    parameters: 1,
                },

                SwitchCase: 1,
                ignoredNodes: ["PropertyDefinition"],
            }],
            "object-curly-spacing": ["warn", "always"],
            "array-bracket-spacing": ["warn", "never"],
            "computed-property-spacing": ["warn", "never"],
            "no-trailing-spaces": "warn",
            "object-property-newline": "warn",
            "no-restricted-imports": ["error", {
                patterns: ["libs/*", "apps/*", "**/apps", "**/libs"],
            }],
            "max-len": ["error", {
                code: 120,
                tabWidth: 2,
            }],
            "boundaries/element-types": [2, {
                default: "disallow",
                rules: [
                    {
                        from: ["apps"],
                        allow: [
                            "libs/core",
                            "libs/config",
                            "libs/db",
                            "libs/http",
                            "libs/external-apis",
                            "libs/common",
                            "libs/db-loaders",
                        ],
                    },
                    {
                        from: ["libs/core"],

                        allow: [
                            "libs/config",
                            "libs/db",
                            "libs/http",
                            "libs/external-apis",
                            "libs/common",
                            "libs/db-loaders",
                        ],
                    },
                    {
                        from: ["libs/common"],
                        allow: ["libs/config"],
                    },
                    {
                        from: ["libs/external-apis"],
                        allow: ["libs/common", "libs/http"],
                    },
                    {
                        from: ["libs/db-loaders"],
                        allow: ["libs/db", "libs/common"],
                    }
                ],
            }],
            "boundaries/no-unknown": [2],
            "boundaries/no-unknown-files": [2],
            "boundaries/no-private": [0],
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": ["warn", {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_",
            }],
        },
    }];