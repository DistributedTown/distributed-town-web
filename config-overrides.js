/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const webpack = require('webpack');
const { alias } = require('react-app-rewire-alias');

module.exports = {
  webpack: (configuration) => {
    configuration.resolve.fallback = {
      url: require.resolve('url'),
      assert: false,
      buffer: require.resolve('buffer'),
    };

    configuration.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );
    const modifiedConfig = alias({
      '@dito-utils': path.resolve(__dirname, './src/utils'),
      '@dito-api': path.resolve(__dirname, './src/api'),
      '@dito-components': path.resolve(__dirname, './src/components'),
      '@dito-auth': path.resolve(__dirname, './src/auth'),
      '@dito-hooks': path.resolve(__dirname, './src/hooks'),
      '@dito-store': path.resolve(__dirname, './src/store'),
    })(configuration);
    return modifiedConfig;
  },
};
