const gdcm = require('../index')();

module.exports = function (input, callback) {
  const { command, args } = input;
  const processor = gdcm[command];

  if (!processor) return callback(`Command ${command} not available`);

  return processor({ args }, (err, output) => {
    if (err) {
      if (err instanceof Error) throw err;
      throw new Error(err);
    }
    return callback(output);
  });
}
