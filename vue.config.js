const path = require('path')

module.exports = {
  pages: {
    index: {
      entry: path.join(__dirname, 'src', 'frontend', 'main.js')
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src', 'frontend')
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 9000,
    compress: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:3000'
      }
    }
  }
}
