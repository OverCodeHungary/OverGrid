<template>
  <div data-test="" class="flex flex-row overflow-y-visible" @mousedown.stop>
    <span v-if="rowButtonsNormal.length > 0" class="flex flex-row items-center gap-1 border-r-[1px] pr-2 dark:border-[#384766]">
      <button :disabled="button.disabled ? button.disabled : false" data-test="RVGOperationsButton" :data-test-value="button.testValueAttribute" v-for="(button, index) in rowButtonsNormal" :key="index"  :class="button.classList" v-tooltip="{text:button.tooltip,theme:{placement:'right',displayArrow:false}}" @click="button.onClick">
        <span v-html="button.icon"></span>
        {{ button.title }}
      </button>
    </span>
    <span v-if="rowButtonsDropdowned.length > 0" class="">
      <DropDown>
        <button class="ml-1 darkmode-toggle btn h-8 w-8 !rounded-full !p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        <template #content>
          <div class="!rounded-md border border-slate-150 bg-white font-inter dark:border-navy-500 dark:bg-navy-700 w-full">
            <ul class="my-1 rounded-lg">
              <li class="" v-for="(button, key) in rowButtonsDropdowned" :key="key">
                <button :disabled="button.disabled ? button.disabled : false" :data-test-value="button.testValueAttribute"  @click="button.onClick" class="flex text-slate-700 dark:text-slate-300  w-full items-center px-3 py-2 font-medium tracking-wide outline-none transition-all hover:bg-primary hover:text-white focus:bg-primary focus:text-white dark:hover:bg-accent dark:focus:bg-accent">
                  {{ button.tooltip }}
                </button>
              </li>
            </ul>
          </div>
        </template>
      </DropDown>
    </span>
  </div>
</template>

<script>
import DropDown from '../components/DropDown.vue'

export default {
  name: "RVGUser",
  components: {
    DropDown
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
    rowButtons() {
      if(!this.config.formatter.config || !this.config.formatter.config.buttons) {
        return []
      }

      var btnz = [];

      if(typeof this.config.formatter.config.buttons == "object") {
        btnz = this.config.formatter.config.buttons
      }

      if(typeof this.config.formatter.config.buttons == "function") {
        var vm = this;
        btnz = this.config.formatter.config.buttons(this, () => {
          vm.$emit('refreshGrid')
        }, this.rowid, this.record)
      }

      return btnz
    },
    rowButtonsDropdowned() {
      var btnz = this.rowButtons

      var result = []
      for(var i in btnz) {
        if(btnz[i].dropdowned) {
          result.push(btnz[i])
        }
      }

      return result
    },
    rowButtonsNormal() {
      var btnz = this.rowButtons

      var result = []
      for(var i in btnz) {
        if(!btnz[i].dropdowned) {
          result.push(btnz[i])
        }
      }

      return result
    }
  }
};
</script>

<style scoped>
  .RVGOperations {
    white-space: nowrap;
  }
  
  .RVGOperations button {
    margin-right: 5px;
  }

  .extraFeaturesDropdownWrapper:deep(.dropdown) {
    margin-left: 0px !important;
  }

  .extraFeaturesDropdownWrapper:deep(.dropdown > button.dropdown-toggle) {
    background: transparent !important;
    border: none !important;
  }

</style>
