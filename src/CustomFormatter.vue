<template>
  <i>
    {{ data }}
  </i>
</template>

<script setup>
  const props = defineProps({
    data: Object | String | Number | Array,
    config: Object,
    rowid: Number,
    record: Object
  })
</script>
