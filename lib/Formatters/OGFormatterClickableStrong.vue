<template>
  <strong class="OGFormatterClickableStrong" @click="click">
    {{ data }}
  </strong>
</template>

<script>
export default {
  name: "OGFormatterClickableStrong",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  methods: {
    click() {
      if(this.config.formatter && this.config.formatter.config && this.config.formatter.config.onClick) {
        this.config.formatter.config.onClick(this, this.rowid, this.record);
      }
    }
  }
};
</script>

<style scoped>
  strong {
    cursor: pointer;
  }

  strong:hover {
    text-decoration: underline;
  }
</style>
