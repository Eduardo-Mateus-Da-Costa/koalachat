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
                icon="mdi-arrow-left"
                class="white--text"
                @click="openMenu()"
                ></v-btn>
        </div>
        <div 
        style="min-width: 5%">
        </div>
        <div style="min-width: 82%;">
            <div>
                <v-card
                class="rounded"
                v-for="(message, i) in messages"
                :key="i"
                :style="{
                    alignItems: message.user_name === user_name ? 'flex-end' : 'flex-start',
                }">
                    <v-card-text
                    :style="{
                        'background-color': message.user_name === user_name ? '#00ff00' : '#ff0000',
                        }">
                        {{message.text}}
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-text>
                        <v-text-field
                        v-model="message"
                        label="Mensagem"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                        color="green"
                        @click="sendMessage()">
                            Enviar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
        <div 
            style="min-width: 5%">
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

export default {
  name: 'ChatView',
  components: {
  },
  data: () => ({
    message: '',
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
        }
    ],
  }),
  methods: {
      sendMessage() {
        var data = {
        text: this.message,
        user_name: this.user_name,
        message_date: new Date().toISOString(),
        }
        window.api.send("proBack", {funcao: "sendMessage", data: data})
        window.api.receive("doBack", (data) => {
            if (data.error == true){
            alert(data.errorMessage);
            }
            else{
            this.messages.push(data.message);
            this.message = '';
            }
        });
      },
      getData() {
        var data = {
            user_name: this.user_name,
        }
        window.api.send("proBack", {funcao: "getMessages", data: data})
        window.api.receive("doBack", (data) => {
            if (data.error == true){
            alert(data.errorMessage);
            }
            else{
                this.messages = data.messages;
            }
        });
      },
    },
    mounted() {
        this.getData();
    },
}
</script>
