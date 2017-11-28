<template lang='pug'>
  #app
    router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:700');

body, html {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-popper {
  font-family: 'Lato', sans-serif;
}

.el-message {
  font-family: 'Lato', sans-serif;
}
</style>
