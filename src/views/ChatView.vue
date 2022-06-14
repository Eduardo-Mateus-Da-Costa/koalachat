<template>
    <div class="d-flex" style="background-color:ghostwhite; height: 100%" >
        <v-navigation-drawer
            class="green lighten-1"
            expand-on-hover
            style="
                min-width: 4%;
            "
            >
            <v-btn
                icon
                rounded
                style="left: 15%; top: 1%;"
                :to="{name: 'home'}"
                ><v-icon color="white">mdi-arrow-left</v-icon></v-btn>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <h3>Participantes</h3>
                </v-list-item-title>
                  <v-btn
                      style="position: relative;"
                      v-for="(user, index) in users"
                      :key="index"
                      @contextmenu="!owner ? null : showOption(user)"
                      >
                  {{user.name}}
                  <v-icon
                      :color="user.online === true ? 'green' : 'grey'">
                    mdi-checkbox-blank-circle
                  </v-icon>
                </v-btn>
              </v-list-item-content>
            </v-list-item>
        </v-navigation-drawer>
        <div 
            style="min-width: 5%">
        </div>
        <div style="width: 82%; margin-top: 30px; margin-bottom: 130px;" id="chat" ref="chat">
            <div style="overflow: auto; max-height: calc(100% - 400px)" >
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
                    <div v-if="Loading" class="text-center">
                        <v-progress-circular
                        indeterminate
                        color="primary"
                        ></v-progress-circular>
                        <div>Carregando mensagens</div>
                    </div>
                    <div v-if="error" class="text-center">
                        <h3>Ocorreu um erro ao carregar as mensagens, por favor confira os dados e tente novamente!</h3>
                    </div>
            </div>
          <div class="d-flex justify-center">
            <v-card width="100%">
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
            ">
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
//import UsersList from "@/components/UsersList";
export default {
  name: 'ChatView',
  components: {
    //UsersList,
  },
  data: () => ({
    Loading: true,
    room: '',
    message: null,
    user_name: "Eduardo",
    roomIp: "",
    users_count: 0,
    owner: false,
    messages: [],
    error: false,
    users: [],
  }),
  methods: {
      sendMessage() {
        var data = {
            name: this.user_name,
            url: this.roomIp,
            roomName: this.room,
            message: {
                text: this.message,
                user_name: this.user_name,
                message_date: new Date().toLocaleTimeString("pt-BR")+ " " + new Date().toLocaleDateString("pt-BR"),  
            },
            funcao: "sendMessage"
        }
        window.api.send("proBack", {funcao: "sendMessage", data: data})
        this.message = null;
      },

      getMessages() {
        var data = {
            url: this.$route.params.url,
            roomName: this.$route.params.room,
            name: this.$route.params.username,
            funcao: "getMessages"
        }
        window.api.send("proBack", {data: data})
      },

      getUsers() {
        var data = {
          url: this.$route.params.url,
          roomName: this.$route.params.room,
          name: this.$route.params.username,
          funcao: "getUsers"
        }
        window.api.send("proBack", {data: data})
      },

      setMessages(data) {
        this.Loading = false;
        this.messages = data.messages;
        this.users_count = data.users_count;
        this.owner = data.owner;
      },

      setUsers(data) {
        this.users = data.users;
      },

      logout() {
        var data = {
            url: this.roomIp,
            roomName: this.room,
            name: this.user_name,
            funcao: "logout"
        }
        window.api.send("proBack", {data: data})
      },


      confirmSendMessage(data) {
        this.messages.push(data);
      },

        clearTimer() {
            this.Loading = false;
            this.error = true;
            clearInterval(this.timer);
        },

        scrollDown() {
            window.scrollTo(0, document.body.scrollHeight);
        },
    },

    created(){
        Vue.prototype.$setMessages = this.setMessages;
        Vue.prototype.$confirmSendMessage = this.confirmSendMessage;
        Vue.prototype.$clearTimer = this.clearTimer;
        Vue.prototype.$setUsers = this.setUsers;
    },

    mounted() {
        {
            this.timer = setInterval(() => {
                this.getMessages();
                this.getUsers();
            }, 300);
        }
        this.roomIp = this.$route.params.url;
        this.room = this.$route.params.room;
        this.user_name = this.$route.params.username;
    },

    beforeDestroy() {
        clearInterval(this.timer);
        this.logout();
    },

    watch:{
        confirmSendMessage(){
            this.scrollDown();
        }
    }
}
</script>
