<template>
  <span>
    {{ props.data ? i18n.l('yes') : i18n.l('no') }}
  </span>
</template>

<script setup lang="ts">
  import useI18n from '../composables/useI18n';
  const i18n = useI18n('hu');
  import FormatterProps from './types/FormatterProps';
  const props = defineProps<FormatterProps>()
</script>