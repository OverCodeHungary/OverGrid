<template>
  <RVGUser v-if="type === 'RVGUser'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGStatus v-if="type === 'RVGStatus'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGDate v-if="type === 'RVGDate'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGDateTime v-if="type === 'RVGDateTime'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGOperations v-if="type === 'RVGOperations'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGStrong v-if="type === 'RVGStrong'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGClickableStrong v-if="type === 'RVGClickableStrong'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGOpenableList v-if="type === 'RVGOpenableList'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGQuestionParamStats v-if="type === 'RVGQuestionParamStats'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGFileDownloadButton v-if="type === 'RVGFileDownloadButton'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGReportAlias v-if="type === 'RVGReportAlias'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGFile v-if="type === 'RVGFile'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGReportTypeName v-if="type === 'RVGReportTypeName'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGBoolean v-if="type === 'RVGBoolean'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGBooleanCheckable v-if="type === 'RVGBooleanCheckable'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGConditionalBoolean v-if="type === 'RVGConditionalBoolean'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGTitleAndSub v-if="type === 'RVGTitleAndSub'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGHighlighter v-if="type === 'RVGHighlighter'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGHTML v-if="type === 'RVGHTML'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGRoles v-if="type === 'RVGRoles'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGLongText v-if="type === 'RVGLongText'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGDownloadAsTxt v-if="type === 'RVGDownloadAsTxt'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGTailwindFormatter v-if="type === 'RVGTailwindFormatter'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <RVGLevel v-if="type === 'RVGLevel'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <template v-for="formatter in props.customFormatters">
    <component v-if="type === 'RVG' + formatter.name" :is="formatter.component" :data="props.data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  </template>
</template>

<script setup>
  import RVGUser from './RVGUser.vue'
  import RVGStatus from './RVGStatus.vue'
  import RVGDate from './RVGDate.vue'
  import RVGDateTime from './RVGDateTime.vue'
  import RVGOperations from './RVGOperations.vue'
  import RVGStrong from './RVGStrong.vue'
  import RVGClickableStrong from './RVGClickableStrong.vue'
  import RVGOpenableList from './RVGOpenableList.vue'
  import RVGQuestionParamStats from './RVGQuestionParamStats.vue'
  import RVGFileDownloadButton from './RVGFileDownloadButton.vue'
  import RVGReportAlias from './RVGReportAlias.vue'
  import RVGFile from './RVGFile.vue'
  import RVGReportTypeName from './RVGReportTypeName.vue'
  import RVGBoolean from './RVGBoolean.vue'
  import RVGBooleanCheckable from './RVGBooleanCheckable.vue'
  import RVGConditionalBoolean from './RVGConditionalBoolean.vue'
  import RVGTitleAndSub from './RVGTitleAndSub.vue'
  import RVGHighlighter from './RVGHighlighter.vue'
  import RVGHTML from './RVGHTML.vue'
  import RVGRoles from './RVGRoles.vue'
  import RVGLongText from './RVGLongText.vue'
  import RVGDownloadAsTxt from './RVGDownloadAsTxt.vue'
  import RVGTailwindFormatter from './RVGTailwindFormatter.vue'
  import RVGLevel from './RVGLevel.vue'

  const props = defineProps({
    type: {
      type: String,
      required: true
    },
    data: {
      type: [Object, String, Number, Array],
      required: false
    },
    config: {
      type: Object,
      required: true
    },
    rowid: {
      type: Number,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    record: {
      type: Object,
      required: true
    },
    refreshGrid: {
      type: Function,
      required: true
    },
    openExtraRow: {
      type: Function,
      required: true
    },
    customFormatters: {
      type: Array,
      required: false
    }
  });
</script>