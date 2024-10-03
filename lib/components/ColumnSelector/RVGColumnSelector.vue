<template>
  <CustomContentModal 
    :show="state.showModal" 
    title="Oszlopok kiválasztása" 
    cancelButtonTitle="Mégse" 
    okButtonTitle="OK" 
    :close="() => { props.hideModal() }" 
    :ok="setColumns">
    <template #content>
      <div class="grid grid-cols-2 gap-2 mb-5">
        <label class="inline-flex items-center mb-2" v-for="(output, index) in checkboxOptions" :key="index">
          <input v-if="output.text != ''" :disabled="output.disabled"
            v-model="state.selected"
            :value="output.value"
            class="disabled:opacity-50 form-checkbox is-basic h-5 w-5 !rounded-full  border-slate-400/70 checked:!border-info checked:bg-info hover:!border-info focus:!border-info dark:border-navy-400"
            type="checkbox"
          />
          <p v-if="output.text != ''" :class="[{'opacity-40': output.disabled}]" class="pl-2 cursor-pointer">{{ output.text }}</p>
        </label>
      </div>
    </template>
  </CustomContentModal>

</template>

<script setup>
  import { onMounted, reactive, computed, watch } from 'vue';
  import CustomContentModal from '../CustomContentModal.vue';

  const props = defineProps({
    gridUniqueId: String,
    dataMapping: Object,
    rerender: Function,
    showModal: Boolean,
    hideModal: Function
  });

  const state = reactive({
    showModal: props.showModal,
    selected: []
  });

  watch(() => props.showModal, (value) => {
    state.showModal = value;
  });

  onMounted(() => {
    var currentValue = localStorage.getItem('columns_' + props.gridUniqueId);

    if(!currentValue) { // there is no stored value yet
      for(var i in props.dataMapping) {
        if(!props.dataMapping[i].visible) {
          continue;
        }
        state.selected.push(i);
      }
    }
    else {
      state.selected = currentValue.split(",");
      for(var j in props.dataMapping) {
        if(props.dataMapping[j].selectable === false) {
          state.selected.push(j);
        }
      }
    }
  });

  const checkboxOptions = computed(() => {
    var result = [];

    for(var i in props.dataMapping) {
      var cData = props.dataMapping[i];

      if(!cData.visible) {
        continue;
      }

      result.push({
        text: cData.title,
        value: i, 
        disabled: cData.selectable === false
      });
    }

    return result;
  });

  function setColumns() {
    localStorage.setItem('columns_' + props.gridUniqueId, state.selected.join(','))
    props.rerender();
    props.hideModal();
  }

</script>
