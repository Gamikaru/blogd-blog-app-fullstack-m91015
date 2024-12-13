// eslint.config.js

import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    // Apply ESLint's recommended rules
    js.configs.recommended,

    // Apply React-specific rules to JavaScript and JSX files
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                DOMParser: 'readonly', // Added DOMParser for TextSlide.jsx
                HTMLElement: 'readonly', // Added HTMLElement for Sidebar.jsx
                fetch: 'readonly', // Added fetch for newsService.js

                // Node.js globals
                process: 'readonly',
                __dirname: 'readonly',

                // Other globals
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                FormData: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                atob: 'readonly',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
        },
        rules: {
            'react/react-in-jsx-scope': 'off', // Not needed with React 17+
            'react/prop-types': 'error', // Enforce PropTypes for props validation
            'react/display-name': 'error', // Ensure components have display names
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused variables starting with "_"
            'react-hooks/rules-of-hooks': 'error', // Enforce rules of hooks
            'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies in useEffect
            'react/jsx-uses-vars': 'error', // Prevent variables used in JSX from being marked as unused
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // Apply Jest-specific globals to test files
    {
        files: ['**/*.test.js', '**/*.spec.js'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                after: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                expect: 'readonly',
            },
        },
    },

    // Disable blocking ESLint in development
    {
        ignores: ['**/*.js', '**/*.jsx'], // Ignore linting errors in dev mode
        files: process.env.NODE_ENV === 'development' ? ['**/*.js', '**/*.jsx'] : [],
        rules: {
            // Allows easier development without critical interruptions
            'no-undef': 'off',
            'react/prop-types': 'off',
        },
    },
];
