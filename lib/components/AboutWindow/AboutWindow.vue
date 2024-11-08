<template>
  <CustomContentModal 
    :l="props.l"
    :show="state.showModal" 
    :title="props.l('about')" 
    :close="() => { props.closeModal() }"
    :cancelButtonTitle="props.l('close')" 
    :noNeedOkButton="true"
    >
    <template #content>
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl font-bold">OverGrid</h1>
        <!-- <p>
          <strong>{{ props.l('version') }}:</strong> {{ VERSION }}
        </p> -->
        <div class="mt-2">
          Licence: <strong>MIT</strong>
        </div>
        <div>
          All rights reserved overcode.hu.
        </div>
      </div>
    </template>
  </CustomContentModal>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import CustomContentModal from '../CustomContentModal.vue';

  //const VERSION = import.meta.env.PACKAGE_VERSION;

  const props = defineProps<{
    l: Function,
    closeModal: Function,
    showModal: boolean,
    closeDropdown: Function,
  }>();

  const state = reactive<{
    showModal: boolean
  }>({
    showModal: props.showModal
  });

  watch(() => props.showModal, (newValue) => {
    state.showModal = newValue;

    if(newValue) {
      props.closeDropdown();
    }
  }); 

</script>
