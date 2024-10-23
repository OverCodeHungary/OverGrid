<template>
  <span v-html="craftedData"></span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import FormatterProps from './types/FormatterProps';
  import { HighlightFormatterConfigType } from '../components/model/OGConfig'
  const props = defineProps<FormatterProps<HighlightFormatterConfigType>>()

  const craftedData = computed(() => {
    var cut = props.data;
    if(props.config && props.config.maxLength) {
      cut = cut.slice(0, props.config.maxLength) + "..."
    }

    if(props.config && props.config.highlights) {
      for(var i in props.config.highlights) {
        var chl = props.config.highlights[i];
        cut = cut.replace(chl.regexp, '<strong style="' + chl.style + '">$1</strong>')
      }
    }

    return cut;
  })
</script>

