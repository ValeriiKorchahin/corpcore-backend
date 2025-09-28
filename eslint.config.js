// eslint.config.js
import pluginNode from 'eslint-plugin-node';

export default [
    {
        files: ['**/*.js'],
        ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.env', 'eslint-config.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
        },
        plugins: {
            node: pluginNode,
        },
        rules: {
            indent: ['error', 4],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'space-before-function-paren': ['error', 'never'],
            'eol-last': ['error', 'always'],
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-undef': 'off',
            'node/no-unsupported-features/es-syntax': 'off',
            'node/no-unpublished-require': 'off',
            'node/no-missing-import': 'off',
            'node/no-extraneous-require': 'off',
        },
    },
];
