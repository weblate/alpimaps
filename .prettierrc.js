module.exports = {
    printWidth: 200,
    semi: true,
    tabWidth: 4,
    singleQuote: true,
    parser: 'typescript',
    trailingComma: 'none',
    plugins: ['prettier-plugin-svelte'],
    svelteSortOrder: 'options-styles-scripts-markup',
    svelteStrictMode: false,
    svelteBracketNewLine: false,
    svelteIndentScriptAndStyle: true
};