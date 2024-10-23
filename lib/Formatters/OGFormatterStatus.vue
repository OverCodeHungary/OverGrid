<template>
  <div :class="currentStatus.classList">
    {{ currentStatus.title }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import PropsConfig from './types/FormatterProps';
  import { StatusFormatterConfigType } from '../components/model/OGConfig'
  const props = defineProps<PropsConfig<StatusFormatterConfigType>>();

  const currentStatus = computed<{
    classList: string;
    title: string;
  }>(() => {
    if(!props.config.dataType || props.config.dataType == 'text') {
      for (const i in props.config.mapping) {
        if (i == props.data) {
          return props.config.mapping[i];
        }
      }
    }

    if(props.config.dataType && props.config.dataType == 'integer') {
      for (const j in props.config.mapping) {
        if (window.parseInt(j) == props.data) {
          return props.config.mapping[j];
        }
      }
    }

    if(props.config.dataType && props.config.dataType == 'boolean') {
      if (props.data) {
        return props.config.mapping['true'];
      } else {
        return props.config.mapping['false'];
      }
    }

    return { classList: '', title: '' };
  });
</script>

