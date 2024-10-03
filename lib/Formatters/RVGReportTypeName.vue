<template>
  <div class="RVGReportTypeName">
    <span class="nameLink">
      <strong v-if="record.name">{{ record.name }}</strong>
    </span>

    <br />

    <span style="font-size: 11px; color: #6c757d;">
      <b-icon-caret-right-fill @mousedown.stop /> 
      {{ record.code }}
    </span>
  </div>
</template>

<script>
export default {
  name: "RVGReportTypeName",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped>
  .nameLink {
    color: #e20074;
  }
</style>
