<template>
  <div class="OGFormatterHighlighter">
    <span v-html="craftedData"></span>
  </div>
</template>

<script>
export default {
  name: "OGFormatterHighlighter",
  components: {
  },
  props: ['data', 'config'],
  computed: {
    craftedData() {
      var cut = this.data;
      if(this.config.formatter && this.config.formatter.maxLength) {
        cut = cut.slice(0, this.config.formatter.maxLength) + "..."
      }

      if(this.config.formatter && this.config.formatter.highlights) {
        for(var i in this.config.formatter.highlights) {
          var chl = this.config.formatter.highlights[i];
          cut = cut.replace(chl.regexp, '<strong style="' + chl.style + '">$1</strong>')
        }
      }

      return cut;
    }
  }
};
</script>

<style scoped>
</style>
