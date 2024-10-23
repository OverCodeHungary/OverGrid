<template>
  <ul>
    <li>
      <h3 class="font-bold og-text-compact">{{ i18n.l('page_size') }}</h3>
    </li>
    <li v-for="(possiblePageSize, key) in props.config.pagination.possiblePageSizes" :key="key">
      <a href="javascript:void(null)" @click="changePageSize(possiblePageSize)" class="flex flex-row gap-1 items-center ml-1 mt-1 og-text-compact og-operation-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" :class="[{ '!text-red-500': state.pageSize == possiblePageSize }]" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span>{{ i18n.l('rows_per_page', { possiblePageSize }) }}</span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { onMounted, reactive, nextTick } from 'vue';
  import useI18n from '../../composables/useI18n';
  const i18n = useI18n('hu');

  const props = defineProps({
    config: {
      type: Object,
      required: true,
    },
    changePageSize: {
      type: Function,
      required: true,
    }
  });

  const state = reactive<{
    pageSize: number
  }>({
    pageSize: 10
  });

  function changePageSize(size: number) {
    state.pageSize = size;
    if(props.config.gridUniqueId) {
      localStorage.setItem('pagesizevalue_' + props.config.gridUniqueId, size.toString());
    }

    nextTick(() => {
      props.changePageSize(state.pageSize);
    })
  }

  onMounted(() => {
    if(props.config.pagination && props.config.pagination.possiblePageSizes && props.config.pagination.possiblePageSizes.length > 0) {
      var currentPageSizeValue = localStorage.getItem('pagesizevalue_' + props.config.gridUniqueId)
      if(currentPageSizeValue) {
        state.pageSize = parseInt(currentPageSizeValue);
        nextTick(() => {
          props.changePageSize(state.pageSize);
        })
      }
      else {
        state.pageSize = props.config.pagination.size;
        nextTick(() => {
          props.changePageSize(state.pageSize);
        })
      }
    }
  });

</script>