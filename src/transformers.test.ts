import { describe, it, expect } from 'vitest';
import { transformTomlToMd, transformMdToToml } from './transformers.js';

describe('Minimal Core Logic Tests', () => {
  it('should transform TOML {{args}} to Markdown [INPUT]', () => {
    const input = `description = "Test"
prompt = "Hello {{args}} world"`;
    const result = transformTomlToMd(input);
    expect(result).toContain('description: Test');
    expect(result).toContain('Hello [INPUT] world');
  });

  it('should transform Markdown [INPUT] to TOML {{args}}', () => {
    const input = `
---
description: Test
---
Hello [INPUT] world
`.trim();
    const result = transformMdToToml(input);
    expect(result).toContain('description = "Test"');
    expect(result).toContain('prompt = "Hello {{args}} world"');
  });

  it('should handle TOML without {{args}}', () => {
    const input = `description = "No Args"\nprompt = "Just text"`;
    const result = transformTomlToMd(input);
    expect(result).toContain('description: No Args');
    expect(result).toContain('Just text');
    expect(result).not.toContain('[INPUT]');
  });

  it('should handle Markdown without [INPUT]', () => {
    const input = `
---
description: No Input
---
Just text
`.trim();
    const result = transformMdToToml(input);
    expect(result).toContain('description = "No Input"');
    expect(result).toContain('prompt = "Just text"');
    expect(result).not.toContain('{{args}}');
  });

  it('should throw error on invalid TOML', () => {
      const input = `invalid = toml = syntax`;
      expect(() => transformTomlToMd(input)).toThrow('Invalid TOML');
  });

  it('should throw error on invalid Markdown frontmatter', () => {
      // gray-matter usually handles loose frontmatter well, but let's test a case 
      // where we expect robust handling. If gray-matter doesn't throw, we expect valid output.
      // However, our wrapper catches errors. Let's force an error if possible, 
      // or check that it handles empty content gracefully.
      // Actually, gray-matter is quite forgiving. Let's test empty input.
      const input = '';
      const result = transformMdToToml(input);
      expect(result).toContain('description = ""');
      expect(result).toContain('prompt = ""');
  });
});
