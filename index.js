const path = require('path');
const checkPlatform = require('./src/check-platform');
const basicWrapper = require('./src/basic-wrapper');

const platform = checkPlatform();

module.exports = (settings = {}) => {
  // Object.assign(settings, {
  //   loglevel: 'info',
  // });
  function getWrapper(command) {

    let wrapper;
    switch (command) {
      default:
        wrapper = basicWrapper({
          command,
          platform,
          settings,
        });
        break;
    }
    return wrapper;
  }

  return {
    gdcmconv: getWrapper('gdcmconv'),
    platform,
  };
};
