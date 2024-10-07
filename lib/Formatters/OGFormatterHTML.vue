<template>
  <div class="OGFormatterHTML" v-html="this.data">
  </div>
</template>

<script>
export default {
  name: "OGFormatterHTML",
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
