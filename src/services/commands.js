import { createPath, listDirectory, stepBack } from './navigation.js';
import {
  readFileTxt,
  createFileOrDirectory,
  removeFileOrDirectory,
  renameFileOrDirectory,
  copyOrMoveFileOrDirectory,
} from './fileSystem.js';
import { help } from './help.js';
import { osInformation } from './operatingSystem.js';
import { calculateHash } from './calcHash.js';
import { encoding } from './encoding.js';
import { currentlyPaths } from './navigation.js';

export const commands = async (line) => {
  const command = line.trim().split(' ');

  switch (command[0]) {
    case 'cd':
      await createPath(line.slice(2).trim());
      break;
    case 'ls':
      await listDirectory();
      break;
    case 'up':
      await stepBack();
      break;
    case '.exit':
      break;
    case 'help':
      await help();
      break;
    case 'cat':
      await readFileTxt(line);
      break;
    case 'add':
      await createFileOrDirectory(line);
      break;
    case 'mkdir':
      await createFileOrDirectory(line);
      break;
    case 'rm':
      await removeFileOrDirectory(line);
      break;
    case 'rn':
      await renameFileOrDirectory(line);
      break;
    case 'cp':
      await copyOrMoveFileOrDirectory(line);
      break;
    case 'mv':
      await copyOrMoveFileOrDirectory(line);
      break;
    case 'os':
      await osInformation(line);
      break;
    case 'hash':
      await calculateHash(line);
      break;
    case 'compress':
      await encoding(line);
      break;
    case 'decompress':
      await encoding(line);
      break;
    default:
      console.log(
        `\n\x1b[90mUnknown operation \x1b[91m${command[0]} \n\x1b[36m(note: you can check the available commands by sending the command "help")\x1b[33m\n\x1b[37m\n\x1b[33mPlease try again!\x1b[0m`
      );
      currentlyPaths();
  }
};
