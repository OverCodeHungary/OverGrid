<template>
  <div class="font-bold og-text-compact">
    {{ props.data }}
  </div>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  const props = defineProps<FormatterProps>()
</script>


