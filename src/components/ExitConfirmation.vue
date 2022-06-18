<template>
  <v-dialog 
  v-model="dialog"
  persistent
  max-width="45%"
  >
    <v-card-text> 
      <v-card-title 
      class="text-h4 justify-center"> 
      Deseja realmente sair? 
      </v-card-title>
      <v-card-title 
      class="text-h9 justify-center"> 
      Caso você possua uma sala aberta, ela será fechada.
      </v-card-title>
      <div class="d-flex">
        <v-btn 
        class="ml-2"
        color="green"
        @click="closeDialog()"
        rounded
        >
          Não
        </v-btn>
        <v-spacer/>
        <v-btn 
        class="ml-2"
        color="red"
        @click="close()"
        rounded
        >
          Sim
        </v-btn>
      </div>
    </v-card-text>
  </v-dialog>
</template>

<script>
export default {
    name: 'ExitConfirmation',
    data: () => ({
      dialog: false,
    }),

    methods: {
      closeDialog()
      {
        this.dialog = false;
      },

      open() {
        this.dialog = true;
      },

      close() {
        var data = {
          funcao: "fechar",
          online: this.$route.fullPath !== "/",
          exit: this.$route.fullPath === "/" ? null : {
            url: this.$route.params.url,
            roomName: this.$route.params.room,
            name: this.$route.params.username,
            funcao: "logout"
          }
        };
        window.api.send("proBack", {data: data});
      },
    }
};
</script>

<style>
  .v-dialog {
    background-color: white;
  }
</style>