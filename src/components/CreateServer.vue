<template>
<div>
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
        v-model="owner_password"
        label="Senha de administrador"
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
  <v-dialog v-model="showServerConfig" max-width="30%" style="">
    <v-card-title>
      <span class="text-h5" style="font-weight: bold">Configurações do servidor</span>
    </v-card-title>
    <v-card-text style="font-size: 20px;">
      <span style="color:green; font-weight: bold;">Nome:</span> <span>{{roomName}}</span>
    </v-card-text>
    <v-card-text style="font-size: 20px;">
      <span style="color:green;font-weight: bold;">Senha:</span> <span>{{roomPassword}}</span>
    </v-card-text >
    <v-card-text style="font-size: 20px;">
      <span style="color:green;font-weight: bold;">IP:port:</span> <span>{{'ws://' + serverIp}}</span>
    </v-card-text>
    <v-card-text style="font-size: 20px;">
     <span style="color:green;font-weight: bold;">Quantidade máxima de usuários:</span>  <span>{{maxUsers}}</span>
    </v-card-text>
    <v-card-actions>
      <v-btn color="green" @click="closeServerConfig()">
        OK
      </v-btn>
    </v-card-actions>
  </v-dialog>
</div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'CreateServer',
  data: () => ({
    dialog: false,
    name: "",
    roomName: "",
    roomPassword: "",
    maxUsers: 50,
    listMaxUsers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
    serverIp: null,
    showServerConfig: false,
    owner_password: null
  }),

  methods: {
    open() {
      this.dialog = true;
    },

    create(){
      var data = {
        funcao: "createServer",
        name: this.name,
        roomName: this.roomName,
        roomPassword: this.roomPassword,
        maxUsers: this.maxUsers,
        owner_password: this.owner_password
      }
      window.api.send("proBack", {data: data});
      this.$isLoading(true);
    },

    closeDialog() {
      this.dialog = false;
    },

    closeServerConfig() {
      this.showServerConfig = false;
      var data = {
          funcao: "join",
          name: this.name,
          roomIp: "ws://" + this.serverIp,
          roomName: this.roomName,
          roomPassword: this.roomPassword,
        };
        window.api.send("proBack", {data: data});
        this.$isLoading(true);
    },

    setServerConfig(data) {
      console.log(data);
      this.serverIp = data.serverIp;
      this.$isLoading(false);
      this.showServerConfig = true;
    },
  },

  created() {
    Vue.prototype.$setServerConfig = this.setServerConfig;
  },
};
</script>

<style>
  .v-dialog {
    background-color: white;
  }
</style>