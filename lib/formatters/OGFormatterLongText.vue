<template>
  <div class="flex flex-row items-center justify-center text-center m-auto">
    <button :disabled="!props.data" @click="() => { state.modalShown = true }" data-test="openButton" class="og-btn og-btn-primary og-btn-circle" :title="props.l('open')">
      <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 min-w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    </button>

    <CustomContentModal 
      :l="props.l"
      :show="state.modalShown" 
      :title="props.formatter.title ? props.formatter.title : props.l('untitled')" :disableButtons="true" :close="() => { state.modalShown = false }">
      <template #content>
        <div v-if="props.data" class="w-full overflow-hidden whitespace-normal og-text-compact">{{ props.data }}</div>
        <div v-else class="w-full overflow-hidden whitespace-normal italic og-text-compact">
          {{ props.l('no_data') }}
        </div>
      </template>
    </CustomContentModal>
  </div>
</template>

<script setup lang="ts">
  import CustomContentModal from '../components/CustomContentModal.vue'
  import { reactive } from 'vue';
  import FormatterProps from './types/FormatterProps';
  import { LongTextFormatterConfigType } from '../components/model/OverGridConfig'
  const props = defineProps<FormatterProps<LongTextFormatterConfigType>>()

  const state = reactive({
    modalShown: false
  })
</script>


