import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/signin'
    },
    {
      path: '/signin',
      component: () => import(`@/views/signin.vue`)
    },
    {
      path: '/signup',
      component: () => import(`@/views/signup.vue`)
    },
    {
      path: '/profile',
      component: () => import(`@/views/profile.vue`),
      meta: {
        auth: true
      }
    }
  ]
})
