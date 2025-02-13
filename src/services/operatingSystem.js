import { platform, EOL, cpus, homedir, userInfo, arch } from 'node:os';
import { currentlyPaths } from './navigation.js';

export const osInformation = async (line) => {
  const lineArray = line.trim().split(' ').filter(Boolean);

  if (lineArray.length <= 1) {
    console.log(
      `\n\x1b[36mPlease specify a flag (e.g., --EOL, --cpus, --homedir, etc.)`
    );
    currentlyPaths();
    return;
  }

  const flag = lineArray[1];

  switch (flag) {
    case '--EOL':
      const osNames = { win32: 'Windows', linux: 'Linux', darwin: 'macOS' };
      console.log(
        `\n\x1b[35mDefault system End-Of-Line for ${
          osNames[platform()] || 'Unknown OS'
        }: \x1b[33m${JSON.stringify(EOL)}`
      );
      currentlyPaths();
      break;
    case '--cpus':
      const cpusArray = cpus();
      console.table(
        cpusArray.map((cpu) => ({
          Model: cpu.model,
          Rate: `${(cpu.speed / 1000).toFixed(2)} GHz`,
        }))
      );
      currentlyPaths();
      break;
    case '--homedir':
      console.log(`\n\x1b[35mHome directory: \x1b[33m${homedir}`);
      currentlyPaths();
      break;
    case '--username':
      const { username } = userInfo();
      console.log(`\n\x1b[35mUser name: \x1b[33m${username}`);
      currentlyPaths();
      break;
    case '--architecture':
      console.log(`\n\x1b[35mCPU architecture: \x1b[33m${arch}`);
      currentlyPaths();
      break;
    default:
      console.log(
        `\n\x1b[90mUnknown flag \x1b[91m${lineArray[1]} \n\x1b[36m(note: you can check the available flags by sending the command "help")\x1b[33m\n\x1b[37m\n\x1b[33mPlease try again!\x1b[0m`
      );
      currentlyPaths();
  }
};
