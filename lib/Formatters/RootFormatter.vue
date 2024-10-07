<template>
  <OGFormatterUser v-if="type === 'OGFormatterUser'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterStatus v-if="type === 'OGFormatterStatus'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterDate v-if="type === 'OGFormatterDate'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterDateTime v-if="type === 'OGFormatterDateTime'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterOperations v-if="type === 'OGFormatterOperations'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterStrong v-if="type === 'OGFormatterStrong'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterClickableStrong v-if="type === 'OGFormatterClickableStrong'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterOpenableList v-if="type === 'OGFormatterOpenableList'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterQuestionParamStats v-if="type === 'OGFormatterQuestionParamStats'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterFileDownloadButton v-if="type === 'OGFormatterFileDownloadButton'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterReportAlias v-if="type === 'OGFormatterReportAlias'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterFile v-if="type === 'OGFormatterFile'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterReportTypeName v-if="type === 'OGFormatterReportTypeName'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterBoolean v-if="type === 'OGFormatterBoolean'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterBooleanCheckable v-if="type === 'OGFormatterBooleanCheckable'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterConditionalBoolean v-if="type === 'OGFormatterConditionalBoolean'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterTitleAndSub v-if="type === 'OGFormatterTitleAndSub'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterHighlighter v-if="type === 'OGFormatterHighlighter'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterHTML v-if="type === 'OGFormatterHTML'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterRoles v-if="type === 'OGFormatterRoles'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterLongText v-if="type === 'OGFormatterLongText'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterDownloadAsTxt v-if="type === 'OGFormatterDownloadAsTxt'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterTailwindFormatter v-if="type === 'OGFormatterTailwindFormatter'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <OGFormatterLevel v-if="type === 'OGFormatterLevel'" :data="data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  <template v-for="formatter in props.customFormatters">
    <component v-if="type === 'OGFormatter' + formatter.name" :is="formatter.component" :data="props.data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  </template>
</template>

<script setup>
  import OGFormatterUser from './OGFormatterUser.vue'
  import OGFormatterStatus from './OGFormatterStatus.vue'
  import OGFormatterDate from './OGFormatterDate.vue'
  import OGFormatterDateTime from './OGFormatterDateTime.vue'
  import OGFormatterOperations from './OGFormatterOperations.vue'
  import OGFormatterStrong from './OGFormatterStrong.vue'
  import OGFormatterClickableStrong from './OGFormatterClickableStrong.vue'
  import OGFormatterOpenableList from './OGFormatterOpenableList.vue'
  import OGFormatterQuestionParamStats from './OGFormatterQuestionParamStats.vue'
  import OGFormatterFileDownloadButton from './OGFormatterFileDownloadButton.vue'
  import OGFormatterReportAlias from './OGFormatterReportAlias.vue'
  import OGFormatterFile from './OGFormatterFile.vue'
  import OGFormatterReportTypeName from './OGFormatterReportTypeName.vue'
  import OGFormatterBoolean from './OGFormatterBoolean.vue'
  import OGFormatterBooleanCheckable from './OGFormatterBooleanCheckable.vue'
  import OGFormatterConditionalBoolean from './OGFormatterConditionalBoolean.vue'
  import OGFormatterTitleAndSub from './OGFormatterTitleAndSub.vue'
  import OGFormatterHighlighter from './OGFormatterHighlighter.vue'
  import OGFormatterHTML from './OGFormatterHTML.vue'
  import OGFormatterRoles from './OGFormatterRoles.vue'
  import OGFormatterLongText from './OGFormatterLongText.vue'
  import OGFormatterDownloadAsTxt from './OGFormatterDownloadAsTxt.vue'
  import OGFormatterTailwindFormatter from './OGFormatterTailwindFormatter.vue'
  import OGFormatterLevel from './OGFormatterLevel.vue'

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