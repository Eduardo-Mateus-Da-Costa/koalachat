<template>
  <v-btn
    class="ml-2"
    @click=fincudo()
  >
    {{message}}
  </v-btn>
</template>

<script>
export default {
    name: 'TesteSocket',
    data: () => ({
      message: "Click"
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
      }
    }
};
</script>

<style>

</style>