<template>
  <div class="flex flex-row items-center justify-start gap-2">
    <span>{{ formattedDate }}</span>
    <span class="opacity-50 italic" v-if="!props.data">[{{ i18n.l('no_data') }}]</span>
  </div>
</template>

<script setup lang="ts">
  import moment from 'moment';
  import { computed } from 'vue';
  import useI18n from '../composables/useI18n';
  const i18n = useI18n('hu');
  import FormatterProps from './types/FormatterProps';
  import { DateFormatterConfigType } from '../components/model/OverGridConfig'
  const props = defineProps<FormatterProps<DateFormatterConfigType>>()

  const formattedDate = computed(() => {
    if(!props.data) {
      return '';
    }
    return moment(props.data, props.formatter.inputFormat || undefined).format(props.formatter.outputFormat);
  })
</script>

