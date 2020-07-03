const gdcm = require('../index')();
const { expose } = require('threads/worker');

expose(async function (input) {
  const { command, args } = input;
  const processor = gdcm[command];

  if (!processor) throw new Error(`Command ${command} not available`);

  return processor({ args });
});
