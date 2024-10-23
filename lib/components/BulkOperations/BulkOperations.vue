<template>
  <span>
    <select :disabled="state.checkedRows.length <= 0" v-model="state.bulkMethod" @change="onBulkMethod" class="disabled:opacity-40 h-8 rounded-lg border px-2.5 og-text-compact">
      <option v-if="state.checkedRows.length <= 0" value="null">{{ i18n.l('bulk_method') }}</option>
      <option v-else value="null">{{ i18n.l('selected_rows', { selectedCount: state.checkedRows?.length.toString() }) }}</option>
      <option v-for="method in props.config.bulkOperation.methods" :value="method.key" :key="method.key">{{ method.title }}</option>
    </select>
  </span>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import useI18n from '../../composables/useI18n';
  const i18n = useI18n('hu');

  const props = defineProps({
    config: {
      type: Object,
      required: true
    },
    changeCheckedRows: {
      type: Function,
      required: true
    },
    checkedRows: {
      type: Array,
      required: true
    }
  })

  const state = reactive<{
    checkedRows: Array<any>,
    bulkMethod: null | string
  }>({
    checkedRows: props.checkedRows,
    bulkMethod: null
  })

  watch(() => props.checkedRows, (value) => {
    state.checkedRows = value;
  })

  function onBulkMethod() {
    let actionFn;
    for(var i in props.config.bulkOperation.methods) {
      if(props.config.bulkOperation.methods[i].key == state.bulkMethod) {
        actionFn = props.config.bulkOperation.methods[i].action;
        break;
      }
    }
    
    if(actionFn) {
      actionFn(state.checkedRows, () => {
        state.bulkMethod = "null";
        state.checkedRows = [];
      });
    }
  }

  watch(() => state.checkedRows, () => {
    props.changeCheckedRows(state.checkedRows);

    if(props.config.events && props.config.events.onBulkSelectChanges) {
      props.config.events.onBulkSelectChanges(state.checkedRows);
    }
  })
</script>