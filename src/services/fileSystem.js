import { currentlyPaths } from './navigation.js';
import {
  readFile,
  access,
  constants,
  readdir,
  writeFile,
  mkdir,
  rm,
  rename,
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

export const removeFileOrFolder = async (line) => {
  const currentDir = await currentlyPaths('notShow');
  const file = line.slice(2).trim();
  const fileToRemovePath = join(currentDir, file);

  const entity = 'File/Folder';

  try {
    const files = await readdir(currentDir);

    if (file === '') {
      throw new Error(`No ${entity} specified for deletion`);
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

export const renameFileOrFolder = async (line) => {
  const note = `\n\x1b[36m(note: if folder or file name contains spaces, enclose it in double quotes)\nexample with double quotes: rn "old folder" "new name folder\nexample without double quotes: rn oldFolder newNameFolder"\x1b[33m\n\x1b[37m`;
  const currentDir = await currentlyPaths('notShow');

  let arg1 = null;
  let arg2 = null;

  try {
    if (line.length <= 4) {
      throw new Error(`"rn" command requires two arguments`);
    }

    const regex = /^rn\s+"(.+)"\s+"(.+)"$/;
    const match = line.match(regex);
    const file = line.slice(2).trim();

    const lineArray = line.split(' ');

    if (match) {
      arg1 = match[1];
      arg2 = match[2];
    } else {
      arg1 = line.split(' ')[1].trim();
      if (!lineArray[2] || lineArray[3]) {
        throw new Error(`"rn" command requires two arguments`);
      }
      arg2 = line.split(' ')[2].trim();
    }

    const type1 = join(currentDir, arg1);
    const type2 = join(currentDir, arg2);

    const entity = 'File/Folder';
    const files = await readdir(currentDir);

    if (file === '') {
      throw new Error(`No ${entity} specified for rename`);
    }

    if (!files.includes(arg1)) {
      throw new Error(`${entity} does not exist`);
    }

    await rename(type1, type2);

    console.log(
      `\x1b[36m${entity} from\x1b[33m ${arg1} \x1b[36mto \x1b[33m${arg2}\x1b[0m \x1b[36mwas renamed\x1b[0m`
    );
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m ${note}`);
    currentlyPaths();
  }
};
