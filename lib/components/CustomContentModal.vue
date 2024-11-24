<template>
  <Transition name="og-anim-modal-fade">
    <div class="fixed w-full h-full top-0 left-0 z-30" v-show="state.show">
      <div class="absolute w-full h-full bg-slate-900/60"></div>
      <Transition name="og-anim-modal">
        <div class="flex align-items-center justify-center w-full py-8" v-show="state.show">
          <div class="relative flex w-full max-w-2xl origin-top flex-col overflow-hidden rounded-lg bg-white dark:bg-navy-700">
            <div class="flex justify-between items-center rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
              <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                {{ title }}
              </h3>
              <button @click="close()" class="-mr-1.5 !h-5 w-5 !rounded-full !p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="scrollbar-sm overflow-y-auto px-4 py-4 sm:px-5" :class="[{ '!overflow-y-visible': overflowVisible }]">
              <slot name="content"></slot>
              <div v-if="disableButtons !== true" class="mt-3 flex flex-row items-center justify-end gap-1">
                <button @click="close()" :disabled="okButtonLoading" class="og-btn og-btn-secondary og-btn-rounded og-text-compact">
                  {{ cancelButtonTitle ? cancelButtonTitle : props.l('cancel') }}
                </button>
                <button v-if="!noNeedOkButton" :disabled="okButtonLoading || disableOkButton" @click="() => { if(props.ok) { props.ok() } }" class="og-btn og-btn-primary og-btn-rounded og-text-compact min-w-24 font-bold uppercase">
                  <span v-if="!okButtonLoading">{{ okButtonTitle ? okButtonTitle : props.l('ok') }}</span>
                  <SpinnerLoader v-else sizeClasses="h-5.5 w-5.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { watch, reactive } from 'vue';
  import SpinnerLoader from './SpinnerLoader.vue';

  const props = defineProps({
    l: {
      type: Function,
      required: true
    },
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

<style scoped>
  .og-anim-modal-enter-active,
  .og-anim-modal-leave-active {
    transform: scale3d(1, 1, 1);
    transform-origin: center center;
    transition: ease 0.2s;
  }
  .og-anim-modal-enter-from,
  .og-anim-modal-leave-to {
    transform: scale3d(0, 0, 1);
  }

  .og-anim-modal-fade-enter-active,
  .og-anim-modal-fade-leave-active {
    transition: ease 0.2s;
  }
  .og-anim-modal-fade-enter-from,
  .og-anim-modal-fade-leave-to {
    opacity: 0;
  }
</style>