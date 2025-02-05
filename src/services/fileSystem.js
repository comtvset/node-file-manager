import { currentlyPaths } from './navigation.js';
import { readFile, access, constants } from 'node:fs/promises';
import { join, extname } from 'node:path';

export const reader = async (line) => {
  const currentDir = await currentlyPaths();
  const file = line.slice(4);
  let fileToReadPath = join(currentDir, file);

  try {
    if (line.includes(':')) {
      fileToReadPath = line.slice(4);
    }
    if (!file) {
      throw new Error('No file specified');
    }
    if (extname(fileToReadPath) !== '.txt') {
      throw new Error('Only .txt files can be read');
    }

    await access(fileToReadPath, constants.F_OK);
    console.log('\n\x1b[33m>>>\x1b[90m');
    console.log(await readFile(fileToReadPath, 'utf8'));
    console.log('\x1b[33m<<<\x1b[0m\n');
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
  }
};
