<template>
  <div class="fixed w-full h-full top-0 left-0" v-if="state.show">
    <div class="absolute w-full h-full bg-slate-900/60"></div>
    <div class="flex align-items-center justify-center w-full py-8">
      <div class="relative flex w-full max-w-2xl origin-top flex-col overflow-hidden rounded-lg bg-white dark:bg-navy-700">
        <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
          <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
            {{ title }}
          </h3>
          <button @click="close()" class="btn -mr-1.5 h-7 w-7 !rounded-full !p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="scrollbar-sm overflow-y-auto px-4 py-4 sm:px-5" :class="[{ '!overflow-y-visible': overflowVisible }]">
          <slot name="content"></slot>
          <div v-if="disableButtons !== true" class="space-x-2 text-right mt-3 flex flex-row items-center justify-end">
            <button @click="close()" :disabled="okButtonLoading" class="disabled:opacity-60 btn min-w-[7rem] !rounded-full h-9 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80">
              {{ cancelButtonTitle ? cancelButtonTitle : i18n.l('cancel') }}
            </button>
            <button v-if="!noNeedOkButton" :disabled="okButtonLoading || disableOkButton" @click="() => { ok(close); }" class="og-btn-primary">
              <span v-if="!okButtonLoading">{{ okButtonTitle ? okButtonTitle : i18n.l('ok') }}</span>
              <SpinnerLoader v-else sizeClasses="h-5.5 w-5.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { watch, reactive } from 'vue';
  import SpinnerLoader from './SpinnerLoader.vue';
  import useI18n from '../composables/useI18n';
  const i18n = useI18n('hu');

  const props = defineProps({
    show: {
      required: true
    },
    title: {
      type: String,
      required: true
    },
    cancelButtonTitle: {
      type: String
    },
    okButtonTitle: {
      type: String
    },
    close: {
      type: Function,
      required: true
    },
    ok: {
      type: Function,
      required: false
    },
    disableButtons: {
      type: Boolean,
      default: false,
      required: false
    },
    disableOkButton: {
      type: Boolean,
      default: false,
      required: false
    },
    okButtonLoading: {
      type: Boolean,
      default: false,
      required: false
    },
    noNeedOkButton: {
      type: Boolean,
      default: false,
      required: false
    },
    maxWidthClass: {
      type: String,
      default: 'max-w-2xl',
      required: false
    },
    overflowVisible: {
      type: Boolean,
      default: false,
      required: false
    }
  });

  const state = reactive({
    show: props.show
  });

  watch(() => props.show, (newVal) => {
    state.show = newVal;
  });

</script>