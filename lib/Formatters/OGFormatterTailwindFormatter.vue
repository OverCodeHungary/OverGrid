<template>
  <span v-if="!props.config.hideWhenEmpty || data" :class="[props.config.classList]">
    {{ data }}
  </span>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  import { TailwindClassFormatterConfigType } from '../components/model/OGConfig'
  const props = defineProps<FormatterProps<TailwindClassFormatterConfigType>>()
</script>
