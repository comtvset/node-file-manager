import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream';
import { currentlyPaths } from './navigation.js';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

export const encoding = async (line) => {
  let arg1 = null;
  let arg2 = null;

  try {
    const lineArray = line.trim().split(' ').filter(Boolean);
    const command = lineArray[0];

    const regexCompress = /^compress\s+"(.+)"\s+"(.+)"$/;
    const regexDecompress = /^decompress\s+"(.+)"\s+"(.+)"$/;
    const match =
      command === 'compress'
        ? line.match(regexCompress)
        : line.match(regexDecompress);

    if (match) {
      arg1 = match[1];
      arg2 = match[2];
    } else {
      arg1 = lineArray[1];

      if (!lineArray[2] || lineArray[3]) {
        throw new Error(`"${command}" command requires two arguments`);
      }
      arg2 = lineArray[2];
    }

    const files = await readdir(path.dirname(arg1));

    if (!files.includes(path.basename(arg1))) {
      throw new Error(`${arg1} does not exist!`);
    }

    if (command === 'compress') {
      const path_to_destination = arg2
        .split(`${path.sep}`)
        .slice(0, -1)
        .join(`${path.sep}`);

      await mkdir(path_to_destination, {
        recursive: true,
      });

      const extension = path.extname(arg1);

      const source = createReadStream(arg1);
      const gzip = createBrotliCompress();
      const compressFile = `${path.basename(arg2)}${extension}.br`;

      const destination = createWriteStream(
        `${path_to_destination}${path.sep}${compressFile}`
      );

      pipeline(source, gzip, destination, (err) => {
        if (err) {
          console.error('\x1b[31m>>> Failed to compress >>>\x1b[0m', err);
        } else {
          console.log('\x1b[32mCompression successful!\x1b[0m');
        }
        currentlyPaths();
      });
    }

    if (command === 'decompress') {
      const path_to_destination = arg2
        .split(`${path.sep}`)
        .slice(0, -1)
        .join(`${path.sep}`);

      await mkdir(path_to_destination, {
        recursive: true,
      });

      const source = createReadStream(arg1);
      const gzip = createBrotliDecompress();
      const unCompressFile = `${path.basename(arg1, '.br')}`;

      const destination = createWriteStream(
        `${path_to_destination}${path.sep}${unCompressFile}`
      );

      pipeline(source, gzip, destination, (err) => {
        if (err) {
          console.error('\x1b[31m>>> Failed to decompress >>>\x1b[0m', err);
        } else {
          console.log('\x1b[32mDecompression successful!\x1b[0m');
        }
        currentlyPaths();
      });
    }
  } catch (error) {
    console.log(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};
