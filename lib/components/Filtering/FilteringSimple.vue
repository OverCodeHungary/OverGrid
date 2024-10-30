<template>
  <div class="flex flex-col sm:flex-row gap-2 sm:gap-1 items-start sm:items-center w-full"> 
    <div class="relative flex h-8 w-full">
      <input v-model="state.filter" :placeholder="placeholder" class="og-form-input og-text-compact !pl-8">
      <div class="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.316 13.781l.73-.171-.73.171zm0-5.457l.73.171-.73-.171zm15.473 0l.73-.171-.73.171zm0 5.457l.73.171-.73-.171zm-5.008 5.008l-.171-.73.171.73zm-5.457 0l-.171.73.171-.73zm0-15.473l-.171-.73.171.73zm5.457 0l.171-.73-.171.73zM20.47 21.53a.75.75 0 101.06-1.06l-1.06 1.06zM4.046 13.61a11.198 11.198 0 010-5.115l-1.46-.342a12.698 12.698 0 000 5.8l1.46-.343zm14.013-5.115a11.196 11.196 0 010 5.115l1.46.342a12.698 12.698 0 000-5.8l-1.46.343zm-4.45 9.564a11.196 11.196 0 01-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46zM8.496 4.046a11.198 11.198 0 015.115 0l.342-1.46a12.698 12.698 0 00-5.8 0l.343 1.46zm0 14.013a5.97 5.97 0 01-4.45-4.45l-1.46.343a7.47 7.47 0 005.568 5.568l.342-1.46zm5.457 1.46a7.47 7.47 0 005.568-5.567l-1.46-.342a5.97 5.97 0 01-4.45 4.45l.342 1.46zM13.61 4.046a5.97 5.97 0 014.45 4.45l1.46-.343a7.47 7.47 0 00-5.568-5.567l-.342 1.46zm-5.457-1.46a7.47 7.47 0 00-5.567 5.567l1.46.342a5.97 5.97 0 014.45-4.45l-.343-1.46zm8.652 15.28l3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06z"></path>
        </svg>
      </div>
    </div>
    <div v-if="helpText" class=" og-bg-primary text-white p-1 px-3 flex flex-row gap-1 rounded-lg items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <span class="og-text-compact whitespace-nowrap">{{ helpText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

  import { reactive, watch, computed } from 'vue';
  import useI18n from '../../composables/useI18n';
  const i18n = useI18n('hu');

  const props = defineProps({
    setFilter: {
      type: Function,
      required: true,
      default: () => {}
    },
    config: {
      type: Object,
      required: false,
      default: () => {}
    }
  });

  const state = reactive({
    filter: ''
  });

  let interval: NodeJS.Timeout | null = null;

  watch(() => state.filter, (newValue) => {
    if(interval) {
      clearInterval(interval);
    }
    interval = setTimeout(() => {
      props.setFilter(newValue);
    }, 500);
  });

  const placeholder = computed(() => {
    if(props.config && props.config.filtering && props.config.filtering.simplePlaceholder) {
      return props.config.filtering.simplePlaceholder;
    }
    else {
      return i18n.l('search')
    }
  });

  const helpText = computed(() => {
    if(props.config && props.config.filtering && props.config.filtering.simpleHelpText) {
      return props.config.filtering.simpleHelpText;
    }
    else {
      return false
    }
  });
</script>
