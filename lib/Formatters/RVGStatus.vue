<template>
  <div class="RVGStatus">
    <div :class="currentStatus.classList">
      {{ currentStatus.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "RVGStatus",
  components: {
  },
  props: ['data', 'config', 'rowid'],
  computed: {
    badgeStyle() {
      if(this.config.formatter && this.config.formatter.badgeStyle) {
        return this.config.formatter.badgeStyle;
      }

      return '';
    },
    currentStatus() {
      if(!this.config.formatter.dataType || this.config.formatter.dataType == "text") {
        for(var i in this.config.formatter.mapping) {
          if(i == this.data) {
            return this.config.formatter.mapping[i];
          }
        }
      }

      if(this.config.formatter.dataType && this.config.formatter.dataType == "integer") {
        for(var j in this.config.formatter.mapping) {
          if(window.parseInt(j) == this.data) {
            return this.config.formatter.mapping[j];
          }
        }
      }

      if(this.config.formatter.dataType && this.config.formatter.dataType == "boolean") {
        if(this.data) {
          return this.config.formatter.mapping["true"];
        }
        else {
          return this.config.formatter.mapping["false"];
        }
      }

      return {};
    }
  },
  mounted() {

  }
};
</script>

<style scoped>
.RVGStatus:deep(.badge) {
  vertical-align: text-top;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
