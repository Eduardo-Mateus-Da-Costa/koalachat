<template>
    <v-main>
      <div  class="d-flex justify-center" style="margin-top: 20%;">
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
      <CreateServer ref="createServer"/>
    </v-main>
</template>

<script>
import JoinServer from "@/components/JoinServer.vue";
import CreateServer from "@/components/CreateServer.vue";

export default {
  name: 'HomeView',
  components: {
    JoinServer,
    CreateServer
  },
  data: () => ({
    button1: "Entrar em uma sala",
    button2: "Criar meu servidor",
  }),
  methods: {
    openCreateServer() {
      this.$refs.createServer.open();
    },
    openJoinServer() {
      this.$refs.joinServer.open();
    }
  }
}
</script>
