<template>
  <div :class="currentStatus.classList">
    {{ currentStatus.title }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import PropsConfig from './types/FormatterProps';
  import { StatusFormatterConfigType } from '../components/model/OverGridConfig'
  const props = defineProps<PropsConfig<StatusFormatterConfigType>>();

  const currentStatus = computed<{
    classList: string;
    title: string;
  }>(() => {
    if(!props.formatter.dataType || props.formatter.dataType == 'text') {
      for (const i in props.formatter.mapping) {
        if (i == props.data) {
          return props.formatter.mapping[i];
        }
      }
    }

    if(props.formatter.dataType && props.formatter.dataType == 'integer') {
      for (const j in props.formatter.mapping) {
        if (window.parseInt(j) == props.data) {
          return props.formatter.mapping[j];
        }
      }
    }

    if(props.formatter.dataType && props.formatter.dataType == 'boolean') {
      if (props.data) {
        return props.formatter.mapping['true'];
      } else {
        return props.formatter.mapping['false'];
      }
    }

    return { classList: '', title: '' };
  });
</script>

