const { gdcmconv } = require('..')();
const fs = require('fs-extra');
const path = require('path');

const dirPath = path.resolve(__dirname, 'data');
const outputPath = path.join(dirPath, 'output');

// const start = new Date();
// const tick = setInterval(
//   () => console.log('hey', (new Date().getTime() - start.getTime()) / 1000),
//   200
// );

afterAll(() => {
  // clearInterval(tick);
  return fs.remove(outputPath);
});

test('Convert all DICOM files in directory to raw', async () => {
  await fs.remove(outputPath); // function should create outputPath if it doesn't exist
  return new Promise((resolve, reject) => {
    gdcmconv({ args: ['--raw', '--directory', dirPath, outputPath] }, (err, output) => {
      expect(err).toBe(null);
      const successes = output.filter(o => o.status === 'success');
      const failures = output.filter(o => o.status === 'error');
      expect(successes.length).toBe(3);
      expect(failures.length).toBe(2);
      return resolve();
    });
  });
});

test('Try to convert non-existent directory', () => {
  return new Promise((resolve, reject) => {
    gdcmconv({ args: ['--raw', '--directory', './not-real', outputPath] }, (err, output) => {
      expect(err).not.toBeFalsy();
      return resolve();
    });
  });
});
