const path = require('path');
const os = require('os');

const platform = os.platform();

const SUPPORTED_PLATFORMS = [
  'win32',
  'win64',
  'darwin', // macOS, OSX
  'linux',
];

const BINARIES = {
  win32: path
    .resolve(__dirname, '..', 'lib', 'gdcm', 'GDCM-2.8.7-Windows-x86_64', 'bin')
    .replace('app.asar', 'app.asar.unpacked'),
  win64: path
    .resolve(__dirname, '..', 'lib', 'gdcm', 'GDCM-2.8.7-Windows-x86_64', 'bin')
    .replace('app.asar', 'app.asar.unpacked'),
  darwin: path
    .resolve(__dirname, '..', 'lib', 'gdcm', 'GDCM-2.8.7-Darwin-x86_64', 'bin')
    .replace('app.asar', 'app.asar.unpacked'),
  linux: path
    .resolve(__dirname, '..', 'lib', 'gdcm', 'GDCM-2.8.7-Linux-x86_64', 'bin')
    .replace('app.asar', 'app.asar.unpacked'),
};

const binaryPath = BINARIES[platform];

module.exports = () => {
  const supported = SUPPORTED_PLATFORMS.includes(platform);
  if (!supported) throw new Error(`The current platform "${platform}" is not supported.`);
  return {
    platform,
    BINARIES,
    binaryPath,
  };
};
