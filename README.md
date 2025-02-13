# node-file-manager

 ![](https://github.com/comtvset/node-file-manager/blob/develop/src/assets/cover.png)

The program is started by npm-script `npm run` start in following way:

```bash

npm  run  start  --  --username=your_username

```

or

```bash

npm  run  start

```

### Available commands:

| command    | flag             | description                                                 | example                                                                                   |
| ---------- | ---------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| cd         |                  | Moves forward to the specified directory                    | `cd myFolder`                                                                             |
| up         |                  | Moves one level up in the directory structure               | `up myFolder`                                                                             |
| cat        |                  | Reads and displays the content of a file                    | `cat myDocument.txt`                                                                      |
| add        |                  | Creates a new file with the specified name                  | `add myFile.txt`                                                                          |
| mkdir      |                  | Creates a new directory with the specified name             | `mkdir myFolder`                                                                          |
| rm         |                  | Deletes a file or directory                                 | `rm myFile.txt` or `rm myFolder`                                                          |
| rn         |                  | Renames a file or directory                                 | `rn oldFolder newFolder` or `rn "old Folder" "new Folder"`                                |
| cp         |                  | Copies a file or directory to a new location                | `cp C:\Users\User\copyFile.txt C:\Users\User\newFolder`                                   |
| mv         |                  | Moves a file or directory to a new location                 | `mv "C:\Users\User\moveFile.txt" "C:\Users\User\new Folder"`                              |
| os         | `--EOL`          | Display the default End-Of-Line sequence for the current OS |
| &nbsp;     | `--cpus`         | Show information about available CPU cores                  |
| &nbsp;     | `--homedir`      | Show the path to the home directory                         |
| &nbsp;     | `--username`     | Show the current user's name                                |
| &nbsp;     | `--architecture` | Display the CPU architecture of the system                  |
| hash       |                  | Display the hash of the specified file                      |
| compress   |                  | Compress the specified file to the destination path         | `compress C:\Users\User\compressFile.txt C:\Users\User\newFolder\nameFile`                |
| decompress |                  | Decompress the specified file to the destination path       | `decompress "C:\Users\User\my compress file.jpg.br" "C:\Users\User\new folder\name file"` |
| ls         |                  | Lists the contents of the current directory                 |
| help       |                  | Displays help message                                       |
| .exit      |                  | Exits the program                                           |
