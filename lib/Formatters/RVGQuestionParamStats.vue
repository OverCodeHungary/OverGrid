<template>
  <div class="RVGQuestionParamStats">
    <div class="paramsAreFine" v-if="data.needsToBefilledRequiredCount <= 0">
      <a href="javascript:void(null);" title="A paraméterek kitöltöttsége elégséges a futtatáshoz!">
        <b-icon-check-circle-fill @mousedown.stop class="text-success statusFlag" />
      </a>
      <span class="separator"> // </span>
      <b-badge pill>
        <strong>{{ data.fullCount }}</strong>, ebből {{ data.requiredCount }} kötelező
      </b-badge>
      <span class="separator"> // </span>
      <b-badge pill variant="success">
        {{ data.filledCount }} kitöltve
      </b-badge>
      <span v-if="this.record.status == 'DRAFT'" class="separator"> // </span>
      <b-button v-if="this.record.status == 'DRAFT'" @click="onEditClick" pill size="sm" class="editButton" title="Paraméterek szerkesztése">
        <b-icon-pencil @mousedown.stop />
      </b-button>
    </div>
    <div class="paramsNeedsToBeUpdated" v-if="data.needsToBefilledRequiredCount > 0">
      <a href="javascript:void(null);" title="A futtatáshoz szükséges paraméterek közül nem mindegyike van kitöltve!">
        <b-icon-exclamation-circle-fill @mousedown.stop class="text-warning statusFlag" />
      </a>
      <span class="separator"> // </span>
      <b-badge pill>
        <strong>{{ data.fullCount }}</strong>, ebből {{ data.requiredCount }} kötelező
      </b-badge>
      <span class="separator"> // </span>
      <b-badge pill variant="warning">
        {{ data.filledCount }} kitöltve
      </b-badge>
      <span v-if="this.record.status == 'DRAFT'" class="separator"> // </span>
      <b-button v-if="this.record.status == 'DRAFT'" pill @click="onEditClick" size="sm" class="editButton" title="Paraméterek szerkesztése">
        <b-icon-pencil @mousedown.stop />
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RVGQuestionParamStats",
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
  }
};
</script>

<style scoped>
  .paramsAreFine:deep(.badge), .paramsNeedsToBeUpdated:deep(.badge) {
    vertical-align: text-top;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .separator {
    vertical-align: middle;
    font-size: 20px;
    padding-left: 5px;
    padding-right: 5px;
    color: #484848;
  }
  
  .editButton {
    font-size: 10px;
  }

  .paramsAreFine:deep(.statusFlag), .paramsNeedsToBeUpdated:deep(.statusFlag) {
    font-size: 20px !important;
    vertical-align: text-bottom;
  }
</style>
