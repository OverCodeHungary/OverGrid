<template>
  <div class="RVGReportAlias">
    <a :id="'report-' + rowid" :href="'/inquires/' + record.inquireId + '#report-' + rowid" class="aliasLink">
      <i v-if="!record.alias">Névtelen</i>
      <strong v-if="record.alias">{{ record.alias }}</strong>
    </a>

    <b-button @click="onEditClick" v-if="this.record.status == 'DRAFT' && isEditable" size="sm" variant="link" class="editButton" :title="config.formatter.editButtonTitle">
      <b-icon-pencil @mousedown.stop />
    </b-button>

    <br />

    <span style="font-size: 11px; color: #6c757d;">
      <b-icon-caret-right-fill @mousedown.stop /> 
      {{ record.name }}
    </span>
  </div>
</template>

<script>
export default {
  name: "RVGReportAlias",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  methods: {
    onEditClick(e) {
      e.stopPropagation();
      if(this.config.formatter.onEditClick) {
        this.config.formatter.onEditClick(this.record);
      }
    }
  },
  computed: {
    isEditable() {
      return !!this.config.formatter.onEditClick;
    }
  }
};
</script>

<style scoped>
  .editButton {
    font-size: 13px;
    padding: 0px;
    line-height: 10px;
    margin-left: 5px;
    color: #6c757d;
    /* background: #434243; */
    padding-left: 5px;
    padding-right: 5px;
  }

  .editButton:hover {
    color: #6c757d;
  }

  .aliasLink strong {
    display: inline-block;
    max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
