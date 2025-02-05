import { createPath, showDir, stepBack } from './navigation.js';
import { reader, creator, removeFileOrFolder, renameFileOrFolder } from './fileSystem.js';

export const commands = async (line) => {
  const command = line.trim().split(' ');

  switch (command[0]) {
    case 'cd':
      await createPath(line.slice(2).trim());
      break;
    case 'ls':
      await showDir();
      break;
    case 'up':
      await stepBack();
      break;
    case '.exit':
      break;
    case 'help':
      console.log('opening help.....'); //TODO: implement help
      break;
    case 'cat':
      await reader(line);
      break;
    case 'add':
      await creator(line);
      break;
    case 'mkdir':
      await creator(line);
      break;
    case 'rm':
      await removeFileOrFolder(line);
      break;
    case 'rn':
      await renameFileOrFolder(line);
      break;
    default:
      console.log(
        `\x1b[90mUnknown operation \x1b[91m${command[0]} \n\x1b[36m(note: you can check the available commands by sending the command "help")\x1b[33m\n\x1b[37m\n\x1b[33mPlease try again!\x1b[0m`
      );
  }
};
