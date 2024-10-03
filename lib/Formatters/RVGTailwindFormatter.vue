<template>
  <span v-if="!config.formatter.hideWhenEmpty || data" :class="['RVGTailwindFormatter', config.formatter.classList]">
    {{ data }}
  </span>
</template>

<script>
export default {
  name: "RVGTailwindFormatter",
  components: {
  },
  props: ['data', 'config', 'rowid']
};
</script>

<style scoped>
</style>
