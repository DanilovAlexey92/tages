<template>
  <v-card class="mx-auto" color="#26c6da" dark max-width="600">
    <v-card-title>
      <span class="title font-weight-light">Профиль</span>
    </v-card-title>
    <v-card-text class="headline font-weight-bold"
      >Это закрытая область, доступна только авторизованным
      пользователям</v-card-text
    >
    <v-card-actions>
      <v-list-tile class="grow">
        <v-list-tile-avatar color="grey darken-3">
          <v-img
            class="elevation-6"
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-img>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{
            $store.state.profile.login
          }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-btn @click="submit" :disabled="$store.state.loader">выход</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  methods: {
    submit: function() {
      this.$api('auth/signout').then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
