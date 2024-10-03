<template>
  <div v-if="props.showModal" class="fixed w-full inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5">
    <div class="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
    <div class="scrollbar-sm relative flex flex-col overflow-y-auto rounded-lg bg-white px-4 pb-4 transition-all duration-300 dark:bg-navy-700 sm:px-5">
      <div class="my-3 flex h-8 items-center justify-between">
        <slot name="head"></slot>
        <button @click="() => { props.onClose(); }" class="btn -mr-1.5 h-7 w-7 !rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="scrollbar-sm min-w-full overflow-auto">
        <slot name="content"></slot>
      </div>
      <div class="flex flex-row items-center justify-end gap-3" v-if="props.onClose && props.onSuccess">
        <button v-if="props.onClose" @click="() => { props.onClose(); }" class="btn min-w-[7rem] !rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90">
          {{ l('cancel') }}
        </button>
        <button v-if="props.onSuccess" @click="() => { props.onSuccess(); }" class="btn min-w-[7rem] !rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
          {{ l('apply') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import l from './helpers/lang.js'

  const props = defineProps({
    showModal: {
      type: Boolean,
      default: false
    },
    onSuccess: {
      type: Function,
      required: false
    },
    onClose: {
      type: Function,
      required: false
    }
  })
</script>