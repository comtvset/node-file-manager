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
  cp,
  copyFile,
  stat,
} from 'node:fs/promises';
import { join } from 'node:path';
import path from 'node:path';

const note = `\n\x1b[36m(note: if folder or file name contains spaces, enclose it in double quotes)\nexample with double quotes: rn "old folder" "new name folder\nexample without double quotes: rn oldFolder newNameFolder"\x1b[33m\n\x1b[37m`;

export const readFileTxt = async (line) => {
  const currentDir = await currentlyPaths('notShow');

  const file = line.slice(4).trim();
  let fileToReadPath = join(currentDir, file);

  try {
    if (line.includes(':')) {
      fileToReadPath = line.slice(4);
    }
    if (!file) {
      throw new Error('No file specified!');
    }

    await access(fileToReadPath, constants.F_OK);
    console.log('\n\x1b[33m>>>\n\x1b[90m');
    console.log(await readFile(fileToReadPath, 'utf8'));
    console.log('\x1b[33m\n<<<\x1b[0m\n');
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};

export const createFileOrDirectory = async (line) => {
  const currentDir = await currentlyPaths('notShow');
  const command = line.split(' ')[0].trim();
  const type = command === 'add' ? line.slice(3).trim() : line.slice(6).trim();
  const targetPathFile = join(currentDir, type);

  const entity = command === 'add' ? 'file' : 'folder';

  try {
    const files = await readdir(currentDir);

    if (!type) {
      throw new Error(`No ${entity} specified!`);
    }

    if (files.includes(type)) {
      throw new Error(`${entity} already exists!`);
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
      `\x1b[36m${entity} \x1b[33m${type}\x1b[0m \x1b[36mwas created!\x1b[0m`
    );
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};

export const removeFileOrDirectory = async (line) => {
  const currentDir = await currentlyPaths('notShow');
  const file = line.slice(2).trim();
  const fileToRemovePath = join(currentDir, file);

  const entity = 'File/Folder';

  try {
    const files = await readdir(currentDir);

    if (file === '') {
      throw new Error(`No ${entity} specified for deletion!`);
    }

    if (!files.includes(file)) {
      throw new Error(`${file} does not exist!`);
    }

    await rm(fileToRemovePath, { recursive: true, force: true });

    console.log(
      `\x1b[36m${entity} \x1b[33m${file}\x1b[0m \x1b[36mwas deleted!\x1b[0m`
    );
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};

export const renameFileOrDirectory = async (line) => {
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

    const lineArray = line.trim().split(' ').filter(Boolean);

    if (match) {
      arg1 = match[1];
      arg2 = match[2].trim();
    } else {
      arg1 = lineArray[1];

      if (!lineArray[2] || lineArray[3]) {
        throw new Error(`"rn" command requires two arguments`);
      }
      arg2 = lineArray[2];
    }

    const type1 = join(currentDir, arg1);
    const type2 = join(currentDir, arg2);

    const entity = 'File/Folder';
    const files = await readdir(currentDir);

    if (file === '') {
      throw new Error(`No ${entity} specified for rename`);
    }

    if (!files.includes(arg1)) {
      throw new Error(`${entity} does not exist!`);
    }

    await rename(type1, type2);

    console.log(
      `\x1b[36m${entity} from\x1b[33m ${arg1} \x1b[36mto \x1b[33m${arg2}\x1b[0m \x1b[36mwas renamed!\x1b[0m`
    );
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m ${note}`);
    currentlyPaths();
  }
};

export const copyOrMoveFileOrDirectory = async (line) => {
  const currentDir = await currentlyPaths('notShow');

  let arg1 = null;
  let arg2 = null;

  try {
    const lineArray = line.trim().split(' ').filter(Boolean);
    const command = lineArray[0];

    if (line.length <= 4) {
      throw new Error(`"${command}" command requires two arguments`);
    }

    const regexCP = /^cp\s+"(.+)"\s+"(.+)"$/;
    const regexMV = /^mv\s+"(.+)"\s+"(.+)"$/;
    const match = command === 'cp' ? line.match(regexCP): line.match(regexMV);

    if (match) {
      arg1 = match[1];
      arg2 = match[2];
    } else {
      arg1 = lineArray[1];

      if (!lineArray[2] || lineArray[3]) {
        throw new Error(`"${command}" command requires two arguments`);
      }
      arg2 = lineArray[2];
    }

    const files = await readdir(path.dirname(arg1));

    if (!files.includes(path.basename(arg1))) {
      throw new Error(`${arg1} does not exist!`);
    }

    const stats = await stat(arg1);

    if (stats.isDirectory()) {
      if (command === 'cp') {
        await cp(arg1, `${arg2}${path.sep}${path.basename(arg1)}`, {
          recursive: true,
        });
        console.log(
          `\x1b[36mFolder \x1b[33m${path.basename(
            arg2
          )}\x1b[0m \x1b[36mwas coped!\x1b[0m`
        );
      }
      if (command === 'mv') {
        await cp(arg1, `${arg2}${path.sep}${path.basename(arg1)}`, {
          recursive: true,
        });
        await rm(arg1, { recursive: true });
        console.log(
          `\x1b[36mFolder \x1b[33m${path.basename(
            arg1
          )}\x1b[0m \x1b[36mwas moved!\x1b[0m`
        );
      }
    }

    if (stats.isFile()) {
      if (command === 'cp') {
        await mkdir(join(path.dirname(arg2), path.basename(arg2)), {
          recursive: true,
        });
        await copyFile(arg1, `${arg2}${path.sep}${path.basename(arg1)}`);

        console.log(
          `\x1b[36mFile \x1b[33m${path.basename(
            arg1
          )}\x1b[0m \x1b[36mwas coped!\x1b[0m`
        );
      }
      if (command === 'mv') {
        await mkdir(join(path.dirname(arg2), path.basename(arg2)), {
          recursive: true,
        });
        await copyFile(arg1, `${arg2}${path.sep}${path.basename(arg1)}`);
        await rm(arg1);
        console.log(
          `\x1b[36mFile \x1b[33m${path.basename(
            arg1
          )}\x1b[0m \x1b[36mwas moved!\x1b[0m`
        );
      }
    }

    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  } catch (error) {
    console.log(`\n\x1b[31m>>> Error: ${error.message} \x1b[0m ${note}`);
    currentlyPaths();
  }
};
