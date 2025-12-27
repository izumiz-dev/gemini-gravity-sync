import matter from 'gray-matter';
import toml from '@iarna/toml';

// Replace {{args}} with [INPUT]
export const transformTomlToMd = (tomlContent: string): string => {
	try {
		const data = toml.parse(tomlContent);
		const description = (data.description as string) || '';
		let prompt = (data.prompt as string) || '';

		// Transformation Rule
		prompt = prompt.split('{{args}}').join('[INPUT]');

		return matter.stringify(prompt, { description });
	} catch (e) {
		throw new Error(`Invalid TOML: ${(e as Error).message}`);
	}
};

// Replace [INPUT] with {{args}}
export const transformMdToToml = (mdContent: string): string => {
	try {
		const parsed = matter(mdContent);
		const description = (parsed.data.description as string) || '';
		let body = parsed.content.trim();

		// Transformation Rule
		body = body.split('[INPUT]').join('{{args}}');

		const tomlData = {
			description,
			prompt: body,
		};

		return toml.stringify(tomlData as any);
	} catch (e) {
		throw new Error(`Invalid Markdown: ${(e as Error).message}`);
	}
};
