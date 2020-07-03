const crossSpawn = require('cross-spawn');
const path = require('path');
const { spawn, Pool, Worker } = require('threads');
const fs = require('fs-extra');
const pFilter = require('p-filter');

module.exports = (_options) => {
  const { command, platform, settings } = _options;

  const binaryString = path.join(platform.binaryPath, command);

  return async function wrapper(_options2 = {}) {
    let options = _options2;
    // let execString = `${binaryString}`;
    const env = Object.assign({}, process.env, settings.env || {});

    let { args } = options;
    if (!args) args = [];
    if (!Array.isArray(args)) {
      throw new Error('Parameter "args" must be array of strings');
    }

    /**
     * Check for --directory argument, if present, use a worker pool to process the whole directory.
     */
    if (args.includes('--directory') && command === 'gdcmconv') {
      // const workerPath = path.join(__dirname, 'worker.js');
      const inPath = args[args.length - 2];
      const outPath = args[args.length - 1];
      const pool = Pool(() => spawn(new Worker('./worker.js')));
      const output = [];

      // Check existence of in and out paths.
      if (!(await fs.pathExists(inPath))) {
        throw new Error('Input directory does not exist');
      }
      await fs.ensureDir(outPath);

      // Remove --directory arg, as this is not actually an argument in the gdcm lib.
      args.splice(args.indexOf('--directory'), 1);

      // Read files in input directory.
      const filenames = await fs.readdir(inPath);

      // Remove any subdirectories from file list.
      const flatFilenames = await pFilter(filenames, async (filename) => {
        const stat = await fs.stat(path.join(inPath, filename));
        return stat.isFile();
      });

      if (flatFilenames.length < 1) {
        return 'No files to process.';
      }

      // Add all files to the queue.
      flatFilenames.forEach((filename) => {
        const fileInPath = path.join(inPath, filename);
        const fileOutPath = path.join(outPath, filename);
        const args2 = args.slice();
        args2.splice(args2.length - 2, 2, fileInPath, fileOutPath);

        pool
          .queue(async (decompress) => {
            const result = await decompress({ command, args: args2 });
            return result;
          })
          .then(() => {
            output.push({
              inputFile: fileInPath,
              outputFile: fileOutPath,
              status: 'success',
            });
          })
          .catch((err) => {
            output.push({
              inputFile: fileInPath,
              outputFile: fileOutPath,
              status: 'error',
              error: err,
            });
          });
      });

      // Await results.
      await pool.settled();

      // Terminate worker pool.
      await pool.terminate();

      return output;
    }

    /**
     * If no --directory option, process a single file.
     */
    return new Promise((resolve, reject) => {
      if (options.verbose || settings.verbose) {
        console.log('Executing:', binaryString, args.join(' '));
      }

      const child = crossSpawn(binaryString, args, { env });
      let stdout = '';
      let stderr = '';
      // let combined = '';

      /**
       * Spawn will return a stream, but we want to just collect all the data and return it
       * when it's done for the basic-wrapper. For true streaming output, i.e. processes that
       * might take a while and have periodic updates (moving files, etc), use streaming-wrapper.
       */
      /* eslint no-return-assign: ["error", "except-parens"] */
      child.stdout.on('data', (data) => {
        stdout += data;
        // combined += data;
      });
      child.stderr.on('data', (data) => {
        stderr += data;
        // combined += data;
      });
      child.on('error', (err) => {
        console.log('Error', err);
        return reject(err);
      });
      child.on('close', (code) => {
        if (options.verbose || settings.verbose) {
          console.log('Process closed with code:', code);
        }

        if (code !== 0) {
          let error;
          if (stderr.length > 0) {
            error = stderr;
          } else {
            error = 'Unknown error, process exited with code ' + code;
          }
          return reject(error);
        }

        // Pass the combined stdout and stderr output to the parser, as sometimes the errors are
        // useful in determining what happened to a given file or block of output
        return resolve({
          stdout,
          stderr,
        });
      });
    });
  };
};
