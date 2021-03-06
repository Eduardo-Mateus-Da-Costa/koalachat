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
          //icon: "./src/assets/koala_mac.png",
          asar: false,
        },
        win: {
          target: [
            "nsis",
            "portable"
          ],
          //icon: "./src/assets/koala_mac.png",
          asar: false,
        },
        mac: {
          target: [
            "dmg",
            "zip"
          ],
          //icon: "./src/assets/koala_mac.png",
          asar: false,
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
      preload: './src/preload.js'
    },
  }
}

