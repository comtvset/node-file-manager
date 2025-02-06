import { join } from 'node:path';
import path from 'node:path';
import * as os from 'node:os';
import { readdir, stat } from 'node:fs/promises';

const homeDir = os.homedir();
const baseDir = join(homeDir);
let currentDir = homeDir;

export const currentlyPaths = async (notShow) => {
  if (notShow) {
    console.log('');
  } else {
    console.log(`\n\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
  }

  return currentDir;
};

export const createPath = async (line) => {
  let getFilesCurrentDir;

  const readDir = async (dir) => {
    getFilesCurrentDir = await readdir(dir);
  };

  await readDir(baseDir);

  const folderArray = line.split(/[/\\]/).map((item) => item.trim());

  for (let i = 0; i < folderArray.length; i++) {
    await readDir(currentDir);

    if (!getFilesCurrentDir.includes(folderArray[i])) {
      if (folderArray[i] === '') {
        console.error(
          `\x1b[31m>>> Error: Directory name cannot be empty \x1b[0m\n\x1b[36m(note: you can check the directory with help "ls" command\x1b[0m`
        );
      } else {
        console.error(
          `\x1b[31m>>> Error: Directory \x1b[93m${folderArray[i]}\x1b[31m does not exist \n\x1b[36m(note: you can check the directory with help "ls" command\x1b[0m`
        );
      }
    } else {
      const myPath = path.resolve(currentDir, folderArray[i]);
      const stats = await stat(myPath);
      if (stats.isDirectory()) {
        currentDir = path.resolve(currentDir, folderArray[i]);
      } else {
        console.error(
          `\x1b[31m>>> Error, "${folderArray[i]}" is not a folder\x1b[0m`
        );
      }
    }
  }

  currentlyPaths();
};

export const listDirectory = async () => {
  const readDir = async (dir) => {
    const files = await readdir(dir, { withFileTypes: true });

    const sortFiles = files.sort((a, b) => {
      return a.isDirectory() === b.isDirectory() ? 0 : a.isDirectory() ? -1 : 1;
    });

    console.table(
      sortFiles.map((file) => ({
        Name: file.name,
        Type: file.isDirectory() ? 'directory' : 'file',
      }))
    );
  };
  await readDir(currentDir);
  currentlyPaths();
};

export const stepBack = async () => {
  const cut = currentDir
    .split(/[/\\]/)
    .map((item) => item.trim())
    .slice(0, -1)
    .toString()
    .replaceAll(',', '\\');

  if (cut.length <= 2) {
    currentDir = `${cut}\\`;
  } else {
    currentDir = cut;
  }

  currentlyPaths();
};
