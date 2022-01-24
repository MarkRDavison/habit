module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['react', '@typescript-eslint', 'jest'],
    env: {
        "jest/globals": true,
        "jest": true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "prettier"
    ],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 12,
        ecmaFeatures: {
            jsx: true
        },
        sourceType: 'module',
    },
    rules: {
        "no-console": "error",
        "react/prop-types": "off",
        "@typescript-eslint/no-empty-interface": 0,
        "quotes": [2, "single", { "avoidEscape": true }],
        "@typescript-eslint/explicit-function-return-type": 2,
        "@typescript-eslint/no-unused-vars": 0
    },
    settings: {
        react: {
            "pragma": "React",
            "version": "detect"
        }
    }
}