module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint',
    ],
    rules: {
        // Add your custom rules here
        'react/react-in-jsx-scope': 'off', // You can omit React imports in new JSX environments
        '@typescript-eslint/no-unused-vars': ['warn'], // Example rule
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
