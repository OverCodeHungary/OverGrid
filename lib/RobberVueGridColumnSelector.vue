<template>
  <RVGModal :showModal="showModal" :onSuccess="() => { setColumns(); hideModal(); }" :onClose="() => { hideModal(); }">
    <template #head>
      <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
        {{ getLang('select-displayable-columns-modal-title') }}
      </h3>
    </template>
    <template #content>
      <div class="grid grid-cols-2 gap-2 mb-5">
        <label class="inline-flex items-center mb-2" v-for="(output, index) in checkboxOptions" :key="index">
          <input v-if="output.text != ''" :disabled="output.disabled"
            v-model="selected"
            :value="output.value"
            class="disabled:opacity-50 form-checkbox is-basic h-5 w-5 !rounded-full  border-slate-400/70 checked:!border-info checked:bg-info hover:!border-info focus:!border-info dark:border-navy-400"
            type="checkbox"
          />
          <p v-if="output.text != ''" :class="[{'opacity-40': output.disabled}]" class="pl-2 cursor-pointer">{{ output.text }}</p>
        </label>
      </div>
    </template>
  </RVGModal>
</template>

<script>
import l from './helpers/lang.js'
import RVGLocalStorageService from './RobberVueGrid.LocalStorage.js';
import RVGModal from './RobberVueGridModal.vue'

export default {
  name: 'RobberVueGridColumnSelector',
  props: ['columnSelectorConfig', 'dataMapping', 'rerender', 'showModal', 'hideModal'],
  components: {
    RVGModal
  },
  data() {
    return {
      selected: []
    }
  },
  mounted() {
    var currentValue = RVGLocalStorageService.getService().getStorageValue('columns_' + this.columnSelectorConfig.gridUniqueId);

    if(!currentValue) { // there is no stored value yet
      for(var i in this.dataMapping) {
        if(!this.dataMapping[i].visible) {
          continue;
        }
        this.selected.push(i);
      }
    }
    else {
      this.selected = currentValue.split(",");
      for(var j in this.dataMapping) {
        if(this.dataMapping[j].selectable === false) {
          this.selected.push(j);
        }
      }
    }

    
  },
  computed: {
    checkboxOptions() {
      var result = [];

      for(var i in this.dataMapping) {
        var cData = this.dataMapping[i];

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
    }
  },
  methods: {
    getLang(key) {
      return l(key);
    },
    setColumns() {
      RVGLocalStorageService.getService().setStorageValue('columns_' + this.columnSelectorConfig.gridUniqueId, this.selected.join(','))
      this.rerender();
    }
  }
}
</script>

<style scoped>

  .sectionCheckboxHolder {
    padding: 10px;
    border-radius: 30px;
    display: inline-block;
    width: calc(50% - 10px);
    margin: 5px;
    background: #434243;
    /* -webkit-transition: background-color .2s linear;
    -ms-transition: background-color .2s linear;
    transition: background-color .2s linear; */
  }

  .sectionCheckboxHolder:hover {
    background: #242424;
  }

  .sectionCheckboxHolder[disabled=disabled]:deep(.custom-control label) {
    color: #6c757d !important;
  }

  .sectionCheckboxHolder:deep(.custom-control) {
    display: inline-block;
    width: 100%;
    cursor: pointer;
    text-align: left;
    padding-left: 40px;
  }

  .sectionCheckboxHolder:deep(.custom-control label) {
    width: 100%;
    cursor: pointer;
  }
</style>
