<template>
  <v-app>
      <v-app-bar
        absolute
        color="green lighten-1"
        src="./assets/coala.jpg"
        >
        <h1>KoalaChat</h1>
      </v-app-bar>
    <v-spacer/>
    <v-main>
      <div align="center" justify="center">
        <v-btn
          elevation="3"
          outlined
          rounded
          color="green"
          @click=openJoinServer()>
            {{button1}}
        </v-btn>
        <v-btn
          class="ml-2"
          elevation="3"
          outlined
          rounded
          color="green"
          @click=openCreateServer()>
            {{button2}}
        </v-btn>
      </div>
    </v-main>
     <v-footer
        v-bind="localAttrs"
        :padless="padless"
      >
        <v-card
          flat
          tile
          width="100%"
          class="green lighten-1 text-center"
        >
          <v-card-text>
            <v-btn
              v-for="icon in icons"
              :key="icon"
              class="mx-4"
            >
            Botão
            </v-btn>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} — <strong>KoalaChat</strong>
          </v-card-text>
        </v-card>
      </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    button1: "Entrar em uma sala",
    button2: "Criar meu servidor",
  }),

  methods: {
      openCreateServer() {
        
      },

      openJoinServer() {

      }

    
    }
};
</script>