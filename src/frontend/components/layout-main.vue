<template>
  <div :class="{ 'ml-5': $vuetify.breakpoint.mdAndUp }">
    <v-layout row wrap>
      <v-flex xs12>
        <div class="display-3">
          <span class="font-weight-black mr-3">Web</span>
          <span class="font-weight-thin">App</span>
        </div>
      </v-flex>
      <v-flex xs12 mt-5>
        <div class="title">{{ title }}</div>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-4>
      <v-flex xs12 sm8 md6 lg4 xl3>
        <slot name="form"></slot>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-5>
      <v-flex xs12 sm8 md6 lg4 xl3>
        <slot name="action"></slot>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-5>
      <slot name="footer"></slot>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="sass" scoped>
.v-btn--large
  height: 54px
</style>
