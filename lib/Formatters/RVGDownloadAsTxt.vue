<template>
  <div class="flex flex-row items-center justify-center text-center m-auto">
    <button :disabled="!data" @click="download" data-test="openButton" class="btn h-9 w-9 !rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 disabled:pointer-events-none disabled:select-none disabled:opacity-40 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90" title="Megnyitás">
      <i class="fa-solid fa-cloud-arrow-down"></i>
    </button>
  </div>
</template>

<script>

export default {
  name: "RVGDownloadAsTxt",
  components: {
  },
  props: ['data', 'config'],
  computed: {
  },
  mounted() {
    
  },
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (!+bytes) return '0 Bytes'

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    },
    download: function() {
      this.blob = new Blob([this.data], { type: 'text/plain' });
      const url = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  data() {
    return {
      blob: null
    }
  }
};
</script>

<style scoped>
</style>
