<template>
  <span v-if="!props.formatter.hideWhenEmpty || data" :class="[props.formatter.classList]">
    {{ data }}
  </span>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  import { TailwindClassFormatterConfigType } from '../components/model/OGConfig'
  const props = defineProps<FormatterProps<TailwindClassFormatterConfigType>>()
</script>
