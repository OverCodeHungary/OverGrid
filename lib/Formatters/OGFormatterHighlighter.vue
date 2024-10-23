<template>
  <span v-html="craftedData"></span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import FormatterProps from './types/FormatterProps';
  import { HighlightFormatterConfigType } from '../components/model/OverGridConfig'
  const props = defineProps<FormatterProps<HighlightFormatterConfigType>>()

  const craftedData = computed(() => {
    var cut = props.data;
    if(props.formatter && props.formatter.maxLength) {
      cut = cut.slice(0, props.formatter.maxLength) + "..."
    }

    if(props.formatter && props.formatter.highlights) {
      for(var i in props.formatter.highlights) {
        var chl = props.formatter.highlights[i];
        cut = cut.replace(chl.regexp, '<strong style="' + chl.style + '">$1</strong>')
      }
    }

    return cut;
  })
</script>

