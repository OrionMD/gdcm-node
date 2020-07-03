const { gdcmconv } = require('../index')();
const fs = require('fs-extra');
const path = require('path');

const dirPath = path.resolve(__dirname, 'data');
const outputPath = path.join(dirPath, 'output');

const dicomFiles = ['1.dcm', '2.dcm', '3.dcm'];
const nonDicomFiles = ['non-dicom.txt'];

beforeAll(() => {
  return fs.ensureDir(outputPath);
});

afterAll(() => {
  return fs.remove(outputPath);
});

test('Convert all DICOM files to raw', () => {
  return Promise.all(
    dicomFiles.map((file) => {
      const inputFile = path.join(dirPath, file);
      const outputFile = path.join(outputPath, file + '.out');
      return gdcmconv({ args: ['--raw', inputFile, outputFile] });
    })
  );
});

test('Error on non-dicom', () => {
  return Promise.all(
    nonDicomFiles.map((file) => {
      const inputFile = path.join(dirPath, file);
      const outputFile = path.join(outputPath, file + '.out');
      gdcmconv({ args: ['--raw', inputFile, outputFile] }).catch((err) => {
        expect(err).not.toBeNull();
      });
    })
  );
});
