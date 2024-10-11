<template>
  <span v-html="craftedData"></span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import FormatterProps from './types/FormatterProps';
  const props = defineProps<FormatterProps>()

  const craftedData = computed(() => {
    var cut = props.data;
    if(props.config.formatter && props.config.formatter.maxLength) {
      cut = cut.slice(0, props.config.formatter.maxLength) + "..."
    }

    if(props.config.formatter && props.config.formatter.highlights) {
      for(var i in props.config.formatter.highlights) {
        var chl = props.config.formatter.highlights[i];
        cut = cut.replace(chl.regexp, '<strong style="' + chl.style + '">$1</strong>')
      }
    }

    return cut;
  })
</script>

