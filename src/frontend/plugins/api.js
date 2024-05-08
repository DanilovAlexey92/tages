import axios from 'axios'

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export default {
  install: function(Vue, store) {
    Vue.prototype.$api = (url, data) => {
      store.commit('loaderon')
      return delay(1500).then(() => {
        return axios
          .post(`/api/${url}`, data)
          .then(response => {
            if (response.data.error) {
              store.commit('snackbarerror', response.data.error)
            }
            return response.data
          })
          .catch(error => {
            store.commit('snackbarerror', error)
          })
          .finally(() => {
            store.commit('loaderoff')
          })
      })
    }
  }
}
