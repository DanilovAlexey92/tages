import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function pushSnackbar(state, text, color) {
  if (text != (state.snackbar.slice(-1)[0] || {}).text) {
    state.snackbar.push({
      text,
      color
    })
  }
}

export default new Vuex.Store({
  state: {
    secret: 'e34ea0b5db1995676cb5794a9c323e632feead8e',
    loader: false,
    snackbar: [],
    profile: {
      login: ''
    }
  },
  mutations: {
    loaderon(state) {
      state.loader = true
    },
    loaderoff(state) {
      state.loader = false
    },
    snackbarinfo(state, text) {
      pushSnackbar(state, text)
    },
    snackbarerror(state, text) {
      pushSnackbar(state, text, 'red')
    },
    profileset(state, profile) {
      state.profile.login = profile.login
    }
  },
  actions: {}
})
