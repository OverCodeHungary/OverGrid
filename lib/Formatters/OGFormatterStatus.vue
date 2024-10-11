<template>
  <div :class="currentStatus.classList">
    {{ currentStatus.title }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import PropsConfig from './types/FormatterProps';

  const props = defineProps<PropsConfig>();

  const currentStatus = computed<{
    classList: string;
    title: string;
  }>(() => {
    if(!props.config.formatter.dataType || props.config.formatter.dataType == 'text') {
      for (const i in props.config.formatter.mapping) {
        if (i == props.data) {
          return props.config.formatter.mapping[i];
        }
      }
    }

    if(props.config.formatter.dataType && props.config.formatter.dataType == 'integer') {
      for (const j in props.config.formatter.mapping) {
        if (window.parseInt(j) == props.data) {
          return props.config.formatter.mapping[j];
        }
      }
    }

    if(props.config.formatter.dataType && props.config.formatter.dataType == 'boolean') {
      if (props.data) {
        return props.config.formatter.mapping['true'];
      } else {
        return props.config.formatter.mapping['false'];
      }
    }

    return { classList: '', title: '' };
  });
</script>

