export const startSession = (user, rl) => {
  const welcomeMessage = `\n\n\n\n\x1b[36m⋇⋇⋇ Welcome to the File Manager, ${user}! ⋇⋇⋇\n\x1b[31m(note: to terminate the program, press "ctrl + c" or sent .exit)\x1b[33m\n\x1b[37m\n`;
  const farewellMessage = `\x1b[33mThank you for using File Manager, ${user}, goodbye!`;

  console.log(welcomeMessage);
  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', (line) => {
    rl.prompt();
    if (line === '.exit') {
      console.log(farewellMessage);
      rl.close();
    }
  });

  rl.on('close', () => console.log(farewellMessage));
};
