/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    '@dito-utils': path.resolve(__dirname, './src/utils'),
    '@dito-api': path.resolve(__dirname, './src/api'),
    '@dito-components': path.resolve(__dirname, './src/components'),
    '@dito-auth': path.resolve(__dirname, './src/auth'),
    '@dito-hooks': path.resolve(__dirname, './src/hooks'),
    '@dito-store': path.resolve(__dirname, './src/store'),
  })
);
