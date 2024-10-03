<template>
  <div class="RVGDateTime">
    <i class="fa-regular fa-calendar" v-if="this.data && !isNaN(this.data)"></i>
    <span v-if="this.data && !isNaN(this.data)">{{ formattedDate }}</span>
    <span class="naDate" v-if="!this.data || isNaN(this.data)">[nincs megadva]</span>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "RVGDateTime",
  components: {
  },
  props: ['data', 'config'],
  computed: {
    formattedDate: function () {
      var format = process.env.VUE_APP_DATETIME_FORMAT;
      if(this.config.formatter.shortFormat) {
        format = process.env.VUE_APP_DATETIME_SHORT_FORMAT;
      }

      return moment(this.data*1000).format(format);
    }
  }
};
</script>

<style scoped>
.RVGDateTime span {
  margin-left: 10px;
}

.RVGDateTime .naDate {
  font-style: italic;
  font-weight: 200;
}
</style>
