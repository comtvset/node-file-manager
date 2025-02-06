import { readdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import path from 'node:path';
import { currentlyPaths } from './navigation.js';

export const help = async () => {
  const helpFilePath = path.join(import.meta.dirname, '../assets/help.md');

  try {
    const files = await readdir(dirname(helpFilePath));

    if (!files.includes('help.md')) {
      throw new Error('help.md does not exist');
    }

    console.log('\n\x1b[1m\x1b[96m');
    console.log(await readFile(helpFilePath, 'utf8'));
    console.log('\n\x1b[0m');
    currentlyPaths();
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};
