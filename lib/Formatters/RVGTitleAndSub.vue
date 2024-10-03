<template>
  <div class="RVGTitleAndSub">
    <a href="javascript:void(null)" @click="onClick">
      <i v-if="!record[config.formatter.titleKey]">Névtelen</i>
      <strong v-if="record[config.formatter.titleKey]">{{ record[config.formatter.titleKey] }}</strong>
    </a>

    <br />

    <span style="font-size: 11px; color: #6c757d;">
      <b-icon-caret-right-fill @mousedown.stop /> 
      {{ record[config.formatter.subtitleKey] }}
    </span>
  </div>
</template>

<script>
export default {
  name: "RVGReportAlias",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record', 'openExtraRow'],
  computed: {
  },
  mounted() {
  },
  methods: {
    onEditClick(e) {
      e.stopPropagation();
      if(this.config.formatter.onEditClick) {
        this.config.formatter.onEditClick(this.record);
      }
    },
    onClick(e) {
      e.stopPropagation();
      if(this.config.formatter && this.config.formatter.onClick && typeof this.config.formatter.onClick == "function") {
        this.config.formatter.onClick(this.record);
      }

      if(this.config.formatter && this.config.formatter.onClick && this.config.formatter.onClick == "openExtraRow") {
        this.openExtraRow(this.rowid)
      }
    }
  }
};
</script>

<style scoped>
</style>
