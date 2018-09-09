const { gdcmconv } = require('../index')();
const fs = require('fs-extra');
const path = require('path');

const dirPath = path.resolve(__dirname, 'data');
const outputPath = path.join(dirPath, 'output');

const dicomFiles = fs.readdirSync(path.join(dirPath, 'large'));

fs.ensureDirSync(outputPath);

const start = new Date();
console.log('start', start.getTime());
const tick = setInterval(
  () => console.log('hey', (new Date().getTime() - start.getTime()) / 1000),
  200
);
// Promise.all(
//   dicomFiles.map(file => {
//     const inputFile = path.join(dirPath, 'large', file);
//     const outputFile = path.join(outputPath, file + '.out');
//     return new Promise((resolve, reject) => {
//       gdcmconv({ args: ['--raw', inputFile, outputFile] }, (err, output) => {
//         if (err) reject(err);
//         console.log('done', file);
//         return resolve();
//       });
//     });
//   })
// );
const inputDir = path.join(dirPath, 'large');
const outputDir = path.join(outputPath, 'largeout');
return new Promise((resolve, reject) => {
  gdcmconv({ args: ['--raw', '--directory', inputDir, outputDir] }, (err, output) => {
    if (err) reject(err);
    console.log('done', output);
    return resolve();
  });
})
  .then(() => {
    console.log('done all', (new Date().getTime() - start.getTime()) / 1000);
    clearInterval(tick);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    clearInterval(tick);
    process.exit();
  });
