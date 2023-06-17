export default {
  input: 'lib/index.js',
  output: {
    name: 'apollo-cache-persist',
    file: 'lib/bundle.umd.js',
    format: 'umd',
    sourcemap: true,
    exports: 'named',
  },
  onwarn,
};

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
