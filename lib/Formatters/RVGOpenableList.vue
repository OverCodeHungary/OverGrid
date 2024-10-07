<template>
  <div class="RVGOpenableList">
    <a v-if="!validationState" class="validationState mr-2" href="javascript:void(null);" title="A szekciók megadásánál valamilyen hiba van!">
      <b-icon-exclamation-circle-fill @mousedown.stop class="text-warning statusFlag" />
    </a>
    <span class="listHolder" v-html="listText" />

    <b-button @click="onEditClick" v-if="this.record.status == 'DRAFT'" pill size="sm" class="editButton ml-2" :title="config.formatter.editButtonTitle">
      <b-icon-pencil @mousedown.stop />
    </b-button>
  </div>
</template>

<script>
export default {
  name: "RVGOpenableList",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
    listText() {
      var resultText = "";
      var resultTextFirstPart = [];
      var itemsBeforeMore = (this.config && this.config.formatter && this.config.formatter.itemsBeforeMore) ? this.config.formatter.itemsBeforeMore : 1;

      for(var i in this.data) {
        if(i < itemsBeforeMore) {
          resultTextFirstPart.push(this.data[i].name ? this.data[i].name : this.data[i].code);
        }
      }

      resultText += '<span class="badge badge-secondary badge-pill">' + resultTextFirstPart.join(", ") + '</span>';

      if(resultTextFirstPart.length < this.data.length) {
        resultText += "<span class='text-muted mr-2'> és " + (this.data.length - resultTextFirstPart.length) + " további...</span>";
      }

      return resultText;
    },
    validationState() {
      if(this.config && this.config.formatter && this.config.formatter.validateState) {
        return this.config.formatter.validateState(this.data, this.rowid, this.record)
      }
      else {
        return true
      }
    }
  },
  mounted() {
  },
  methods: {
    onEditClick(e) {
      e.stopPropagation();
      if(this.config.formatter.onEditClick) {
        this.config.formatter.onEditClick(this.record);
      }
    }
  }
};
</script>

<style scoped>
  .listHolder:deep(.badge) {
    vertical-align: text-top;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .editButton {
    font-size: 10px;
  }

  .validationState, .listHolder {
    vertical-align: text-top !important;
  }

  .statusFlag {
    font-size: 20px !important;
  }
</style>
