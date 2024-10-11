<template>
  <div class="font-bold">
    {{ props.data }}
  </div>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  const props = defineProps<FormatterProps>()
</script>


