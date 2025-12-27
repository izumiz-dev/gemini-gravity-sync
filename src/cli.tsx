#!/usr/bin/env node
import React, { useState, useEffect, useCallback } from 'react';
import { render, Box, Text, Static } from 'ink';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import toml from '@iarna/toml';
import crypto from 'crypto';
import { transformTomlToMd, transformMdToToml } from './transformers.js';
import { calculateChecksum } from './utils.js';

// --- Configuration ---
const GEMINI_DIR = '.gemini/commands';
const ANTIGRAVITY_DIR = '.agent/workflows';

// --- Types ---
type Direction = 'TOML->MD' | 'MD->TOML';

interface LogEntry {
	id: string;
	timestamp: string;
	direction: Direction;
	filename: string;
	status: 'success' | 'error' | 'skipped';
	message?: string;
}

// --- Utilities ---

const getTimestamp = (): string => {
	return new Date().toLocaleTimeString();
};

// --- Transformers ---

// (Transformers imported from ./transformers.js)


// --- UI Components ---

const App = () => {
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [status, setStatus] = useState<string>('Initializing...');

	const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
		setLogs((prev) => {
			const newLog: LogEntry = {
				id: crypto.randomUUID(),
				timestamp: getTimestamp(),
				...entry,
			};
			return [newLog, ...prev].slice(0, 10);
		});
	}, []);

	const handleSync = useCallback(
		async (filePath: string) => {
			const fileName = path.basename(filePath);
			const ext = path.extname(fileName);
			const relativePath = path.relative(process.cwd(), filePath);
            
            // Determine direction based on file extension and path
            let direction: Direction | null = null;
            if (relativePath.startsWith(GEMINI_DIR) && ext === '.toml') {
                direction = 'TOML->MD';
            } else if (relativePath.startsWith(ANTIGRAVITY_DIR) && ext === '.md') {
                direction = 'MD->TOML';
            } else {
                return; // Ignore other files
            }

			try {
				const sourceContent = await fs.readFile(filePath, 'utf-8');
				let targetContent = '';
				let targetPath = '';

				if (direction === 'TOML->MD') {
					targetContent = transformTomlToMd(sourceContent);
					targetPath = path.join(ANTIGRAVITY_DIR, path.basename(fileName, '.toml') + '.md');
				} else {
					targetContent = transformMdToToml(sourceContent);
					targetPath = path.join(GEMINI_DIR, path.basename(fileName, '.md') + '.toml');
				}

				// Loop Prevention: Check if target exists and is identical
				if (await fs.pathExists(targetPath)) {
					const currentTargetContent = await fs.readFile(targetPath, 'utf-8');
					if (calculateChecksum(currentTargetContent) === calculateChecksum(targetContent)) {
						// Content is identical, skip write
						// Optional: Log skip for debugging, or keep silent to avoid noise
						// addLog({ direction, filename: fileName, status: 'skipped', message: 'Identical content' });
						return;
					}
				}

				await fs.outputFile(targetPath, targetContent);
				addLog({ direction, filename: fileName, status: 'success' });
			} catch (error) {
				addLog({
					direction,
					filename: fileName,
					status: 'error',
					message: (error as Error).message,
				});
			}
		},
		[addLog]
	);

	useEffect(() => {
		const watcher = chokidar.watch([GEMINI_DIR, ANTIGRAVITY_DIR], {
			ignored: ['**/.DS_Store', '**/.git/**'], // Only ignore specific system/git files
			persistent: true,
            ignoreInitial: false // This ensures initial sync happens on startup
		});

		watcher.on('ready', () => {
			setStatus('🟢 Watching');
		});

		watcher.on('add', (filePath) => handleSync(filePath));
		watcher.on('change', (filePath) => handleSync(filePath));

		return () => {
			watcher.close();
		};
	}, [handleSync]);

	return (
		<Box flexDirection="column" padding={1}>
			<Box borderStyle="round" borderColor="cyan" flexDirection="column" paddingLeft={1} paddingRight={1}>
				<Text bold color="green">
					Gemini-Antigravity Sync CLI
				</Text>
				<Text>{status}</Text>
			</Box>

			<Box marginTop={1} marginBottom={1} flexDirection="column">
				<Text underline>Activity Log</Text>
				<Static items={logs}>
					{(log) => (
						<Box key={log.id}>
							<Text color="gray">[{log.timestamp}] </Text>
							<Text
								color={
									log.status === 'error'
										? 'red'
										: log.direction === 'TOML->MD'
										? 'blue'
										: 'magenta'
								}
							bold
							>
								{log.direction === 'TOML->MD' ? 'TOML ➔ MD ' : 'MD ➔ TOML '}
							</Text>
							<Text> {log.filename} </Text>
							{log.status === 'error' && <Text color="red">Error: {log.message}</Text>}
                            {log.status === 'skipped' && <Text color="yellow">(Skipped)</Text>}
						</Box>
					)}
				</Static>
			</Box>

			<Text color="gray">Press Ctrl+C to exit</Text>
		</Box>
	);
};

const run = () => {
    // Ensure directories exist
    fs.ensureDirSync(GEMINI_DIR);
    fs.ensureDirSync(ANTIGRAVITY_DIR);
	render(<App />);
};

run();
