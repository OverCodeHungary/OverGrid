<template>
  <div class="OGFormatterRoles">
    <div v-for="(item, key) in mappedData" :key="key" :class="item.classList">{{ item.title }}</div>
  </div>
</template>

<script>
export default {
  name: "OGFormatterRoles",
  components: {
  },
  props: ['data', 'config', 'rowid'],
  computed: {
    mappedData() {
      var results = [];
      for(var j in this.config.formatter.mapping) {
        for(var i in this.data) {
          if(window.parseInt(j) == window.parseInt(i)) {
            results.push({
              classList: this.config.formatter.mapping[j].classList,
              title: this.config.formatter.mapping[j].title
            });
          }
        }
      }
      return results;
    }
  }
};
</script>

<style scoped>
.OGFormatterStatus:deep(.badge) {
  vertical-align: text-top;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
