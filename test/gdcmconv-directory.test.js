const { gdcmconv } = require('..')({ verbose: true });
const fs = require('fs-extra');
const path = require('path');

const dirPath = path.resolve(__dirname, 'data');
const outputPath = path.join(dirPath, 'output');

afterAll(() => {
  return fs.remove(outputPath);
});

test('Convert all DICOM files in directory to raw', async () => {
  await fs.remove(outputPath); // function should create outputPath if it doesn't exist
  const output = await gdcmconv({
    args: ['--raw', '--directory', dirPath, outputPath],
  });

  const successes = output.filter((o) => o.status === 'success');
  const failures = output.filter((o) => o.status === 'error');
  expect(successes.length).toBe(3);
  expect(failures.length).toBeGreaterThanOrEqual(1);
  return successes;
}, 10000);

// test('Convert all DICOM files in directory to raw using events instead of callback', async () => {
//   await fs.remove(outputPath); // function should create outputPath if it doesn't exist
//   return new Promise((resolve, reject) => {
//     const pool = gdcmconv({ args: ['--raw', '--directory', dirPath, outputPath] }, (err) => {
//       expect(err).toBe(null);
//     });
//     const errors = [];
//     const successes = [];
//     const failures = [];
//     pool.on('file-done', (data) => {
//       successes.push(data);
//     });
//     pool.on('file-error', (data) => {
//       // job specific errors with some additional info
//       failures.push(data);
//     });
//     pool.on('error', (job, error) => {
//       // raw errors from threads
//       errors.push(error);
//     });
//     pool.on('complete', (data) => {
//       expect(failures.length).toBeGreaterThanOrEqual(1);
//       expect(errors.length).toBeGreaterThanOrEqual(1);
//       expect(successes.length).toBe(3);
//       return resolve();
//     });
//   });
// });

// test('Try to convert non-existent directory', () => {
//   return new Promise((resolve, reject) => {
//     gdcmconv({ args: ['--raw', '--directory', './not-real', outputPath] }, (err, output) => {
//       expect(err).not.toBeFalsy();
//       return resolve();
//     });
//   });
// });
