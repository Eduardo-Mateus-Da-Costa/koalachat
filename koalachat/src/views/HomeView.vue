<template>
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
      <JoinServer ref="joinServer"/>
    </v-main>
</template>

<script>
import JoinServer from "@/components/JoinServer.vue";
// const app = require('@/websocket/app.js');
// const appWs = require('@/websocket/app-ws.js');

export default {
  name: 'HomeView',
  components: {
    JoinServer
  },
  data: () => ({
    button1: "Entrar em uma sala",
    button2: "Criar meu servidor",
  }),
  methods: {
      // openCreateServer() {
      //   const server = app.listen(process.env.PORT || 3000, () => {
      //     console.log(`App Express is running!`);
      //     })
          
      //   appWs(server);
      // },
      openJoinServer() {
        this.$refs.joinServer.open();
      }
    }
};
</script>
