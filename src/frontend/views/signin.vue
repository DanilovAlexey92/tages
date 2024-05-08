<template>
  <div>
    <layout-main title="Войдите в свой профиль">
      <template #form>
        <v-form v-on:submit.prevent v-model="form.valid" ref="form">
          <v-text-field
            @keyup.enter="submit()"
            prepend-icon="person"
            v-model="form.data.login"
            :rules="[
              v => !!v || 'Обязательно для заполнения',
              v => (v && v.length > 1) || 'Укажите логин'
            ]"
            :counter="15"
            :disabled="$store.state.loader"
            label="Логин"
            required
          ></v-text-field>
          <v-text-field
            @keyup.enter="submit()"
            prepend-icon="lock"
            type="password"
            v-model="form.data.password"
            :rules="[
              v => !!v || 'Обязательно для заполнения',
              v => (v && v.length > 1) || 'Укажите пароль'
            ]"
            :counter="50"
            :disabled="$store.state.loader"
            label="Пароль"
            required
          ></v-text-field>
        </v-form>
      </template>
      <template #action>
        <v-btn
          round
          block
          large
          color="purple white--text"
          :disabled="!form.valid || $store.state.loader"
          @click="submit"
          >войти</v-btn
        >
      </template>
      <template #footer>
        <v-flex xs12>
          <v-btn flat small color="primary" :disabled="$store.state.loader"
            >я забыл пароль</v-btn
          >
        </v-flex>
        <v-flex xs12>
          <v-btn
            flat
            small
            color="primary"
            :disabled="$store.state.loader"
            @click="$router.push('/signup')"
            >регистрация</v-btn
          >
        </v-flex>
      </template>
    </layout-main>
    <code-confirm :param="dialog" @next="next"></code-confirm>
  </div>
</template>

<script>
import codeConfirm from '@/components/code-confirm.vue'
import layoutMain from '@/components/layout-main.vue'

export default {
  components: {
    codeConfirm,
    layoutMain
  },
  data: () => ({
    dialog: {
      show: false
    },
    form: {
      valid: false,
      data: {
        login: '',
        password: ''
      }
    }
  }),
  methods: {
    submit: function() {
      if (this.form.valid) {
        this.$api('auth/signin/enter', this.form.data).then(data => {
          if (!data.error) {
            this.dialog.show = true
            this.$store.commit('snackbarinfo', data.result.text)
          }
        })
      }
    },
    next: function(code) {
      this.$api('auth/signin/confirm', { code }).then(data => {
        if (!data.error) {
          this.$store.commit('profileset', data.result.profile)
          this.$router.push('/profile')
        }
      })
    }
  },
  activated: function() {
    this.$refs.form.reset()
  }
}
</script>
