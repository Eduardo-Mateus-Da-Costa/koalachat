const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})

module.exports = {
  chainWebpack: config => {
    config.externals({ path: 'path', fs: 'fs', ip: 'ip' });
  }
};

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  pluginOptions: {
    electronBuilder: {
      build: {
        icon: "src/assets/favicon.ico",
        appId: "br.edu.unoesc.koalachat",   
        linux: {
          target: [
            "AppImage",
            "deb"
          ]
        },
        publish: [
          {
            provider: "github"
          }
        ]
      },
       preload: 'src/preload.js'
    },
  }
}

