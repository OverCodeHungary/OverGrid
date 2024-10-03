<template>
  <div class="RVGHTML" v-html="this.data">
  </div>
</template>

<script>
export default {
  name: "RVGHTML",
  components: {
  },
  props: ['data'],
  computed: {
  },
  mounted() {
  }
};
</script>

<style scoped>
</style>
