<template>
  <v-app>
      <v-subheader
        id="app-bar"
        class="imagem d-flex"
        height="10%"
        color=green
        >
        <h1 id="top">KoalaChat</h1>
        <v-spacer/>
         <v-btn
            id="Sair"
            elevation="3"
            outilined
            rouded
            color="red"
            @click=fechar()
            >
          Sair
        </v-btn>
      </v-subheader>
    <div id="app">
      <router-view/>
    </div>
    <v-footer
          id="footer"
        >
          <v-card
            flat
            tile
            width="100%"
            class="green lighten-1 text-center"
          >
            <v-divider></v-divider>
    
            <v-card-text class="white--text">
              {{ new Date().getFullYear() }} — <strong>KoalaChat</strong>
              <v-spacer/>
              <strong>Autores: César Augusto Schuck Klunk, Denis Felipe Grezele e Eduardo Mateus Da Costa</strong>
            </v-card-text>
          </v-card>
        </v-footer>
  </v-app>
</template>

<script>

//const { ipcRenderer } = require('electron').remote

export default {
  name: 'App',
  components: {

  },
  data: () => ({

  }),
  methods: {
    fechar() {
      console.log("Fechei");
      window.api.send("proBack", { funcao: "fechar"});
    }
  }
}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  top: 40%
}

#footer {
  position: relative;
  bottom: 0;
  top: 78%;
}

#top {
  color: rgb(18, 0, 180);
}
.imagem{
  //background: url("https://edu.glogster.com/proxy?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F-49EGhZxvFE%2F0.jpg") no-repeat center center;
  background: url("@/assets/coala.jpg") no-repeat center 30%;
  background-size: cover;
}

#app-bar{
  height: 10%;
}
</style>
