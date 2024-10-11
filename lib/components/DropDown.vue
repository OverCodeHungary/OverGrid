<template>
  <div class="relative" :id="componentId">
    <span class="z-10" @click="toggleOpen">
      <slot></slot>
    </span>
    <div v-show="state.open" class="absolute right-0 mt-2 z-20 flex items-center justify-start p-2 px-3 rounded-md w-64 bg-slate-200">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
  import { reactive, watch } from 'vue';

  const componentId = 'dd' + Math.random().toString(36).substring(7);

  const state = reactive({
    open: false
  });

  function outsideClickClose(event) {
    if(!event.target.closest('#' + componentId)) {
      state.open = false;
    }
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

  defineExpose({
    close
  });

</script>