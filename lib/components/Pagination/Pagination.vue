<template>
  <div class="mt-3 w-full flex items-center justify-center">
    <ol class="flex flex-row items-center gap-3">
      <li>
        <button :disabled="isPaginationBackDisabled" @click="paginationBack" data-test="OGPaginationBack" class="og-btn og-btn-secondary og-btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewbox="0 0 24 24" stroke="currentColor" stroke-width="2" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </li>
      <li>
        <div class="paginationNumbers">
          {{ state.pagination.page*state.pagination.size }} - {{ paginationEnd }} / {{ state.pagination.totalElements }}
        </div>
        <!-- <a href="#" class="flex h-8 min-w-[2rem] items-center justify-center !rounded-full bg-slate-150 px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">1</a> -->
      </li>
      <li>
        <button :disabled="isPaginationNextDisabled" @click="paginationNext" data-test="OGPaginationNext" class="og-btn og-btn-secondary og-btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewbox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </li>
    </ol>
    <SpinnerLoader v-if="state.refreshNeeded" />
  </div>
</template>

<script setup>
  import { reactive, watch, computed, onMounted, nextTick } from 'vue';
  import SpinnerLoader from '../SpinnerLoader.vue';

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    refreshNeeded: {
      type: Boolean,
      required: false,
      default: false,
    },
    changePagination: {
      type: Function,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    }
  })

  const state = reactive({
    pagination: props.modelValue,
    refreshNeeded: props.refreshNeeded,
  });

  watch(() => props.modelValue, (value) => {
    state.pagination = value;
  })

  watch(() => props.refreshNeeded, (value) => {
    state.refreshNeeded = value;
  })

  const isPaginationBackDisabled = computed(() => {
    if(state.pagination.page <= 0 || state.refreshNeeded) {
      return true;
    }

    return false;
  })

  const isPaginationNextDisabled = computed(() => {
    if((state.pagination.page+1) >= state.pagination.totalPages || state.refreshNeeded) {
      return true;
    }

    return false;
  })

  const paginationStart = computed(() => {
    return state.pagination.page * state.pagination.size;
  })

  const paginationEnd = computed(() => {
    var p = (state.pagination.page+1) * state.pagination.size;
    if(p > state.pagination.totalElements) {
      p = state.pagination.totalElements
    }

    return p
  })

  function paginationBack() {
    if (state.pagination.page > 0) {
      state.pagination.page = state.pagination.page - 1;
      props.changePagination(state.pagination);
    }
  }

  function paginationNext() {
    if(state.pagination.page < state.pagination.totalPages) {
      state.pagination.page = state.pagination.page + 1;
      props.changePagination(state.pagination);
    }
  }

  onMounted(() => {
    if(props.config.pagination && props.config.pagination.active) {
      state.pagination.active = true;
      state.pagination.page = props.config.pagination.page;

      nextTick(() => {
        props.changePagination(state.pagination);
      })
    }
  })
</script>