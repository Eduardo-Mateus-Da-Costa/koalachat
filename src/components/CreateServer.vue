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
        label="Seu nome*"
        required
      ></v-text-field>
      <v-text-field
        v-model="user_password"
        label="Senha de administrador*"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomName"
        label="Nome da sala*"
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
        label="Senha da sala"
      ></v-text-field>
      <div v-if="form" style="color:red; margin-bottom: 3px;">{{message}}</div>
      <v-btn
        class="mr-4"
        @click="verifyForm() ? create() : null"
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
    <v-card-title>
      <span class="text-h6" style="font-weight: bold; color: red">Por favor anote!</span>
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
    user_password: null,
    form: false,
    message: null,
  }),

  methods: {
    open() {
      this.dialog = true;
    },

    verifyForm() {
      if (this.name === "" || this.roomName === "" || this.user_password === "") {
        this.message = "Preencha todos os campos obrigatórios *";
        this.form = true;
        return false;
      }else if (this.roomName.length > 15) {
        this.message = "O nome da sala não pode ter mais de 15 caracteres";
        this.form = true;
        return false;
      }
      else{
        this.form = false;
        return true;
      }
    },

    create(){
      var data = {
        funcao: "createServer",
        name: this.name,
        roomName: this.roomName,
        roomPassword: this.roomPassword,
        maxUsers: this.maxUsers,
        user_password: this.user_password
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
        user_password: this.user_password,
        is_owner: true,
        mode: "join"
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