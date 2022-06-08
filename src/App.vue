<template>
  <v-app>
      <v-subheader
        id="app-bar"
        class="imagem d-flex"
        height="10%"
        color=green
        style="position: fixed; top: 0; left: 0; right: 0; z-index: 1;">
        <h1 id="top">KoalaChat</h1>
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
      <router-view style="height: 100%;"/>
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

export default {
  name: 'App',
  components: {
    CaughtErrorVue,
    ExitConfirmation
  },
  data: () => ({

  }),
  methods: {
    fechar() {
      this.$refs.exitConfirmation.open();
    },

    getData(){
      try{
       window.api.receive("doBack", (data) => {
        console.log(data);
        if (data.error == true){
          this.$isLoading(false);
          this.$refs.caughtErrorVue.showError(data);
          if(data.funcao == "getMessages"){
            this.$clearTimer();
          }
        }
        else{
          if (data.funcao == "config") {
            this.$setConfig(data.config);
          }
          else if(data.funcao == "getMessages"){
            this.$setMessages(data);
          }
          else if (data.funcao == "serverConfig"){
            this.$setServerConfig(data);
          }
          else if (data.funcao == "confirmSendMessage"){
            this.$confirmSendMessage(data.message);
          }
          else if (data.funcao == "confirmJoin"){
            this.$isLoged(data);
          }
          else{
            console.log(data);
          }
        }
        });
      }catch(e){
        console.log(e);
      }
    }
  },

  mounted() {
    this.getData();
  },
}
</script>


<style lang="scss">

#appView{
  margin-top: 48px;
  width: 100%;
  height: 100%;
  margin-bottom: 78px;
}

#footer {
  position: fixed;
  top: 100%; 
  width: 100%;
  margin-top: -78px;
}

#top {
  color: rgb(18, 0, 180);
}
.imagem{
  background: url("@/assets/coala.jpg") no-repeat center 30%;
  background-size: cover;
}
</style>
