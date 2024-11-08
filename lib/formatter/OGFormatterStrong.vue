<template>
  <div class="font-bold og-text-compact">
    {{ props.data }}
  </div>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  import { ConfiglessFormatterConfigType } from '../components/model/OverGridConfig'
  const props = defineProps<FormatterProps<ConfiglessFormatterConfigType>>()
</script>


