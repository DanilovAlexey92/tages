<template>
  <layout-main title="Регистрация профиля">
    <template #form>
      <v-form v-model="form.valid">
        <v-text-field
          v-model="form.data.login"
          :rules="[
            v => /^([A-Za-z0-9])+$/.test(v) || 'Допустимые символы A-Z a-z 0-9'
          ]"
          :counter="15"
          :disabled="$store.state.loader"
          maxlength="15"
          label="Логин"
          required
        ></v-text-field>
        <v-text-field
          id="fullname"
          v-model="form.data.fullname"
          :rules="[ruleFullname]"
          :counter="40"
          :disabled="$store.state.loader"
          maxlength="40"
          label="ФИО"
          required
        ></v-text-field>
        <v-text-field
          v-model="form.data.email"
          :rules="[ruleEmail]"
          :counter="30"
          :disabled="$store.state.loader"
          maxlength="30"
          label="Email"
          required
        ></v-text-field>
        <v-text-field
          v-model="form.data.phone"
          :rules="[
            v =>
              /^((\+7)+([0-9]){10})$/.test(v) ||
              'Укажите номер телефон в формате +7xxxxxxxxxx'
          ]"
          :counter="12"
          :disabled="$store.state.loader"
          maxlength="12"
          label="Телефон"
          required
        ></v-text-field>
        <v-text-field
          id="city"
          :hint="form.data.country"
          persistent-hint
          v-model="form.data.city"
          :rules="[ruleCity]"
          :counter="50"
          :disabled="$store.state.loader"
          maxlength="50"
          label="Город"
          required
        ></v-text-field>
        <v-select
          v-model="form.data.osphone"
          :rules="[v => !!v || 'Обязательно для заполнения']"
          :items="select.osphone"
          :disabled="$store.state.loader"
          label="ОС мобильного телефона"
          required
        ></v-select>
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
        >зарегистрироваться</v-btn
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
          @click="$router.push('/signin')"
          >я уже зарегистрирован</v-btn
        >
      </v-flex>
    </template>
  </layout-main>
</template>

<script>
import layoutMain from '@/components/layout-main.vue'

export default {
  components: {
    layoutMain
  },
  methods: {
    submit: function() {
      this.$api('auth/signup', this.form.data).then(data => {
        if (!data.error) {
          this.$store.commit(
            'snackbarinfo',
            `Временный пароль ${data.result.password}`
          )
        }
      })
    },
    ruleFullname: function(value) {
      if (value) {
        if (value.split(' ').length == 3) {
          if (this.form.check.fullname) {
            return true
          } else {
            return 'Необходимо выбрать ФИО из списка'
          }
        } else {
          return 'Укажите ФИО полностью'
        }
      } else {
        return 'Обязательно для заполнения'
      }
    },
    ruleEmail: function(value) {
      /* eslint-disable */
      const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      /* eslint-enable */
      return regexp.test(value) || 'Укажите корректный email'
    },
    ruleCity: function(value) {
      if (value) {
        if (this.form.check.city) {
          return true
        } else {
          return 'Необходимо выбрать город из списка'
        }
      } else {
        return 'Обязательно для заполнения'
      }
    }
  },
  watch: {
    'form.data.fullname': function() {
      this.form.check.fullname = false
    },
    'form.data.city': function() {
      this.form.check.city = false
      if (!this.form.data.city.trim()) {
        this.form.data.country = ''
      }
    }
  },
  data: () => ({
    select: {
      osphone: [
        'Android',
        'Kai OS',
        'Lineage OS',
        'Fire OS',
        'Flyme OS',
        'Fuchsia',
        'iOS',
        'Sailfish OS',
        'Tizen',
        'Remix OS'
      ]
    },
    form: {
      valid: true,
      check: {
        fullname: true,
        city: true
      },
      data: {
        login: '',
        fullname: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        osphone: ''
      }
    }
  }),
  mounted: function() {
    /* eslint-disable */
    $('#fullname').suggestions({
      /* eslint-enable */
      token: this.$store.state.secret,
      triggerSelectOnBlur: false,
      count: 5,
      type: 'NAME',
      onSelect: ({ data }) => {
        this.form.data.fullname = String(
          `${data.surname || ''} ${data.name || ''} ${data.patronymic || ''}`
        ).trim()
        this.$nextTick(() => {
          this.form.check.fullname = true
        })
      }
    })
    /* eslint-disable */
    $('#city').suggestions({
      /* eslint-enable */
      token: this.$store.state.secret,
      triggerSelectOnBlur: false,
      count: 5,
      type: 'ADDRESS',
      bounds: 'city',
      constraints: {
        locations: [
          {
            country: '*'
          }
        ]
      },
      onSelect: ({ data }) => {
        this.form.data.city = data.city
        this.form.data.country = data.country
        this.$nextTick(() => {
          this.form.check.city = true
        })
      }
    })
  }
}
</script>
