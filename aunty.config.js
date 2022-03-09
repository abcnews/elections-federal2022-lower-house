const fs = require('fs');
const path = require('path');

module.exports = {
  type: 'react',
  build: {
    entry: ['doc-block', 'editor', 'index', 'illustrations', 'polyfills', 'standalone']
  },
  serve: {
    hot: false
  },
  webpack: config => {
    config.devtool = 'source-map';

    // Stop `import()`-ed chunks from being split into `[name].js` and `vendors~[name].js`
    config.optimization = {
      ...(config.optimization || {}),
      splitChunks: {
        cacheGroups: {
          vendors: false
        }
      }
    };

    // Polyfill some node.js APIs via module resolution fallbacks
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      stream: require.resolve('stream-browserify')
    };

    return config;
  },
  deploy: [
    {
      to: '/www/res/sites/news-projects/<name>/<id>'
    },
    config => {
      fs.writeFileSync(
        path.join(__dirname, 'redirect', 'index.js'),
        `window.location = String(window.location).replace('/latest/', '/${config.id}/')`
      );

      return {
        ...config,
        from: 'redirect',
        to: '/www/res/sites/news-projects/<name>/latest'
      };
    }
  ]
};
