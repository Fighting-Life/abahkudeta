// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier';

export default withNuxt(
	[
		{
			ignores: ['.nuxt', 'node_modules', 'public', 'src/components/ui/*'],
		},
		{
			rules: {
				'no-undef': 'off',
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					"off",
					{
						"argsIgnorePattern": "^_",
						"varsIgnorePattern": "^\\$\\$(Props|Events|Slots|Generic)$"
					}
				],
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-empty-object-type": "off",
				"vue/html-self-closing": "off",
				"vue/multi-word-component-names": "off",
				"@typescript-eslint/no-invalid-void-type": "off",
				"@typescript-eslint/unified-signatures": "off",
				"vue/require-default-prop": "off",
				"vue/no-v-html": "off",
				"import/consistent-type-specifier-style": "off",
			}
		},
	],
	prettier,
)
