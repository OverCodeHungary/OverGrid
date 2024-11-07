<template>
  <span v-if="!props.formatter.hideWhenEmpty || data" :class="[props.formatter.classList]">
    {{ data }}
  </span>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  import { TailwindClassFormatterConfigType } from '../components/model/OverGridConfig'
  const props = defineProps<FormatterProps<TailwindClassFormatterConfigType>>()
</script>
