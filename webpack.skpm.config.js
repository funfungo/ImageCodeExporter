module.exports = function (config) {
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  config.resolve.alias.fs = '@skpm/fs';
  config.module.rules.push({
    test: /\.(html)$/,
    use: [{
        loader: '@skpm/extract-loader'
      },
      {
        loader: 'html-loader',
        options: {
          attrs: ['img:src', 'link:href'],
          interpolate: true
        }
      }
    ]
  });
  config.module.rules.push({
    test: /\.(css)$/,
    use: [{
        loader: '@skpm/extract-loader'
      },
      {
        loader: 'css-loader'
      }
    ]
  });
};
