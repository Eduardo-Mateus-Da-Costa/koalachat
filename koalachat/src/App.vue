<template>
  <v-app>
      <v-app-bar
        id="app-bar"
        absolute
        fixed
        color="green lighten-1"
        src="@/assets/coala.jpg"
        >
         <h1 id="top">KoalaChat</h1>
      </v-app-bar>
    <div id="app">
      <router-view/>
    </div>
    <v-footer
          id="footer"
          v-bind="localAttrs"
          :padless="padless"
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

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  top: 50%
}

#footer {
  position: relative;
  top: 86.5%
}
</style>