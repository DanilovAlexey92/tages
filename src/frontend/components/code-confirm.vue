<template>
  <v-dialog v-model="param.show" persistent max-width="400">
    <v-card>
      <v-card-title class="headline">Подтверждение операции</v-card-title>
      <v-card-text>SMS-ключ был отправлен</v-card-text>
      <v-card-text>
        <v-form v-on:submit.prevent v-model="form.valid" ref="form">
          <v-text-field
            @keyup.enter="submit()"
            autofocus
            :counter="4"
            maxlength="4"
            :rules="[
              v => !!v || 'Заполните поле',
              v => /\d{4}/.test(v) || 'Неверное значение'
            ]"
            v-model="code"
            :disabled="$store.state.loader"
            label="Код"
            type="text"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="$store.state.loader"
          flat
          @click="param.show = false"
          >Назад</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="!form.valid || $store.state.loader"
          @click="next"
          >Подтвердить</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['param'],
  data() {
    return {
      form: {
        valid: false
      },
      code: ''
    }
  },
  methods: {
    submit: function() {
      if (this.form.valid) {
        this.next()
      }
    },
    next: function() {
      this.$emit('next', this.code)
    }
  },
  watch: {
    'param.show': function() {
      this.$refs.form.reset()
    }
  }
}
</script>
