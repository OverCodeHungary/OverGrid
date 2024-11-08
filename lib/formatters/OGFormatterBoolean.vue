<template>
  <span>
    {{ props.data ? props.l('yes') : props.l('no') }}
  </span>
</template>

<script setup lang="ts">
  import FormatterProps from './types/FormatterProps';
  import { ConfiglessFormatterConfigType } from '../components/model/OverGridConfig'
  const props = defineProps<FormatterProps<ConfiglessFormatterConfigType>>()
</script>