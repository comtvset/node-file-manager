 cd                               Moves forward to the specified directory
                                  example: cd myFolder

 up                               Moves one level up in the directory structure
                                  example: up myFolder

 cat <file>                       Reads and displays the content of a file
                                  example: cat myDocument.txt

 add <file>                       Creates a new file with the specified name
                                  example: add myFile.txt

 mkdir <dir>                      Creates a new directory with the specified name
                                  example: mkdir myFolder

 rm <file>                        Deletes a file or directory
                                  example: rm myFile.txt or rm myFolder

 rn <oldName> <newName>           Renames a file or directory
                                  example: rn oldFolder newFolder or rn "old Folder" "new Folder"

 cp <path> <destination>          Copies a file or directory to a new location
                                  example: cp C:\Users\User\copyFile.txt C:\Users\User\newFolder

 mv <path> <destination>          Moves a file or directory to a new location
                                  example: mv "C:\Users\User\moveFile.txt" "C:\Users\User\new Folder"

 os --EOL                         Display the default End-Of-Line sequence for the current OS

    --cpus                        Show information about available CPU cores

    --homedir                     Show the path to the home directory

    --username                    Show the current user's name

    --architecture                Display the CPU architecture of the system

 hash <path>                      Display the hash of the specified file
                                  example: hash C:\Users\User\checkFile.txt

 compress <path> <destination>    Compress the specified file to the destination path
                                  example: compress C:\Users\User\compressFile.txt C:\Users\User\newFolder\nameFile

 decompress <path> <destination>  Decompress the specified file to the destination path
                                  example: decompress "C:\Users\User\my compress file.jpg.br" "C:\Users\User\new folder\name file"

 ls                               Lists the contents of the current directory

 help                             Displays this help message

.exit                             Exits the program