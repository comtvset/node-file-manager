import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream';
import { currentlyPaths } from './navigation.js';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { PassThrough } from 'stream';
import { promisify } from 'util';
import fs from 'fs/promises';

export const encoding = async (line) => {
  const symbols = [
    '🤡',
    '🎲',
    '🤖',
    '😈',
    '💩',
    '🙈',
    '🌈',
    '🌞',
    '👽',
    '😉',
    '🤙',
    '👻',
  ];
  let arg1 = null;
  let arg2 = null;

  const pipelineAsync = promisify(pipeline);

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
      const pathToDestination = arg2
        .split(`${path.sep}`)
        .slice(0, -1)
        .join(`${path.sep}`);

      await mkdir(pathToDestination, {
        recursive: true,
      });

      const extension = path.extname(arg1);

      const source = createReadStream(arg1);
      const gzip = createBrotliCompress();
      const compressFile = `${path.basename(arg2)}${extension}.br`;

      const destination = createWriteStream(
        `${pathToDestination}${path.sep}${compressFile}`
      );

      let counter = 0;

      const interval = setInterval(() => {
        process.stdout.write('\x1B[?25l');
        const symbol = symbols[counter % symbols.length];
        process.stdout.write('\r' + symbol);
        counter++;
      }, 50);

      pipeline(source, gzip, destination, (err) => {
        if (err) {
          console.error('\n\x1b[31m>>> Failed to compress >>>\x1b[0m', err);
        } else {
          console.log('\n\x1b[32mCompression successful!\x1b[0m');
        }

        clearInterval(interval);
        currentlyPaths();
        process.stdout.write('\x1B[?25h> ');
      });
    }

    if (command === 'decompress') {
      const pathToDestination = arg2
        .split(`${path.sep}`)
        .slice(0, -1)
        .join(`${path.sep}`);

      const source = createReadStream(arg1);
      const gzip = createBrotliDecompress();

      const bufferStream = new PassThrough();

      const chunks = [];
      bufferStream.on('data', (chunk) => chunks.push(chunk));

      try {
        await pipelineAsync(source, gzip, bufferStream);
        const resultBuffer = Buffer.concat(chunks);

        const outputPath = path.join(
          pathToDestination,
          path.basename(arg1, '.br')
        );

        await mkdir(pathToDestination, {
          recursive: true,
        });
        await fs.writeFile(outputPath, resultBuffer);
        console.log('\x1b[32mDecompression successful!\x1b[0m');
      } catch (err) {
        console.error(
          '\x1b[31m>>> Decompression failed >>>\x1b[0m',
          err.message
        );
      } finally {
        currentlyPaths();
      }
    }
  } catch (error) {
    console.error(`\x1b[31m>>> Error: ${error.message} \x1b[0m`);
    currentlyPaths();
  }
};
