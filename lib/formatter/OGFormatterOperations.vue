<template>
  <div data-test="" class="flex flex-row overflow-y-visible" @mousedown.stop>
    <span v-if="rowButtonsNormal.length > 0" class="flex flex-row items-center gap-1 pr-1">
      <button :disabled="button.disabled ? button.disabled : false" data-test="OGFormatterOperationsButton" :data-test-value="button.testValueAttribute" v-for="(button, index) in rowButtonsNormal" :key="index" :class="[button.classList, { 'og-btn og-btn-circle og-btn-primary': !button.classList }]" @click="(event: Event) => { button.onClick(event) }">
        <span v-html="button.icon"></span>
        {{ button.title }}
      </button>
    </span>
    <span v-if="rowButtonsDropdowned.length > 0" class="flex items-center">
      <DropDown :orientation="props.formatter?.config?.dropdownOrientation ? props.formatter.config.dropdownOrientation : 'left'">
        <button class="og-btn og-btn-primary og-btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 min-w-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        <template #content>
          <div class="!rounded-md font-inter w-full">
            <ul class="my-1 rounded-lg">
              <li class="" v-for="(button, key) in rowButtonsDropdowned" :key="key">
                <a href="javascript:void(null);" :disabled="button.disabled ? button.disabled : false" :data-test-value="button.testValueAttribute"  @click="(event: Event) => { button.onClick(event) }" class="flex flex-row gap-1 items-center ml-1 mt-1 og-operation-link">
                  {{ button.tooltip }}
                </a>
              </li>
            </ul>
          </div>
        </template>
      </DropDown>
    </span>
  </div>
</template>

<script setup lang="ts">
  import DropDown from '../components/DropDown.vue'
  import FormatterProps from './types/FormatterProps';
  import { OperationsFormatterConfigType, OperatorButtonType } from '../components/model/OverGridConfig'
  const props = defineProps<FormatterProps<OperationsFormatterConfigType>>()
  import { computed } from 'vue';

  const rowButtons = computed(() => {
    if(!props.formatter.config || !props.formatter.config.buttons) {
      return []
    }

    var btnz: Array<OperatorButtonType> = [];

    if(typeof props.formatter.config.buttons == "object") {
      btnz = props.formatter.config.buttons
    }

    if(typeof props.formatter.config.buttons == "function") {
      var vm = this;
      btnz = props.formatter.config.buttons(this, () => {
        props.refreshGrid()
      }, props.rowid, props.record)
    }

    return btnz
  })

  const rowButtonsDropdowned = computed(() => {
    var btnz = rowButtons.value

    var result = []
    for(var i in btnz) {
      if(btnz[i].dropdowned) {
        result.push(btnz[i])
      }
    }

    return result
  })

  const rowButtonsNormal = computed(() => {
    var btnz = rowButtons.value

    var result = []
    for(var i in btnz) {
      if(!btnz[i].dropdowned) {
        result.push(btnz[i])
      }
    }

    return result
  })
</script>
