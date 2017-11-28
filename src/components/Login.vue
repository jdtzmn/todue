<template lang="pug">
  div
    el-row
      el-col(:lg='{ span: 14, offset: 5 }', :sm='{ span: 18, offset: 3 }')
        el-container
          el-header
            a.brand.h1(href='/') todue
          el-main
            p.h1 Login
              small#step.pull-right.text-muted(v-if='!token') Step 1 of 2
              small#step.pull-right.text-muted(v-else) Step 2 of 2
            div(v-if='!token')
              el-form(:model='phoneForm', label-position='left', label-width="120px")
                el-form-item(label='Phone Number', prop='number')
                  el-input(v-model='phoneForm.number', type='number')
                    template(slot='prepend') +1
                el-form-item(label='Carrier', prop='carrier')
                  el-select(
                    v-model='phoneForm.carrier',
                    placeholder='Select Carrier...',
                    no-match-text='No carrier found',
                    :loading='!carriers',
                    @focus='fetchCarriers'
                    filterable
                  )
                    el-option(
                      v-for='carrier in carriers',
                      :key='carrier',
                      :label='carrier',
                      :value='carrier'
                    )
                el-form-item
                  el-button(type='primary', @click='sendText', :loading='loading') Send Verification Code
            div(v-else)
              el-row
                el-col(:lg='5', :sm='6', :xs='8')
                  el-form(label-position='top', label-width='120px')
                    el-form-item(label='Verification Code')
                      el-input(size='large', v-model='verifyForm.code', type='number')
                    el-form-item
                      el-button(type='text', @click='goBack') Didn't get it? Click here to go back.
                    el-form-item
                      el-button(type='primary', @click='verifyCode', :loading='loading') Verify
          el-footer
            el-steps(:space='200', :active='token ? 1 : 0', finish-status="success")
              el-step(title='Text Sent', icon='el-icon-bell')
              el-step(title='Verified', icon='el-icon-star-off')
              el-step(title='Done', icon='el-icon-success')
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      token: false,
      carriers: false,
      loading: false,
      phoneForm: {
        number: '',
        carrier: ''
      },
      verifyForm: {
        code: ''
      }
    }
  },
  created () {
    this.fetchCarriers()
  },
  methods: {
    fetchCarriers () {
      this.$axios.get('/auth/carriers')
        .then(response => {
          this.carriers = response.data
        })
        .catch(err => console.log(err))
    },
    sendText () {
      this.loading = true

      let params = new URLSearchParams()
      params.append('number', this.phoneForm.number)
      params.append('carrier', this.phoneForm.carrier)

      this.$axios.post('/auth/send', params)
        .then((res) => {
          this.$message.success('Verification code has been sent.')
          this.token = res.data
          this.loading = false
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.$message.error('Please enter a valid phone number and carrier')
          }

          this.loading = false
        })
    },
    goBack () {
      this.token = false
      this.phoneForm.number = ''
      this.phoneForm.carrier = ''
      this.verifyForm.code = ''
    },
    verifyCode () {
      this.loading = true

      let code = this.verifyForm.code
      let jwt = this.token

      // rewrite jwt so that the input code is inside payload
      let split = jwt.split('.')
      let payload = JSON.parse(atob(split[1]))
      payload = Object.assign({ code: code }, payload)
      let newPayload = btoa(JSON.stringify(payload)).slice(0, -2)
      split[1] = newPayload
      const token = split.join('.')

      let params = new URLSearchParams()
      params.append('token', token)

      this.$axios.post('/auth/login', params)
        .then((res) => {
          this.$router.push('/app')
          this.loading = false
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.$message.error('The verification code was incorrect. Please try again.')
          }
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
  .brand {
    display: inline-block;
    color: black;
    text-decoration: none;
    margin: 10px;
  }

  #step {
    margin-top: 8px;
  }

  /* HELPERSS */

  .h1 {
    font-size: 32px;
  }

  .pull-right {
    float: right;
  }

  .text-muted {
    color: rgb(100, 100, 100)
  }
</style>
