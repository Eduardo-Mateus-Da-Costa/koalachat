import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import loading from 'vuejs-loading-screen'

Vue.config.productionTip = false

Vue.use(loading, {
  bg: 'rgba(0, 0, 0, 0.5)',
  icon: 'fas fa-spinner',
  slot: 
    `<div class="loader px-5 py-3 bg-gray-8000 rounded">
      <h3 class="text-3xl text-white">Carregando...</h3>
    </div>`,
});

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
