const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { platform, BINARIES } = require('./src/check-platform')();

const binariesToKeep = ['gdcmconv'];

const installedAsModule = path.basename(path.resolve(__dirname, '..')) === 'node_modules';

Object.keys(BINARIES).forEach(os => {
  // on our platform, delete unnecessary binaries. on other platforms, delete all binaries
  if (os == platform) {
    const files = fs.readdirSync(BINARIES[os]);
    files.forEach(file => {
      const filename = path.basename(file, '.exe');
      if (!binariesToKeep.includes(filename)) {
        const filePath = path.resolve(BINARIES[os], file);
        if (fs.accessSync(filePath) === undefined) {
          if (installedAsModule) {
            fs.unlinkSync(filePath);
          } else {
            console.log('Delete', filePath);
          }
        }
      }
    });
  } else {
    const dirPath = path.resolve(BINARIES[os], '..');
    if (installedAsModule) {
      rimraf.sync(dirPath);
    } else {
      console.log('Delete', dirPath);
    }
  }
});