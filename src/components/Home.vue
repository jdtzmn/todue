<template lang="pug">
  div Hello World
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      api: this.$axios.create()
    }
  },
  created () {
    // set X-CSRF-TOKEN header
    this.api.defaults.headers.common['X-CSRF-TOKEN'] = this.$cookies.get('xsrf')

    // automatically redirect to login page if status code 401 is returned
    this.api.interceptors.response.use(null, err => {
      if (err.response.status === 401) {
        this.$router.push('/login')
      }
      return Promise.reject(err)
    })

    this.api.get('/api/test')
      .then(() => console.log('YAY'))
      .catch((err) => console.log(err))
  }
}
</script>

<style scoped>

</style>
