/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    '@dito-store': path.resolve(__dirname, './src/store'),
    react: path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom'),
    '@mui/material': path.resolve('./node_modules/@mui/material'),
    '@emotion/react': path.resolve('./node_modules/@emotion/react'),
    '@emotion/styled': path.resolve('./node_modules/@emotion/styled'),
    'react-router-dom': path.resolve('./node_modules/react-router-dom'),
  })
);
