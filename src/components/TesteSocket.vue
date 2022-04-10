<template>
<button>
    {{message}}
    @click:greet
</button>
</template>

<script>
export default {
    name: 'TesteSocket',
data: {
    name: 'Vue.js'
  },
  // define métodos dentro do objeto `methods`
  methods: {
    greet: function (event) {
      // `this` dentro de métodos aponta para a instância Vue
      alert('Olá ' + this.name + '!')
      // `event` é o evento DOM nativo
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
}

</script>

<style>

</style>