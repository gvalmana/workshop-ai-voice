const { defineConfig } = require('@vue/cli-service')
const dependencies = require('./package.json').dependencies
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

const publicPath = process.env.VUE_APP_DOMAIN
const { proyect_name, proyect_port, prefixEnvironment } = require('./config')

let exposes = {
  './microfront': './src/micro/mount',
}

if (process.env.VUE_APP_ENVIROMENT == 'local') {
  exposes = {}
}

const plugins = [
  new ModuleFederationPlugin({
    name: proyect_name,
    filename: 'remoteEntry.js',
    remotes: {
      app_alegra_commons: `app_alegra_commons@https://${prefixEnvironment}alegra-commons.alegra.com/remoteEntry.js?v=[('0' + (new Date().getMonth()+1)).slice(-2)+('0'+new Date().getDate()).slice(-2)+new Date().getHours()]`,
    },
    exposes,
    shared: {
      'core-js': { singleton: true, requiredVersion: '3.8.3' },
      'lodash-es': { singleton: true, requiredVersion: '4.17.21' },
      pinia: { singleton: true, requiredVersion: '2.0.14' },
      vue: { singleton: true, requiredVersion: '3.4.21' },
      'vue-router': { singleton: true, requiredVersion: '4.3.0' },
      '@alegradev/smile-ui-next': dependencies['@alegradev/smile-ui-next'],
    },
  }),
  new ExternalTemplateRemotesPlugin(),
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  }),
]

const devServer = {
  port: proyect_port,
  host: 'dev.alegra.com',
  historyApiFallback: true,
}

if (process.env.VUE_APP_ENVIROMENT === 'local') {
  devServer.https = {
    key: fs.readFileSync(path.resolve('./.cert/key.pem')),
    cert: fs.readFileSync(path.resolve('./.cert/cert.pem')),
  }
}

module.exports = defineConfig({
  assetsDir: 'template-assets',
  publicPath: publicPath ? publicPath : 'auto',
  transpileDependencies: true,
  configureWebpack: {
    devServer,
    optimization: {
      splitChunks: false,
    },
    plugins,
  },
})
