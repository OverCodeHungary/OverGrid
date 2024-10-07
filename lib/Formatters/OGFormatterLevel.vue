<template>
  <div class="OGFormatterLevel flex flex-row gap-0.5 items-center">
    <span v-html="formattedData"></span>
  </div>
</template>

<script>
export default {
  name: "OGFormatterLevel",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
    formattedData: function () {
      let prefix = "";
      for(let i = 0; i < this.record.level; i++) {
        prefix += '<i class="fa-solid fa-chevron-right text-xs mr-1 opacity-50" style="font-size:10px;"></i>';
      }
      return prefix + this.data;
    }
  }
};
</script>

