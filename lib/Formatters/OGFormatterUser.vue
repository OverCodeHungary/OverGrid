<template>
  <div class="OGFormatterUser">
    <router-link :to="{name:'user',params:{id:data[idKey]}}">
      <b-icon-person-fill @mousedown.stop />
      {{ data[fullNameKey] }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: "OGFormatterUser",
  components: {
  },
  props: ['data', 'config', 'rowid', 'field'],
  computed: {
    idKey() {
      var idKey = "user_id"

      if(this.config.formatter && this.config.formatter.mapping && this.config.formatter.mapping.idKey) {
        idKey = this.config.formatter.mapping.idKey;
      }

      return idKey;
    },
    fullNameKey() {
      var fullNameKey = "name"

      if(this.config.formatter && this.config.formatter.mapping && this.config.formatter.mapping.fullNameKey) {
        fullNameKey = this.config.formatter.mapping.fullNameKey;
      }

      return fullNameKey;
    }
  }
};
</script>

<style scoped>

</style>
