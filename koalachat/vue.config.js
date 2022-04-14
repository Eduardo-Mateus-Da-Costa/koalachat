const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})

module.exports = {
  chainWebpack: config => {
    config.externals({ path: 'path', fs: 'fs' });
  }
};

module.exports = {
  pluginOptions: {
    electronBuilder: {
       preload: 'src/preload.js'
    }
  },
}

