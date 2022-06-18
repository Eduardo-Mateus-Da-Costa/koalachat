<template>
  <v-dialog
      v-model="options"
      persistent
      max-width="40%"
  >
    <v-card-text>
      <v-card-title>
        <h3>Deseja expulsar {{selectedUser.name}} ?</h3>
      </v-card-title>
      <v-card-actions>
        <v-btn
            color="green"
            @click="banUser()">
          Sim
        </v-btn>
        <v-spacer/>
        <v-btn
            color="red"
            @click="options = false">
          Não
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-dialog>
</template>

<script>
export default {
  name: "BanDialog",

  data: () => ({
    selectedUser: {name: 'vazio'},
    options: false,
    funcao: null,
  }),

  methods: {
    open(user, funcao) {
      this.selectedUser = user;
      this.funcao = funcao;
      this.options = true;
    },

    banUser() {
      this.options = false;
      this.funcao(this.selectedUser);
    }

  }
}
</script>

<style scoped>

</style>