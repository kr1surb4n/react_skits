module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        'plugin:@typescript-eslint/recommended',
    ],
    "ignorePatterns": ["vendor/**", "node_modules/**"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2020,
        // "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "parser": '@typescript-eslint/parser',
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        'camelcase': 'off'
    }
};