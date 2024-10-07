<template>
  <div class="OGFormatterBoolean">
    <input v-if="this.data" disabled checked class="form-checkbox is-outline h-5 w-5 !rounded-full border-slate-400/70 before:!bg-success checked:!border-success  focus:!border-success dark:border-navy-400" type="checkbox" />
    <input v-if="!this.data" disabled class="form-checkbox is-outline h-5 w-5 !rounded-full border-slate-400/70 before:!bg-success checked:!border-success  focus:!border-success dark:border-navy-400" type="checkbox" />
  </div>
</template>

<script>
export default {
  name: "OGFormatterBoolean",
  components: {
  },
  props: [{
    data: {
      type: Boolean,
      required: false
    }
  }],
  computed: {
  },
  mounted() {
  }
};
</script>

<style scoped>
  .icon {
    font-size: 28px;
  }
</style>
