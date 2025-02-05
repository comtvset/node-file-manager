import { commands } from './commands.js';
import { currentlyPaths } from './navigation.js';
export const startSession = (user, rl) => {
  const welcomeMessage = `\n\n\x1b[47m ⋇⋇⋇ \x1b[41m Welcome to the File Manager, ${user}! \x1b[47m ⋇⋇⋇ \x1b[0m\n\x1b[36m(note: to terminate the program, press "ctrl + c" or sent .exit)\x1b[33m\n\x1b[37m\n`;
  const farewellMessage = `\x1b[94mThank you for using File Manager, ${user}, goodbye!\x1b[0m`;

  const title = `\n\n\n\n
\x1b[31m███\x1b[32m─███\x1b[33m─█\x1b[34m───███\x1b[35m─────█\x1b[36m───█\x1b[31m─████\x1b[32m─█\x1b[33m──█\x1b[34m─████\x1b[35m─████\x1b[36m─███\x1b[31m─████
\x1b[32m█\x1b[33m────█\x1b[34m──█\x1b[35m───█\x1b[36m───────██\x1b[31m─██\x1b[32m─█\x1b[33m──█\x1b[34m─██\x1b[35m─█\x1b[36m─█\x1b[31m──█\x1b[32m─█\x1b[33m────█\x1b[34m───█\x1b[35m──█
\x1b[36m███\x1b[31m──█\x1b[32m──█\x1b[33m───███\x1b[34m─███\x1b[35m─█\x1b[36m─█\x1b[31m─█\x1b[32m─████\x1b[33m─█\x1b[34m─██\x1b[35m─████\x1b[36m─█\x1b[31m─██\x1b[32m─███\x1b[33m─████
\x1b[34m█\x1b[35m────█\x1b[36m──█\x1b[31m───█\x1b[32m───────█\x1b[33m───█\x1b[34m─█\x1b[35m──█\x1b[36m─█\x1b[31m──█\x1b[32m─█\x1b[33m──█\x1b[34m─█\x1b[35m──█\x1b[36m─█\x1b[31m───█\x1b[32m─█\x1b[33m─
\x1b[34m█\x1b[35m───███\x1b[36m─███\x1b[31m─███\x1b[32m─────█\x1b[33m───█\x1b[34m─█\x1b[35m──█\x1b[36m─█\x1b[31m──█\x1b[32m─█\x1b[33m──█\x1b[34m─████\x1b[35m─███\x1b[36m─█\x1b[31m─█\x1b[0m
`;

  console.log(title);
  console.log(welcomeMessage);

  rl.setPrompt('> ');
  currentlyPaths();
  rl.prompt();

  rl.on('line', async (line) => {
    await commands(line);
    rl.prompt();

    if (line === '.exit') {
      rl.close();
      console.log(farewellMessage);
    }
  });

  rl.on('close', () => {
    console.log(farewellMessage);
    process.exit(0);
  });
};
