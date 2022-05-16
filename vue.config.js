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
      customFileProtocol: './',
      builderOptions: {
        productName: 'Koalachat',
        appId: "br.edu.unoesc.koalachat",   
        linux: {
          target: [
            "AppImage",
            "deb"
          ],
          icon: "./src/assets/koala.png"
        },
        win: {
          target: [
            "nsis",
            "portable"
          ],
          icon: "./src/assets/koala.png"
        },
        mac: {
          target: [
            "dmg",
            "zip"
          ],
          icon: "./src/assets/koala.png"
        },
        "nsis": {
          "oneClick": false,
          "allowToChangeInstallationDirectory": true,
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

