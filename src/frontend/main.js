import Vue from 'vue'
import api from '@/plugins/api.js'
import '@/plugins/vuetify.js'
import App from '@/App.vue'
import router from '@/router.js'
import store from '@/store.js'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(api, store)

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    if (to.meta.auth) {
      let loadProfile = store.state.profile.login == '' ? true : false
      vue
        .$api('auth/check', {
          loadProfile
        })
        .then(data => {
          if (data.error) {
            next('/')
          } else {
            if (loadProfile) {
              store.commit('profileset', data.result.profile)
            }
            next()
          }
        })
    } else {
      next()
    }
  }, 0)
})

const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
