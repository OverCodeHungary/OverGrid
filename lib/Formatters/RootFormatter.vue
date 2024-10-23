<template>
  <OGFormatterStatus v-if="type === 'OGFormatterStatus'" :data="data" :config="(config as StatusFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterDateTime v-if="type === 'OGFormatterDateTime'" :data="data" :config="config as DateFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterOperations v-if="type === 'OGFormatterOperations'" :data="data" :config="config as OperationsFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterStrong v-if="type === 'OGFormatterStrong'" :data="data" :config="config as ConfiglessFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterBoolean v-if="type === 'OGFormatterBoolean'" :data="data" :config="config as ConfiglessFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterHighlighter v-if="type === 'OGFormatterHighlighter'" :data="data" :config="config as HighlightFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterHTML v-if="type === 'OGFormatterHTML'" :data="data" :config="config as ConfiglessFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterLongText v-if="type === 'OGFormatterLongText'" :data="data" :config="config as LongTextFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterTailwindFormatter v-if="type === 'OGFormatterTailwindFormatter'" :data="data" :config="config as TailwindClassFormatterConfigType" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <!-- <template v-for="formatter in props.customFormatters">
    <component v-if="type === 'OGFormatter' + formatter.name" :is="formatter.component" :data="props.data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  </template> -->
</template>

<script setup lang="ts">
  import OGFormatterStatus from './OGFormatterStatus.vue'
  import OGFormatterDateTime from './OGFormatterDateTime.vue'
  import OGFormatterOperations from './OGFormatterOperations.vue'
  import OGFormatterStrong from './OGFormatterStrong.vue'
  import OGFormatterBoolean from './OGFormatterBoolean.vue'
  import OGFormatterHighlighter from './OGFormatterHighlighter.vue'
  import OGFormatterHTML from './OGFormatterHTML.vue'
  import OGFormatterLongText from './OGFormatterLongText.vue'
  import OGFormatterTailwindFormatter from './OGFormatterTailwindFormatter.vue'
  import { AllFormatterConfigTypes, StatusFormatterConfigType, DateFormatterConfigType, OperationsFormatterConfigType, ConfiglessFormatterConfigType, HighlightFormatterConfigType, LongTextFormatterConfigType, TailwindClassFormatterConfigType } from '../components/model/OGConfig'

  const props = defineProps<{
    type: string,
    data: any,
    config: AllFormatterConfigTypes,
    rowid: number,
    field: string,
    record: any,
    refreshGrid: Function,
    openExtraRow: Function,
    customFormatters: any[]
  }>();
</script>