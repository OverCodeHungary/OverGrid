<template>
  <div data-test="RVGFileDownloadButton" class="RVGFileDownloadButton">
    <span class="noDataYet" v-if="!data">
      Még nincs
    </span>
    <b-button class="downloadButton" variant="warning" size="sm" href="https://www.google.com">
      <b-icon-cloud-download-fill @mousedown.stop />
    </b-button>
  </div>
</template>

<script>
export default {
  name: "RVGFileDownloadButton",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
  }
};
</script>

<style scoped>
.downloadButton:deep(svg) {
  color: white;
}
</style>
