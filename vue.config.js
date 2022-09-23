const { defineConfig } = require('@vue/cli-service')
const dependencies = require('./package.json').dependencies
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin

const { MFLiveReloadPlugin } = require('@module-federation/fmr')
const publicPath = process.env.VUE_APP_DOMAIN
const prefixEnvironment = process.env.VUE_APP_ENVIROMENT == 'production' ? '' : 'almost-'
const proyect_name = 'app_alegra_template'

const plugins = [
  new ModuleFederationPlugin({
    name: proyect_name,
    filename: 'remoteEntry.js',
    remotes: {
      app_alegra_commons: `app_alegra_commons@https://${prefixEnvironment}alegra-commons.alegra.com/remoteEntry.js`,
    },
    exposes: {
      './microfront': './src/micro/mount',
    },
    shared: {
      ...dependencies,
    },
  }),
]

if (process.env.VUE_APP_ENVIROMENT == 'local') {
  plugins.push(
    new MFLiveReloadPlugin({
      port: 1026, // the port your app runs on
      container: proyect_name, // the name of your app, must be unique
      standalone: false,
    })
  )
}

module.exports = defineConfig({
  assetsDir: 'template-assets',
  publicPath: publicPath ? publicPath : 'auto',
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      port: 1026,
      host: 'dev.alegra.com',
      historyApiFallback: true,
    },
    optimization: {
      splitChunks: false,
    },
    plugins,
  },
})
