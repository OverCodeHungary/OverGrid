<template>
  <ul>
    <li>
      <h3 class="font-bold og-text-compact">
        {{ props.l('auto_refresh_menu_title') }}
      </h3>
    </li>
    <li v-if="props.config?.refreshable.autoCanBeDisabled">
      <a href="javascript:void(null)" @click="changeAutoRefreshValue('disabled')" class="flex flex-row gap-1 items-center ml-1 mt-1 og-text-compact og-operation-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" :class="[{ '!text-red-500': state.autoRefresh == 'disabled' }]" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="">{{ props.l('automatic-list-update-disabled') }}</span>
      </a>
    </li>
    <li v-for="(value) in props.config?.refreshable.autoValues" :key="value.key" >
      <a href="javascript:void(null)" @click="changeAutoRefreshValue(value.key)" class="flex flex-row gap-1 items-center ml-1 mt-1 og-text-compact  og-operation-link">
        <svg xmlns="http://www.w3.org/2000/svg"  class="h-4 w-4 mr-1" :class="[{ '!text-red-500': state.autoRefresh == value.key }]" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="">{{ value.title }}</span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue';

  const props = defineProps({
    config: Object,
    l: {
      type: Function,
      required: true
    },
    gridRefresh: {
      type: Function,
      required: true
    }
  });

  const state = reactive<{
    autoRefresh: string | null,
    autoRefreshInterval: ReturnType<typeof setInterval> | null
  }>({
    autoRefresh: null,
    autoRefreshInterval: null
  });

  function setAutoRefreshIntervalIfAny() {
    if(state.autoRefreshInterval) { // clearing the current interval, if any
      clearInterval(state.autoRefreshInterval);
      state.autoRefreshInterval = null;
    }

    if(!state.autoRefresh || state.autoRefresh == "disabled") { // if autoRefresh is not exists or its disabled, we should not start any interval task
      return ;
    }

    // finding the new refresh type, because we need the interval value
    var newRefreshType = null;
    if(props.config?.refreshable && props.config.refreshable.autoValues && props.config.refreshable.autoValues.length > 0) {
      for(var i in props.config.refreshable.autoValues) {
        if(props.config.refreshable.autoValues[i].key == state.autoRefresh) {
          newRefreshType = props.config.refreshable.autoValues[i];
          break;
        }
      }
    }

    if(newRefreshType) {
      state.autoRefreshInterval = setInterval(() => {
        props.gridRefresh()
      }, newRefreshType.refreshInterval * 1000);
    }
  }

  function changeAutoRefreshValue(key: string) {
    state.autoRefresh = key;
    if(props.config?.refreshable && props.config.gridUniqueId) {
      localStorage.setItem('autorefreshvalue_' + props.config.gridUniqueId, state.autoRefresh)
    }
    setAutoRefreshIntervalIfAny();
  }

  onMounted(() => {
    if(props.config?.refreshable && props.config.gridUniqueId) {
      var currentAutoRefreshValue = localStorage.getItem('autorefreshvalue_' + props.config.gridUniqueId)
      if(currentAutoRefreshValue) {
        state.autoRefresh = currentAutoRefreshValue;
        setAutoRefreshIntervalIfAny();
      }
      else {
        if(props.config.refreshable.defaultValue) {
          state.autoRefresh = props.config.refreshable.defaultValue;
          setAutoRefreshIntervalIfAny();
        }
      }
    }
  })
</script>