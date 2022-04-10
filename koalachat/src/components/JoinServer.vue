<template>
  <v-dialog v-model="dialog">
    <v-btn
      class="ml-2"
      @click="fincudo()"
    >
      {{message}}
    </v-btn>
    <v-btn 
    class="ml-2"
    color="Red"
    @click="close()"
    rounded
    >
      Fechar
    </v-btn>
  </v-dialog>
</template>

<script>
export default {
    name: 'TesteSocket',
    data: () => ({
      message: "Click",
      dialog: false,
    }),

    methods: {
      fincudo() {
        if (this.message == "Click")
        {
          this.message = "Clickou";
        }
        else{
          this.message = "Click";
        }
      },

      open() {
        this.dialog = true;
      },

      close() {
        this.dialog = false;
        this.$emit("close");
      },
    }
};
</script>

<style>

</style>