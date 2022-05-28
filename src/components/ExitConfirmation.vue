<template>
  <v-dialog 
  v-model="dialog"
  persistent
  max-width="40%"
  >
    <v-card-text> 
      <v-card-title 
      class="text-h5 justify-center"> 
      Deseja realmente sair? 
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
        window.api.send("proBack", {data: {funcao: "fechar"}});
      },
    }
};
</script>

<style>
  .v-dialog {
    background-color: white;
  }
</style>