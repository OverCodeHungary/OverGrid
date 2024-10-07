<template>
  <div class="OGFormatterConditionalBoolean">
    <span v-if="visible">
      <b-icon-toggle-on v-if="this.data" class="text-info icon" @mousedown.stop />
      <b-icon-toggle-off v-if="!this.data" class="text-secondary icon" @mousedown.stop />
    </span>
    <span v-if="!visible" class="greyed">
      {{ naText }}
    </span>
  </div>
</template>

<script>
export default {
  name: "OGFormatterConditionalBoolean",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
    visible() {
      if(!this.config.formatter.condition) {
        return true;
      }
      else {
        return this.config.formatter.condition(this.record)
      }
    },
    naText() {
      if(!this.config.formatter.naText) {
        return 'N/A';
      }
      else {
        return this.config.formatter.naText
      }
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
  .icon {
    font-size: 28px;
  }
  .greyed {
    color: gray;
  }
</style>
