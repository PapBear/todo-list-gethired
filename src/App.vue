<template>
  <div id="app">
    <HeaderView></HeaderView>
    <div class="app__container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import HeaderView from "./components/HeaderView.vue";
import Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
Vue.use(require('vue-moment'));

export default {
  name: 'app',
  components: {
    HeaderView
  },
  data() {
    return {
    }
  }
}

</script>

<style lang="scss">
  @import './assets/scss/style';
</style>
