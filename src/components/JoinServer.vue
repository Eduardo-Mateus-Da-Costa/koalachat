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
      <div v-if="form" style="color:red; margin-bottom: 3px;">Preencha os campos obrigatórios *</div>
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
    }),

    methods: {
      verifyForm() {
        if (this.name == "" || this.roomIp == "" || this.roomName == "" || this.user_password == "") {
          this.form = true
          return false
        }else{
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
          user_password: this.user_password,
          is_owner: this.owner,
          mode: this.newUser === true ? "create" : "join"
        };
        window.api.send("proBack", {data: data});
        this.$isLoading(true);
      },

      isLoged(data){
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