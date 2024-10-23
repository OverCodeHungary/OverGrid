<template>
  <div class="relative" :id="componentId">
    <span class="z-10" @click="toggleOpen">
      <slot></slot>
    </span>
    <Transition :name="'og-anim-dd-' + props.orientation">
      <div v-show="state.open" class="absolute mt-2 z-20 flex items-center justify-start p-2 px-3 rounded-md w-[250px] og-dropdown" :class="[{ 'right-0': props.orientation == 'left' }, { 'left-0': props.orientation == 'right' }, 'og-theme-' + props.theme]">
        <slot name="content"></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';

  const componentId = 'dd' + Math.random().toString(36).substring(7);

  const props = defineProps({
    theme: {
      type: String,
      default: 'default'
    },
    orientation: {
      type: String,
      default: 'left'
    }
  });

  const state = reactive({
    open: false
  });

  function outsideClickClose(event: MouseEvent) {
    // if(!event.target.closest('#' + componentId)) {
    //   state.open = false;
    // }
  }

  watch(() => state.open, (newValue) => {
    if(newValue) {
      document.addEventListener('click', outsideClickClose);
    }
    else {
      document.removeEventListener('click', outsideClickClose);
    }
  });

  function toggleOpen() {
    state.open = !state.open;
  }

  function close() {
    state.open = false;
  }

  defineExpose<{
    close: () => void;
  }>({
    close
  });

</script>

<style scoped>
  .og-anim-dd-left-enter-active,
  .og-anim-dd-left-leave-active {
    transform: scale3d(1, 1, 1);
    transform-origin: top right;
    transition: ease 0.2s;
  }
  .og-anim-dd-left-enter-from,
  .og-anim-dd-left-leave-to {
    transform: scale3d(0, 0, 1);
  }

  .og-anim-dd-right-enter-active,
  .og-anim-dd-right-leave-active {
    transform: scale3d(1, 1, 1);
    transform-origin: top left;
    transition: ease 0.2s;
  }
  .og-anim-dd-right-enter-from,
  .og-anim-dd-right-leave-to {
    transform: scale3d(0, 0, 1);
  }
</style>