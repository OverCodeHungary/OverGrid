<template>
  <div>
    <ul>
      <li>
        <a href="javascript:void(null)" @click="() => { state.showModal = true; }" class="flex flex-row gap-1 items-center ml-1 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span class="og-text-compact">{{ i18n.l('select_columns') }}</span>
        </a>
      </li>
    </ul>
    <CustomContentModal 
      :show="state.showModal" 
      :title="i18n.l('select_columns')" 
      :close="() => { state.showModal = false; }" 
      :ok="setColumns">
      <template #content>
        <div class="grid grid-cols-2 gap-2 mb-5">
          <label class="inline-flex items-center mb-2" v-for="(output, index) in checkboxOptions" :key="index">
            <input v-if="output.text != ''" :disabled="output.disabled"
              v-model="state.selected"
              :value="output.value"
              class="og-checkbox"
              type="checkbox"
            />
            <p v-if="output.text != ''" :class="[{'opacity-40': output.disabled}]" class="pl-2 cursor-pointer">{{ output.text }}</p>
          </label>
        </div>
      </template>
    </CustomContentModal>
  </div>
</template>

<script setup>
  import { onMounted, reactive, computed, watch } from 'vue';
  import CustomContentModal from '../CustomContentModal.vue';
  import useI18n from '../../composables/useI18n';
  const i18n = useI18n('hu');

  const props = defineProps({
    gridUniqueId: String,
    dataMapping: Object,
    rerender: Function,
    closeDropdown: Function,
  });

  const state = reactive({
    showModal: props.showModal,
    selected: []
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
    state.showModal = false;
  }

</script>
