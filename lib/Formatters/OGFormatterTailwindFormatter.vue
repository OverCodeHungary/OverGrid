<template>
  <span v-if="!props.config.formatter.hideWhenEmpty || data" :class="['OGFormatterTailwindFormatter', props.config.formatter.classList]">
    {{ data }}
  </span>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  const props = defineProps<FormatterProps>()
</script>
