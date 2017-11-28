<template lang="pug">
  div
    el-row
      el-col(:lg='{ span: 14, offset: 5 }' :sm='{ span: 18, offset: 3 }')
        el-container
          el-header
            a.brand.h1(href='/') todue
            router-link(to='/app')
              el-button.pull-right.login(type='primary') Go to app
    #banner
      #about.h1.text-center A smarter todo list
        br
        small.text-muted To help you get more done
    el-row
      el-col(:lg='{ span: 12, offset: 6 }' :sm='{ span: 18, offset: 3 }')
        el-container
          el-main
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style scoped>
  .brand {
    display: inline-block;
    color: black;
    text-decoration: none;
  }

  .brand, .login {
    margin: 10px;
  }

  #banner {
    height: 90vw;
    max-height: calc(100vh - 150px);
    min-height: 12vw;
    background: rgb(111, 124, 136) no-repeat center center;
    background-size: cover;
    /* Photo by Vanessa Deidda on Unsplash */
    background-image: url('../assets/background.jpg');
  }

  #about {
    color: white;
    padding-top: 4vw;
  }

  .text-muted {
    color: rgb(220, 220, 220);
  }


  /* HELPERSS */

  .h1 {
    font-size: 32px;
  }

  .text-center {
    text-align: center;
  }

  .pull-right {
    float: right;
  }
</style>
