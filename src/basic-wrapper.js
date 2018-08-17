const spawn = require('cross-spawn');
const path = require('path');

module.exports = (_options) => {
  const {
    command, platform, settings,
  } = _options;

  const binaryString = path.join(platform.binaryPath, command);

  return function basicWrapper(_options2, _callback) {
    let callback = _callback;
    let options = _options2;
    // let execString = `${binaryString}`;
    const env = settings.env || {};

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
    child.stdout.on('data', (data) => {
      stdout += data;
      // combined += data;
    });
    child.stderr.on('data', (data) => {
      stderr += data;
      // combined += data;
    });
    child.on('error', callback);
    child.on('close', (code) => {
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
  };
};
