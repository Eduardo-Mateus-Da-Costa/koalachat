<template>
    <div class="d-flex" min-height="100%" style="background-color:ghostwhite">
        <div
            class="green lighten-1"
            style="
                max-width: 4%; 
                min-width: 4%; 
                min-height: 100%;
            "
            >
            <v-btn
                icon
                rounded
                style="position: fixed; top: 55px; left: 0.5%; z-index: 1;"
                :to="{name: 'home'}"
                ><v-icon color="white">mdi-arrow-left</v-icon></v-btn>
        </div>
        <div 
        style="min-width: 5%">
        </div>
        <div style="min-width: 82%; margin-top: 30px; margin-bottom: 130px;">
            <div>
                <v-card
                class="rounded"
                v-for="(message, i) in messages"
                :key="i"
                style="margin-bottom: 10px;"
                :style="{
                    alignItems: message.user_name === user_name ? 'flex-end' : 'flex-start',
                    width: 'max-content',
                    marginLeft: message.user_name === user_name ? 'auto' : '0',
                    marginRight: message.user_name === user_name ? '0' : 'auto',
                }">
                <div
                    style="min-width: 200px;"
                    :style="{
                        padding: '2px',
                        backgroundColor: message.user_name === user_name ? 'rgba(0,160,0,0.25)' : 'rgba(247,28,0,0.25)',
                        }">
                    <h4 :style="{
                        marginLeft: '2%',
                        marginTop: '1%'}">
                        {{message.user_name}}
                    </h4>
                    <p :style="{
                        marginLeft: '2%',
                        marginTop: '1%',
                        marginBottom: 0}">
                        {{message.text}}
                    </p>
                    <div class="d-flex justify-end mr-3 mb-1" style="margin-left: 2%; margin-top: 2px;">
                        <h6 :style="{
                    }">{{message.message_date}}</h6>
                    </div>
                </div>
                    
                    
                </v-card>
                <v-card style="position: fixed; top:100%; width: 82%; margin-top: -202px;">
                    <v-card-text 
                        class="pa-1 mb-0 pt-1 ml-2"
                        >
                        <v-text-field
                            style="margin-right: 15px;"
                            class="mb-0"
                            v-model="message"
                            @keyup.enter="message != null ? sendMessage() : null"
                            label="Mensagem"
                        >
                        </v-text-field>
                    </v-card-text>
                    <v-card-actions class="pa-1 ml-2">
                        <v-btn
                        color="green"
                        @click="message != null ? sendMessage() : null">
                            Enviar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
        <div 
            style="
            min-width: 5%;"
            >
        </div>
        <div
        class="green lighten-1"
            style="
                max-width: 4%; 
                min-width: 4%; 
                min-height: 100%;
            ">
        </div>

    </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'ChatView',
  components: {
  },
  data: () => ({
    room_id: 1,
    message: null,
    user_name: "Eduardo",
    messages: [
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "KoalaChat",
            message_date: "2020-01-01 00:00:00",
        },
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "Eduardo",
            message_date: "2020-01-01 00:00:00",
        },
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "KoalaChat",
            message_date: "2020-01-01 00:00:00",
        },
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "Eduardo",
            message_date: "2020-01-01 00:00:00",
        },
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "KoalaChat",
            message_date: "2020-01-01 00:00:00",
        },{
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "KoalaChat",
            message_date: "2020-01-01 00:00:00",
        },
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "Eduardo",
            message_date: "2020-01-01 00:00:00",
        },
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "KoalaChat",
            message_date: "2020-01-01 00:00:00",
        },
        {
            text: "Olá, eu sou o KoalaChat, o chat de Koalas. Seja bem-vindo(a)!",
            user_name: "Eduardo",
            message_date: "2020-01-01 00:00:00",
        },
    ],
  }),
  methods: {
      sendMessage() {
        var data = {
            text: this.message,
            user_name: this.user_name,
            message_date: new Date().toLocaleTimeString("pt-BR")+ " " + new Date().toLocaleDateString("pt-BR"),  
            url: "ws://192.168.0.103:3000"
        }
        window.api.send("proBack", {funcao: "sendMessage", data: data})
      },
      getData() {
        var data = {
            user_name: this.user_name,
        }
        window.api.send("proBack", {funcao: "getMessages", data: data})
      },

      setMessages(data) {
        this.messages = data;
      },

      confirmSendMessage(data) {
        this.messages.push(data);
      }
    },

    created(){
        Vue.prototype.$setMessages = this.setMessages;
        Vue.prototype.$confirmSendMessage = this.confirmSendMessage;
    },

    mounted() {
        this.getData();
    },
}
</script>
