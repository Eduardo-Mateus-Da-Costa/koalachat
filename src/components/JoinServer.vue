<template>
  <v-dialog v-model="dialog"
  max-width="60%">
    <v-card-title>
      <span class="text-h5">Entrar em uma sala</span>
    </v-card-title>
    <v-card-text>
    <form>
      <v-text-field
        v-model="name"
        label="Seu nome"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomIp"
        label="Endereço da sala (IP:Port)"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomName"
        label="Nome da sala"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomPassword"
        label="Senha da sala (se tiver)"
      ></v-text-field>

      <v-btn
        class="mr-4"
        @click="join()"
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
import Vue from 'vue'
export default {
    name: 'JoinServer',
    data: () => ({
      message: "Click",
      dialog: false,
      name: "",
      roomIp: null,
      roomName: "",
      roomPassword: "",
    }),

    methods: {
      open() {
        this.dialog = true;
      },

      getDefault() {
        window.api.send("proBack", {data: {funcao: "config"}});
      },

      setConfig(data) {
        this.name = data.name;
        this.roomIp = data.roomIp;
        this.roomName = data.roomName;
        this.roomPassword = data.roomPassword;
      },

      closeDialog() {
        this.dialog = false;
      },

      join(){
        var data = {
          funcao: "join",
          name: this.name,
          roomIp: this.roomIp,
          roomName: this.roomName,
          roomPassword: this.roomPassword,
        };
        window.api.send("proBack", {data: data});
        this.$isLoading(true);
      },

      isLoged(data){
        console.log(data);
        this.$isLoading(false);
        this.$router.push({name: 'chat', params: {room: data.roomName, username: data.name, url: "ws://" + data.roomIp}});
      },
    },

    created(){
      Vue.prototype.$setConfig = this.setConfig;
      Vue.prototype.$isLoged = this.isLoged;
    },

    mounted() {
      this.getDefault();
    },
};
</script>

<style>
  .v-dialog {
    background-color: white;
  }
</style>