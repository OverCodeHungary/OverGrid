<template>
  <OGFormatterStatus v-if="type === 'OGFormatterStatus'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as StatusFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterDateTime v-if="type === 'OGFormatterDateTime'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as DateFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterOperations v-if="type === 'OGFormatterOperations'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as OperationsFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterStrong v-if="type === 'OGFormatterStrong'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as ConfiglessFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterBoolean v-if="type === 'OGFormatterBoolean'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as ConfiglessFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterHighlighter v-if="type === 'OGFormatterHighlighter'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as HighlightFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterHTML v-if="type === 'OGFormatterHTML'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as ConfiglessFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterLongText v-if="type === 'OGFormatterLongText'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as LongTextFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <OGFormatterTailwindFormatter v-if="type === 'OGFormatterTailwindFormatter'" :l="props.l" :theme="props.theme" :data="data" :formatter="(formatter as TailwindClassFormatterConfigType)" :rowid="rowid" :field="field" :record="record" :refreshGrid="() => { refreshGrid() }" :openExtraRow="openExtraRow" />
  <template v-for="formatter in props.customFormatters">
    <component v-if="type === 'OGFormatter' + formatter.name" :l="props.l" :is="formatter.component" :data="props.data" :formatter="(formatter as any)" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  </template> 
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
  import { AllFormatterConfigTypes, StatusFormatterConfigType, DateFormatterConfigType, OperationsFormatterConfigType, ConfiglessFormatterConfigType, HighlightFormatterConfigType, LongTextFormatterConfigType, TailwindClassFormatterConfigType } from '../components/model/OverGridConfig'

  const props = defineProps<{
    l: Function,
    theme: string,
    type: string,
    data: any,
    formatter: AllFormatterConfigTypes,
    rowid: string | number,
    field: string,
    record: any,
    refreshGrid: Function,
    openExtraRow: Function,
    customFormatters: any[]
  }>();
</script>

  <!-- 
  <template v-for="formatter in props.customFormatters">
    <component v-if="type === 'OGFormatter' + formatter.name" :is="formatter.component" :data="props.data" :config="config" :rowid="rowid" :field="field" :record="record" :refreshGrid="refreshGrid" :openExtraRow="openExtraRow" />
  </template> 
  -->