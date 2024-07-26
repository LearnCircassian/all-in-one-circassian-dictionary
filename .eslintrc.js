module.exports = {
    "extends": [
        "expo",
        "eslint:recommended",
        "plugin:react/recommended",
        "prettier",
    ],
    plugins: [
        "prettier",
    ],
    rules: {
        'react/display-name': ['off'],
        "prettier/prettier": ["error", {
            "endOfLine": "auto"
        }],
        "prefer-const": "error",
        "curly": "error",
        "no-unused-vars": "off",
        "unused-imports/no-unused-imports": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-vars": ["off", {
            "vars": "all",
            "varsIgnorePattern": "^_",
            "args": "after-used",
            "argsIgnorePattern": "^_",
        }],
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off",
    },
}
