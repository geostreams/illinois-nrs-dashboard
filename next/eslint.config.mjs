import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = [
    {
        ignores: ['public/**'],
    },
    ...nextCoreWebVitals,
    ...nextTypescript,
    prettierRecommended,
    {
        // eslint-config-next 16 bundles eslint-plugin-react-hooks v7, which enables
        // React Compiler "rules of react" checks as errors even though this project
        // hasn't opted into reactCompiler. Downgraded to warn until the flagged
        // components (navbar effects, memoized callbacks) are addressed separately.
        rules: {
            'react-hooks/set-state-in-effect': 'warn',
            'react-hooks/preserve-manual-memoization': 'warn',
        },
    },
];

export default eslintConfig;
