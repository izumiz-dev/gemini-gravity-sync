# Gemini-Antigravity Sync CLI

**Gemini CLI** (TOML) と **Antigravity** (Markdown) の設定ファイルをリアルタイムで双方向同期するCLIツールです。

![gemini-gravity-sync.png](./images/gemini-gravity-sync.png)

[English README](README.md)

## 特徴

- **双方向同期**: `.gemini/commands/*.toml` の変更は即座に `.agent/workflows/*.md` に反映され、逆もまた同様です。
- **スマートな変数置換**: Geminiの `{{args}}` と Antigravityの `[INPUT]` という異なるプレースホルダーを自動的に変換し、互換性を保ちます。
- **無限ループ防止**: MD5チェックサムを使用してファイルの変更を検知し、不必要な書き込みや同期ループを防ぎます。
- **モダンなCLI UI**: [Ink](https://github.com/vadimdemedes/ink) を使用したダッシュボードスタイルのターミナルUIを提供します。
- **安全な操作**: ディレクトリの自動作成や、不正なファイルに対する堅牢なエラーハンドリングを備えています。

## ディレクトリ対応表

| システム | パス | フォーマット |
| :--- | :--- | :--- |
| **Gemini CLI** | `.gemini/commands/` | TOML (`.toml`) |
| **Antigravity** | `.agent/workflows/` | Markdown + Frontmatter (`.md`) |

## データ変換ルール

### TOML から Markdown へ
- `description` $\to$ YAML Frontmatter の `description`
- `prompt` (中の `{{args}}`) $\to$ Markdown 本文 (中の `[INPUT]`)

### Markdown から TOML へ
- YAML Frontmatter の `description` $\to$ `description`
- Markdown 本文 (中の `[INPUT]`) $\to$ `prompt` (中の `{{args}}`)

## はじめに

### 前提条件
- **Node.js**: v16 以上
- **パッケージマネージャー**: pnpm (推奨) または npm

### インストール

ツールをグローバルにインストールして、どのディレクトリからでも使えるようにします。

```bash
git clone git@github.com:izumiz-dev/gemini-gravity-sync.git && \
cd gemini-gravity-sync && \
pnpm install && \
pnpm build && \
pnpm link --global
```

<details>
<summary><strong>npm</strong> を使用する場合</summary>

```bash
git clone git@github.com:izumiz-dev/gemini-gravity-sync.git && \
cd gemini-gravity-sync && \
npm install && \
npm run build && \
npm link
```
</details>

### 使い方

インストール後、`.gemini` と `.agent` ディレクトリを含むプロジェクトのルートで以下のコマンドを実行してください。

```bash
gemini-gravity-sync
```

ツールがインタラクティブなダッシュボードを起動し、**リアルタイム同期**を開始します。ファイルの変更を監視し、もう一方のフォーマットへ即座に反映します。

- `.gemini/commands/` 内の TOML を**編集** -> `.agent/workflows/` 内の Markdown が自動更新されます。
- `.agent/workflows/` 内の Markdown を**編集** -> `.gemini/commands/` 内の TOML が自動更新されます。

終了するには `Ctrl+C` を押してください。

#### 開発モード
開発やデバッグを行う場合:
```bash
pnpm dev
```

## 技術スタック
- **UI**: Ink (React for CLI)
- **監視**: Chokidar
- **パーサー**: @iarna/toml, gray-matter
- **言語**: TypeScript

## ライセンスチェック
使用しているライブラリはすべて、MIT、ISC、BSD、Apache 2.0 などの寛容なオープンソースライセンスの下で配布されており、個人的および商用利用の両方に適しています。
