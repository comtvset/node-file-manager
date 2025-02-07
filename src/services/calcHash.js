import { currentlyPaths } from './navigation.js';
import path from 'node:path';
import { pipeline } from 'stream/promises';
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import { readdir } from 'node:fs/promises';

export const calculateHash = async (line) => {
  const lineArray = line.trim().split(' ').filter(Boolean);

  if (lineArray.length <= 1) {
    console.log(`\n\x1b[36mPlease specify a path to file`);
    currentlyPaths();
    return;
  }

  try {
    const filePath = line.slice(5).trim();
    const targetFile = path.basename(filePath);
    const files = await readdir(path.dirname(filePath));

    if (!files.includes(targetFile)) {
      throw new Error(`${targetFile} does not exist!`);
    }

    const hash = createHash('sha256');
    await pipeline(createReadStream(filePath), hash);
    console.log(
      `\n\x1b[35mHash for file "${targetFile}"\x1b[35m: \x1b[33m${hash.digest(
        'hex'
      )}`
    );
    currentlyPaths();
  } catch (error) {
    console.log(`\n\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};
