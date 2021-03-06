module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  plugins: [
    ['@babel/plugin-transform-runtime'],
    ['babel-plugin-transform-typescript-metadata'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],

  ],
};
