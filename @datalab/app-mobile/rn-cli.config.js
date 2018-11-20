// const blacklist = require('metro-config/src/defaults/blacklist');
// // const getConfig = require('metro-bundler-config-yarn-workspaces');

// module.exports = {
//   ...getConfig(__dirname),
//   blacklistRE: blacklist
// };

const blacklist = require('metro-config/src/defaults/blacklist');
const getWorkspaces = require('get-yarn-workspaces');
const path = require('path');
const workspaces = getWorkspaces(__dirname);
const alternateRoots = [path.resolve(__dirname), path.resolve(__dirname, '..', '..', 'node_modules')];

module.exports = {
  watchFolders: alternateRoots,
  resolver: {
    extraNodeModules: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native')
    },
    blacklistRE: blacklist(
      workspaces.map(
        workspacePath => `/${workspacePath.replace(/\//g, '[/\\\\]')}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`
      )
      // .concat([/react-native-git-upgrade\/.*/, /react-animated\/.*/])
    )
  }
};
