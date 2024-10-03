<template>
  <div class="flex flex-row items-center justify-center text-center m-auto">
    <button @click="() => { modalShown = true }" data-test="openButton" class="btn h-9 w-9 !rounded-full bg-slate-150 !p-0 font-medium relative text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 disabled:pointer-events-none disabled:select-none disabled:opacity-40 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90" title="Megnyitás">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
      <span class="absolute badge bg-error !rounded-full -top-1 -right-1 flex h-4 w-4 items-center justify-center text-tiny">
        {{ data }}
      </span>
    </button>
    <CustomContentModal :show="modalShown" :title="config.formatter.title" cancelButtonTitle="Bezárás" okButtonTitle="" :disableOkButton="true" :close="() => { modalShown = false }">
      <template #content>
        <div v-if="history" class="w-full overflow-hidden whitespace-normal">
          <table class="w-full text-left">
            <thead>
              <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                  
                </th>
                <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                  Esemény
                </th>
                <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                  Időpont
                </th>
                <th class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                  Garázsmester neve
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500" v-for="(item, key) in history" :key="key">
                <td class="whitespace-nowrap px-4 py-3 sm:px-5 font-extrabold">
                  <span>#{{ key+1 }}</span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5 font-extrabold">
                  <span>{{ item.actionName }}</span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  <div class=" flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                    <span>{{ formatDate(item.date) }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  <div class=" flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      {{ item.garageMasterName }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="w-full overflow-hidden whitespace-normal italic">
          <SpinnerLoader />
        </div>
      </template>
    </CustomContentModal>
  </div>
</template>

<script>
import CustomContentModal from '../components/CustomContentModal.vue'
import Axios from '../helpers/axios.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import moment from 'moment';

export default {
  name: "RVGLongText",
  components: {
    CustomContentModal,
    SpinnerLoader
  },
  props: ['data', 'config', 'record'],
  computed: {
  },
  mounted() {
  },
  data() {
    return {
      modalShown: false,
      history: null
    }
  },
  watch: {
    modalShown() {
      if(this.modalShown) {
        Axios.get(process.env.VUE_APP_API_URL + '/api/parking/reservation/history/' + this.record.id + '?sort=id,desc')
        .then((response) => {
          this.history = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      }
      else {
        this.history = null;
      }
    }
  },
  methods: {
    formatDate(dateStr) {
      return moment(dateStr).format('YYYY.MM.DD. HH:mm')
    }
  }
};
</script>

<style scoped>
</style>
