<template>
  <v-app>
      <v-subheader
        id="app-bar"
        class="imagem d-flex"
        height="10%"
        color=green
        style="position: fixed; top: 0; left: 0; right: 0; z-index: 2;">
        <h1 id="top">KoalaChat</h1>
        <v-spacer/>
        <h2 v-if="room_name != null" style="color:lightblue;">Sala: {{room_name}}</h2>
        <v-spacer/>
         <v-btn
            id="Sair"
            elevation="3"
            outilined
            rouded
            color="red"
            @click=fechar()
            >
          Sair
        </v-btn>
      </v-subheader>
    <div
      id="appView">
      <router-view/>
    </div>
    <v-footer
          id="footer"
          class="pa-0"
        >
          <v-card
            width="100%"
            class="green lighten-1 text-center"
          >
            <v-divider></v-divider>

            <v-card-text class="white--text">
              {{ new Date().getFullYear() }} — <strong>KoalaChat</strong>
              <v-spacer/>
              <strong>Autores: César Augusto Schuck Klunk, Denis Felipe Grezele e Eduardo Mateus Da Costa</strong>
            </v-card-text>
          </v-card>
        </v-footer>
        <ExitConfirmation ref="exitConfirmation"/>
        <CaughtErrorVue ref="caughtErrorVue"/>
  </v-app>
</template>

<script>

import ExitConfirmation from '@/components/ExitConfirmation.vue';
import CaughtErrorVue from './components/CaughtError.vue';
import router from "@/router";

export default {
  name: 'App',
  components: {
    CaughtErrorVue,
    ExitConfirmation,
  },
  data: () => ({
    room_name: null,
  }),
  methods: {
    fechar() {
      this.$refs.exitConfirmation.open();
    },

    getData(){
      try{
       window.api.receive("doBack", (data) => {
         //console.log(data);
        if (data.error === true){
          this.$isLoading(false);
          this.$refs.caughtErrorVue.show(data);
          if(data.funcao === "getMessages" || data.funcao === "getUsers"){
            this.$clearTimer();
          }
        }
        else{
          if (data.funcao === "config") {
            this.$setConfig(data.config);
          }
          else if(data.funcao === "getMessages"){
            this.$setMessages(data);
          }
          else if (data.funcao === "serverConfig"){
            this.$setServerConfig(data);
          }
          else if (data.funcao === "confirmJoin"){
            this.setRoom_name(data);
            this.$isLoged(data);
          }
          else if (data.funcao === "getUsers"){
            this.$setUsers(data);
          }
          else if (data.funcao === "confirmLogout"){
            this.setRoom_name({room_name: null});
            router.push({name: 'home'});
          }
          else{
            console.log(data);
          }
        }
        });
      }catch(e){
        console.log(e);
      }
    },

    setRoom_name(data){
      this.room_name = data.roomName;
    },
  },

  mounted() {
    this.getData();
  },

  watch: {
    room_name() {
      if (this.room_name == null) {
        window.location.reload(); ///Para tirar o nome da sala
      }
    }
  }
}
</script>


<style lang="scss">

#appView{
  margin-top: 48px;
  width: 100%;
  height: 100%;
}

#footer {
  position: fixed;
  top: 100%;
  width: 100%;
  margin-top: -4%;
  height: 7.5%;
  z-index: 1;
}

#top {
  color: rgb(18, 0, 180);
}
.imagem{
  background: url("@/assets/coala.jpg") no-repeat center 30%;
  background-size: cover;
}
</style>
