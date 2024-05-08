<template>
  <v-snackbar
    top
    right
    multi-line
    vertical
    v-model="snackbar"
    :color="($store.state.snackbar[0] || {}).color"
    :timeout="5000"
  >
    {{ ($store.state.snackbar[0] || {}).text }}
    <v-btn dark flat @click="snackbar = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: false
  }),
  watch: {
    '$store.state.snackbar': function() {
      if (this.snackbar == false && this.$store.state.snackbar.length) {
        this.snackbar = true
      }
    },
    snackbar: function() {
      if (this.snackbar == false) {
        setTimeout(() => {
          if (this.$store.state.snackbar) this.$store.state.snackbar.shift()
        }, 500)
      }
    }
  }
}
</script>
