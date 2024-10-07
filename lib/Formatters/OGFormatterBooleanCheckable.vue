<template>
  <!-- <div class="flex -space-x-px">
    <button @click="() => { onTick(true) }" :class="[{ 'bg-warning text-white': this.data === true }, 'btn btn-sm !rounded-l-md !rounded-r-none border border-warning font-medium text-warning hover:bg-[#ff98004f] hover:text-white focus:bg-warning focus:text-white active:bg-warning/90']">
      Megjelent
    </button>
    <button @click="() => { onTick(false) }" :class="[{ 'bg-warning text-white': this.data === false }, 'btn btn-sm !rounded-l-none !rounded-r-md border border-warning font-medium text-warning hover:bg-warning hover:text-white focus:bg-warning focus:text-white active:bg-warning/90']">
      Nem jelent meg
    </button>
  </div> -->

  <!-- <select placeholder="Nincs beálltva" v-model="isChecked" class="form-select mt-1.5 w-full !rounded-full border border-slate-300 bg-white px-4 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
    <option value="true">Megjelent</option>
    <option value="false">Nem jelent meg</option>
  </select> -->

  <label class="inline-flex items-center space-x-2 mr-2">
    <input @change="() => { onTick(true) }" :name="'checkbox_' + this.rowid" :checked="this.data === true" class="form-radio is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" type="radio">
    <span>Megjelent</span>
  </label>

  <label class="inline-flex items-center space-x-2">
    <input @change="() => { onTick(false) }" :name="'checkbox_' + this.rowid" :checked="this.data === false" class="form-radio is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" type="radio">
    <span>Nem jelent meg </span>
  </label>

  <!-- <label class="OGFormatterBooleanCheckable flex items-center">
    <input v-model="isChecked" @change="onTick" class="form-checkbox mr-2 is-outline h-6 w-6 !rounded-full border-slate-400/70 before:!bg-success checked:!border-success  focus:!border-success dark:border-navy-400" type="checkbox" />
    <span v-if="config.formatter.offText && !isChecked">
      {{ config.formatter.offText }}
    </span>
    <span v-if="config.formatter.onText && isChecked">
      {{ config.formatter.onText }}
    </span>
  </label> -->
</template>

<script>

export default {
  name: "OGFormatterBoolean",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
  },
  mounted() {
  },
  data() {
    return {
      isChecked: this.data
    }
  },
  methods: {
    onTick(value) {
      if(this.config && this.config.formatter && this.config.formatter.onTick) {
        this.config.formatter.onTick(this.rowid, this.record, value);
      }
    }
  }
};
</script>

<style scoped>
  .icon {
    font-size: 28px;
  }
</style>
