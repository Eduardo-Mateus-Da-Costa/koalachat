const { defineConfig } = require('@vue/cli-service')
const path = require("path");
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
    },
  }
}

