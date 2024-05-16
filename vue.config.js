const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:2000/',
        changeOrigin: true,
      },
    },
  },
};