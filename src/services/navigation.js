import { join } from 'node:path';
import path from 'node:path';
import * as os from 'node:os';
import { readdir, stat } from 'node:fs/promises';

const homeDir = os.homedir();
const baseDir = join(homeDir);
let currentDir = homeDir;

export const currentlyPaths = () => {
  console.log(`\x1b[32mYou are currently in ${currentDir}\x1b[0m`);
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
        return console.error(
          `\x1b[31m>>> Error: Directory name cannot be empty \x1b[0m\n\x1b[36m(note: you can check the directory with help "ls" command\x1b[0m`
        );
      } else {
        return console.error(
          `\x1b[31m>>> Error: Directory \x1b[93m${folderArray[i]}\x1b[31m does not exist \n\x1b[36m(note: you can check the directory with help "ls" command\x1b[0m`
        );
      }
    } else {
      const myPath = path.resolve(currentDir, folderArray[i]);
      const stats = await stat(myPath);
      if (stats.isDirectory()) {
        currentDir = path.resolve(currentDir, folderArray[i]);
      } else {
        return console.error(
          `\x1b[31m>>> Error, "${folderArray[i]}" is not a folder\x1b[0m`
        );
      }
    }
  }

  currentlyPaths();
};

export const showDir = async () => {
  const readDir = async (dir) => {
    console.log(await readdir(dir));
  };
  await readDir(currentDir);
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
