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
        console.log("cliquei");
        window.api.send("proBack", { funcao: "print"});
        window.api.receive("doBack", (data) => {
          console.log(data);
          this.message = data;
        });
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