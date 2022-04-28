<template>
  <v-dialog v-model="dialog"
  max-width="60%">
    <v-card-title>
      <span class="text-h5">Criar um servidor</span>
    </v-card-title>
    <v-card-text>
    <form>
      <v-text-field
        v-model="name"
        label="Seu nome"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomName"
        label="Nome da sala"
        required
      ></v-text-field>
      
      <v-select
        v-model="maxUsers"
        :items="listMaxUsers"
        label="Quantidade máxima de usuários"
      >
        </v-select>
      <v-text-field
        v-model="roomPassword"
        label="Senha da sala (se quiser)"
      ></v-text-field>

      <v-btn
        class="mr-4"
        @click="create()"
        color='green'
      >
        Entrar
      </v-btn>
      <v-btn 
      @click="closeDialog()"
      color='red'>
        Cancelar
      </v-btn>
    </form>
    </v-card-text>
</v-dialog>
</template>

<script>
export default {
    name: 'CreateServer',
    data: () => ({
      message: "Click",
      dialog: false,
      name: "",
      roomName: "",
      roomPassword: "",
      maxUsers: 50,
      listMaxUsers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
    }),

    methods: {
      open() {
        this.dialog = true;
      },

      create(){
          window.api.send("proBack", { funcao: "print"});
      },

      closeDialog() {
        this.dialog = false;
      },
    }
};
</script>

<style>
  .v-dialog {
    background-color: white;
  }
</style>