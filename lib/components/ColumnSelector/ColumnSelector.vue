<template>
  <CustomContentModal 
    :show="state.showModal" 
    :title="i18n.l('select_columns')" 
    :close="() => { props.closeModal() }" 
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
</template>

<script setup lang="ts">
  import { onMounted, reactive, computed, watch } from 'vue';
  import CustomContentModal from '../CustomContentModal.vue';
  import useI18n from '../../composables/useI18n';
  import { MappingRecordType } from '../model/OverGridConfig';
  const i18n = useI18n('hu');

  const props = defineProps<{
    gridUniqueId: string,
    dataMapping: Record<string, MappingRecordType>,
    rerender: Function,
    closeModal: Function,
    closeDropdown: Function,
    showModal: boolean
  }>();

  const state = reactive<{
    showModal: boolean,
    selected: Array<string>
  }>({
    showModal: props.showModal,
    selected: []
  });

  watch(() => props.showModal, (newValue) => {
    state.showModal = newValue;

    if(newValue) {
      props.closeDropdown();
    }
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
    props.closeModal()
  }

</script>
