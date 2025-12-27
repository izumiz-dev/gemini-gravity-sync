# Gemini-Antigravity Sync CLI

[日本語ドキュメント (Japanese)](README-JA.md)

A real-time bidirectional synchronization tool between **Gemini CLI** (TOML) and **Antigravity** (Markdown) configuration files.

![gemini-gravity-sync.png](./images/gemini-gravity-sync.png)

## Features

- **Bidirectional Sync**: Changes in `.gemini/commands/*.toml` are instantly reflected in `.agent/workflows/*.md` and vice-versa.
- **Smart Variable Substitution**: Automatically handles the mapping between Gemini's `{{args}}` and Antigravity's `[INPUT]` placeholders.
- **Infinite Loop Prevention**: Uses MD5 checksum validation to prevent redundant write operations and circular sync loops.
- **Modern CLI UI**: A dashboard-style terminal interface built with [Ink](https://github.com/vadimdemedes/ink).
- **Safe Operations**: Automatic directory creation and robust error handling for malformed files.

## Directory Mapping

| System | Path | Format |
| :--- | :--- | :--- |
| **Gemini CLI** | `.gemini/commands/` | TOML (`.toml`) |
| **Antigravity** | `.agent/workflows/` | Markdown + Frontmatter (`.md`) |

## Data Transformation Rules

### TOML to Markdown
- `description` $\to$ YAML Frontmatter `description`
- `prompt` (with `{{args}}`) $\to$ Markdown Body (with `[INPUT]`)

### Markdown to TOML
- YAML Frontmatter `description` $\to$ `description`
- Markdown Body (with `[INPUT]`) $\to$ `prompt` (with `{{args}}`)

## Getting Started

### Prerequisites
- **Node.js**: v16 or higher
- **Package Manager**: pnpm (recommended) or npm

### Installation

To install the tool globally so you can use it from any directory:

```bash
git clone git@github.com:izumiz-dev/gemini-gravity-sync.git && \
cd gemini-gravity-sync && \
pnpm install && \
pnpm build && \
pnpm link --global
```

<details>
<summary>Using <strong>npm</strong> instead?</summary>

```bash
git clone git@github.com:izumiz-dev/gemini-gravity-sync.git && \
cd gemini-gravity-sync && \
npm install && \
npm run build && \
npm link
```
</details>

### Usage

Once installed, you can run the tool from the root of any project containing `.gemini` and `.agent` directories.

```bash
gemini-gravity-sync
```

The tool will start an interactive dashboard and perform **real-time synchronization**. It watches for file changes and instantly updates the corresponding file in the other format.

- **Edit** a TOML file in `.gemini/commands/` -> Auto-updates Markdown in `.agent/workflows/`.
- **Edit** a Markdown file in `.agent/workflows/` -> Auto-updates TOML in `.gemini/commands/`.

Press `Ctrl+C` to stop the watcher.

#### Development Mode
For contributing or debugging:
```bash
pnpm dev
```

## Tech Stack
- **UI**: Ink (React for CLI)
- **Watcher**: Chokidar
- **Parsers**: @iarna/toml, gray-matter
- **Language**: TypeScript

## License Check
All used libraries are distributed under permissive open-source licenses, suitable for both personal and commercial use:

- **MIT**: react, ink, chokidar, fs-extra, gray-matter, and most transitive dependencies.
- **ISC**: @iarna/toml, graceful-fs, signal-exit.
- **BSD-3-Clause**: sprintf-js.
- **Apache-2.0**: typescript.

There are no copyleft licenses (like GPL) found in the direct dependencies that would impose restrictive distribution requirements for this tool.
