import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { startSession } from './services/startSession.js';

export const runFileManager = () => {
  const args = process.argv;
  let user = args.find((arg) => arg.startsWith('--username='))?.slice(11) || '';

  const rl = readline.createInterface({ input, output });

  if (!user) {
    rl.question('> Please, write your name: ').then((answer) => {
      user = answer.trim() || 'Anonymous';
      startSession(user, rl);
    });
  } else {
    startSession(user, rl);
  }
};
