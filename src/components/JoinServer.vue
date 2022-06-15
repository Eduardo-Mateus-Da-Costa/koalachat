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
        label="Seu nome*"
        required
      ></v-text-field>
      <div class="d-flex">
        <v-checkbox
            style="margin-right: 10px;"
            v-if="!newUser"
            v-model="owner"
            label="Sou o dono da sala"
        ></v-checkbox>
        <v-checkbox
            v-if="!owner"
            v-model="newUser"
            label="Criar usuário"
        ></v-checkbox>
      </div>
      <v-text-field
        v-model="user_password"
        label="Senha*"
        required
        v-if="!newUser && !owner"
      ></v-text-field>
      <v-text-field
          v-if="newUser"
          v-model="user_password"
          label="Crie uma senha*"
          required
      ></v-text-field>
      <v-text-field
        v-if="owner"
        v-model="user_password"
        label="Senha de administrador*"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomIp"
        label="Endereço da sala (IP:Port)*"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomName"
        label="Nome da sala*"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomPassword"
        label="Senha da sala"
      ></v-text-field>
      <div v-if="form" style="color:red; margin-bottom: 3px;">{{message}} *</div>
      <v-btn
        class="mr-4"
        @click="verifyForm() ? join() : null"
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
      dialog: false,
      name: "",
      roomIp: null,
      roomName: "",
      roomPassword: "",
      owner: false,
      user_password: "",
      form: false,
      newUser: false,
      message: null,
    }),

    methods: {
      verifyForm() {
        if (this.name === "" || this.roomIp === "" || this.roomName === "" || this.user_password === "") {
          this.message = "Preencha todos os campos obrigatórios *"
          this.form = true
          return false
        }else if (this.name.length > 15 || this.roomName.length > 15) {
          this.message = "Nome e nome da sala não podem ter mais de 15 caracteres"
          this.form = true
          return false
        }
        else if (this.formatRoomIp() === false) {
          this.message = "Endereço da sala inválido, use o formato ###.###.###.###:####"
          this.form = true
          return false
        }
        else{
          this.form = false
          return true
        }
      },

      open() {
        this.dialog = true;
      },

      getDefault() {
        window.api.send("proBack", {data: {funcao: "config"}});
      },

      setConfig(data) {
        this.name = data.name;
        this.roomIp = data.roomIp.substring(5);
        this.roomName = data.roomName;
        this.roomPassword = data.roomPassword;
      },

      closeDialog() {
        this.dialog = false;
      },

      setWsformat(ip){
        if (ip.startsWith("ws://")) {
          return ip
        }
        else{
          return "ws://" + ip
        }
      },

      formatRoomIp() {
        var ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
        var portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
        var ip = this.roomIp.split(":");
        if (ip.length === 2) {
          if (ip[0].match(ipRegex) && ip[1].match(portRegex)) {
            return true;
          }
        }
        return false;
      },	

      join(){
        var data = {
          funcao: "join",
          name: this.name,
          roomIp: this.setWsformat(this.roomIp),
          roomName: this.roomName,
          roomPassword: this.roomPassword,
          user_password: this.user_password,
          is_owner: this.owner,
          mode: this.newUser === true ? "create" : "join"
        };
        window.api.send("proBack", {data: data});
        this.$isLoading(true);
      },

      isLoged(data){
        this.$isLoading(false);
        this.$router.push({name: 'chat', params: {room: data.roomName, username: data.name, url: this.setWsformat(data.roomIp)}});
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