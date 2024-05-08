<template>
  <v-app>
    <v-progress-linear
      :indeterminate="$store.state.loader"
      class="mt-0 v-progress-linear--fixed"
    ></v-progress-linear>
    <v-content>
      <v-container fluid>
        <keep-alive>
          <router-view />
        </keep-alive>
      </v-container>
    </v-content>
    <v-footer app height="80">
      <v-btn
        flat
        :disabled="$store.state.loader"
        :class="{ 'ml-5': $vuetify.breakpoint.mdAndUp }"
      >
        <v-icon left>mail_outline</v-icon>написать в поддержку
      </v-btn>
    </v-footer>
    <snackbar-info></snackbar-info>
  </v-app>
</template>

<script>
import snackbarInfo from '@/components/snackbar-info.vue'

export default {
  components: {
    snackbarInfo
  }
}
</script>

<style lang="sass" scoped>
.v-progress-linear--fixed
  position: fixed
</style>
