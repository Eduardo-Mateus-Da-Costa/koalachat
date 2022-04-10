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
      openCreateServer() {
        
      },
      openJoinServer() {
        this.$refs.joinServer.open();
      }
    }
};
</script>
