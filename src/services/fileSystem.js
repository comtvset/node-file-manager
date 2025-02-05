import { currentlyPaths } from './navigation.js';
import {
  readFile,
  access,
  constants,
  readdir,
  writeFile,
  mkdir,
  rm,
} from 'node:fs/promises';
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
    currentlyPaths();
  }
};

export const creator = async (line) => {
  const currentDir = await currentlyPaths('notShow');
  const command = line.split(' ')[0].trim();
  const type = command === 'add' ? line.slice(3).trim() : line.slice(6).trim();
  const targetPathFile = join(currentDir, type);

  const entity = command === 'add' ? 'file' : 'folder';

  try {
    const files = await readdir(currentDir);

    if (!type) {
      throw new Error(`No ${entity} specified`);
    }

    if (files.includes(type)) {
      throw new Error(`${entity} already exists`);
    }

    if (/[\\/:\*\?"<>|]/.test(type)) {
      throw new Error(
        `${entity} name can't include symbols: \\ / : * ? " < > |`
      );
    }

    if (command === 'add') {
      writeFile(targetPathFile, '', 'utf8');
    }

    if (command === 'mkdir') {
      mkdir(targetPathFile, { recursive: true });
    }

    console.log(
      `\x1b[36m${entity} \x1b[33m${type}\x1b[0m \x1b[36mwas created\x1b[0m`
    );
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};

export const remove = async (line) => {
  const currentDir = await currentlyPaths('notShow');
  const file = line.slice(2).trim();
  const fileToRemovePath = join(currentDir, file);

  const entity = 'File';

  try {
    const files = await readdir(currentDir);

    if (file === '') {
      throw new Error(`No file or folder specified for deletion`);
    }

    if (!files.includes(file)) {
      throw new Error(`${file} does not exist`);
    }

    await rm(fileToRemovePath, { recursive: true, force: true });

    console.log(
      `\x1b[36m${entity} \x1b[33m${file}\x1b[0m \x1b[36mwas deleted\x1b[0m`
    );
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};
