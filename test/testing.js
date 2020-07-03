const { gdcmconv } = require('../index')();
const fs = require('fs-extra');
const path = require('path');

const dirPath = path.resolve(__dirname, 'data');
const outputPath = path.join(dirPath, 'output');

async function main() {
  await fs.remove(outputPath); // function should create outputPath if it doesn't exist
  const output = await gdcmconv({
    args: ['--raw', '--directory', dirPath, outputPath],
  });

  console.log('DONE');
  console.log(output);
}

main();
