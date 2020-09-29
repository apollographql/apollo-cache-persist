module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'apollo3-cache-persist': '../src',
        },
        cwd: 'babelrc',
      },
    ],
  ],
};
