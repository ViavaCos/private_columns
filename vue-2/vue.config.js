const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost',
    port: 8080,
    historyApiFallback: true,
    allowedHosts: 'all' // 解决 Invalid Host header 报错
  }
})
