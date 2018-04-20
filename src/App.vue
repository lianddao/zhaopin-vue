<template>
  <div id="app" class="container">
    <img src="./assets/logo.png" style="height:50px">
    <keep-alive>
      <router-view class="view"></router-view>
    </keep-alive>

  </div>
</template>
<script>

  export default {
    name: 'App',
    components: {
    }
  }
</script>
<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }

  pre {
    font-size: 9px;
    white-space: pre-wrap;
  }
</style>
