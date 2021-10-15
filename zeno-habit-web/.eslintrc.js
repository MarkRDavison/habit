module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['react', '@typescript-eslint'],
    extends: [
        "react-app",
        "react-app/jest",
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
        "import/first": "error",
        "react/prop-types": "off"
    },
    settings: {
        react: {
            "pragma": "React",
            "version": "detect"
        }
    }
}