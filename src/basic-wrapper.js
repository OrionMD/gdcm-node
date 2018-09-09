const spawn = require('cross-spawn');
const path = require('path');
const { Pool } = require('threads');
const fs = require('fs-extra');

module.exports = _options => {
  const { command, platform, settings } = _options;

  const binaryString = path.join(platform.binaryPath, command);

  return function basicWrapper(_options2, _callback) {
    let callback = _callback;
    let options = _options2;
    // let execString = `${binaryString}`;
    const env = Object.assign({}, process.env, settings.env || {});

    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (!callback) {
      throw new Error('Callback function required');
    }

    let { args } = options;
    if (!args) args = [];
    if (!Array.isArray(args)) {
      return callback('Parameter "args" must be array of strings');
    }

    /**
     * Check for --directory argument, if present, use a worker pool to process the whole directory.
     */
    if (args.includes('--directory') && command === 'gdcmconv') {
      const modulePath = path.join(__dirname, 'worker.js');
      const inPath = args[args.length - 2];
      const outPath = args[args.length - 1];
      const pool = new Pool();

      // check existence of in and out paths
      fs.pathExists(inPath)
        .then(exists => {
          if (!exists) throw new Error('Input directory does not exist');
        })
        .then(() => fs.ensureDir(outPath))
        // remove --directory arg
        .then(() => {
          args.splice(args.indexOf('--directory'), 1);
        })
        // read files in input directory
        .then(() => fs.readdir(inPath))
        // remove any subdirectories from file list
        .then(filenames => {
          return Promise.all(
            filenames.map(
              filename =>
                new Promise((resolve, reject) => {
                  fs.stat(path.join(inPath, filename))
                    .then(stat => resolve(stat.isFile() ? filename : false))
                    .catch(reject);
                })
            )
          ).then(filenames => filenames.filter(f => f));
        })
        .then(filenames => {
          if (filenames.length < 1) return callback(null, 'No files to process');

          const processingResults = [];
          pool
            .on('error', function(job, error) {
              // console.error('Directory processing error:', error);
              // return callback(error);
            })
            .on('finished', function() {
              // console.log('Everything done, shutting down the thread pool.');
              pool.killAll();
              callback(null, processingResults);
            });
          filenames.forEach(filename => {
            const fileInPath = path.join(inPath, filename);
            const fileOutPath = path.join(outPath, filename);
            let args2 = args.slice();
            args2.splice(args2.length - 2, 2, fileInPath, fileOutPath);
            // console.log(`Starting thread with command ${command} and args: ${args2}`);
            pool
              .run(modulePath)
              .send({
                command,
                args: args2,
              })
              .on('done', function(job) {
                // console.log('Job done:', job);
                processingResults.push({
                  file: fileInPath,
                  status: 'success',
                });
              })
              .on('error', function(error) {
                // console.error('Job errored:', job);
                processingResults.push({
                  file: fileInPath,
                  status: 'error',
                  message: error.message,
                });
              });
          });
        })
        .catch(err => {
          return callback(err);
        });

      return pool;
    } else {
      /**
       * If no --directory option, process a single file
       */
      if (options.verbose || settings.verbose) {
        console.log('Executing:', binaryString, args.join(' '));
      }

      const child = spawn(binaryString, args, { env });
      let stdout = '';
      let stderr = '';
      // let combined = '';

      /**
       * Spawn will return a stream, but we want to just collect all the data and return it
       * when it's done for the basic-wrapper. For true streaming output, i.e. processes that
       * might take a while and have periodic updates (moving files, etc), use streaming-wrapper.
       */
      /* eslint no-return-assign: ["error", "except-parens"] */
      child.stdout.on('data', data => {
        stdout += data;
        // combined += data;
      });
      child.stderr.on('data', data => {
        stderr += data;
        // combined += data;
      });
      child.on('error', callback);
      child.on('close', code => {
        if (options.verbose || settings.verbose) {
          console.log('Process closed with code:', code);
        }
        let error = null;

        if (code && code !== 0) {
          if (stderr.length > 0) {
            error = stderr;
          } else {
            error = 'Unknown error, process exited with code ' + code;
          }
        }

        // Pass the combined stdout and stderr output to the parser, as sometimes the errors are
        // useful in determining what happened to a given file or block of output
        return callback(error, {
          stdout,
          stderr,
        });
      });
      return true;
    }
  };
};
