<template>
  <span v-if="!config.formatter.hideWhenEmpty || data" :class="['OGFormatterTailwindFormatter', config.formatter.classList]">
    {{ data }}
  </span>
</template>

<script>
export default {
  name: "OGFormatterTailwindFormatter",
  components: {
  },
  props: ['data', 'config', 'rowid']
};
</script>

<style scoped>
</style>
