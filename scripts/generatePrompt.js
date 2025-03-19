// const fs = ('fs');
import fs from 'fs';

import path from 'path';
// const path = require('path');
import { execSync } from 'child_process';
import { minimatch } from 'minimatch';
// const { execSync } = require('child_process');
// const { minimatch } = require('minimatch');

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const ignoreFiles = [
    // "src/**",
    "src-tauri/**",
    "src/features/auth/**",
    "src/features/chat/**",
    "src/features/modals/**",
    "src/features/safety/**",
    // "src/features/terminal/**",
    "src/features/user/**",
    "src/components/**",
    "src/config/**",
    "src/styles/**",
    "src/types/**",
    "src/utils/**",
    "src-tauri/.gitignore",
    "src-tauri/Cargo.lock",
    "src-tauri/Cargo.toml",
    "src-tauri/build.rs",
    "src-tauri/icons/**",
    "src/vite-env.d.ts",
    "public/**",
    "data/**", 
    "src/assets/**",
    "index.html",
    "LICENSE", "README.md",
    "Makefile", "Dockerfile",
    "tsconfig.json", "esbuild.js",
    ".eslintrc.yaml", ".gitignore",
    "eslint.config.mjs",
    "forge.env.d.ts", "package.json",
    "*.json", "*.lock", "*.sh",
    "samconfig.toml",
    "*.config.ts",
    "*.config.js",
    "*.config.mjs",
    "scripts/**",
    "tests/**",
    "blog/**",
    // "docs/**",
    "static/**",
    "**/*.test.ts",
    "src/data/**",
    ".github/**",
];

function isIgnored(file) {
    return ignoreFiles.some(pattern => minimatch(file, pattern));
}

function getFileContent(file) {
    try {
        return fs.readFileSync(file, 'utf8');
    } catch (err) {
        console.log(`WARN: ${err.message}.\nSkip it`)
        return ''
    }
}

function listFiles() {
    return execSync('git ls-files --cached --others --exclude-standard').toString().split('\n').filter(Boolean);
}

function getTemplateContent(scriptDir) {
    return fs.readFileSync(path.join(scriptDir, 'prompt_template.txt'), 'utf8');
}

function getDirectoryStructure() {
    return execSync('tree --gitignore').toString();
}

function replaceStubs(template, content, structure) {
    return template.replace('[CONTENT]', content).replace('[STRUCTURE]', structure);
}

function writeToFile(filename, content) {
    fs.writeFileSync(filename, content, 'utf8');
}

function generateContent() {
    let content = '';
    const files = listFiles();
    files.forEach(file => {
        if (!isIgnored(file)) {
            const fileContent = getFileContent(file).trim()
            if (fileContent.length > 0) {
                content += `${file}:\n`;
                content += '```\n';
                content += fileContent + '\n';
                content += '```\n\n';
            }
        }
    });
    return content;
}

function main() {
    const scriptDir = path.dirname(__filename);
    const template = getTemplateContent(scriptDir);
    const content = generateContent();
    const structure = getDirectoryStructure();
    const prompt = replaceStubs(template, content, structure);
    
    writeToFile(path.join(scriptDir, 'prompt.txt'), prompt);

    (async () => {
        const clipboardy = await import('clipboardy');
        await clipboardy.default.write(prompt);
    })();
}

main();
