<template>
  <div class="OGFormatterFile">
    <component :is="icon" :class="customClass"></component>
    <span class="mr-2 filename">{{ record.filename }}</span>
    <span class="filesize">({{ filesize }})</span>
  </div>
</template>

<script>

export default {
  name: "OGFormatterFile",
  components: {
  },
  props: ['data', 'config', 'rowid', 'record'],
  computed: {
    filesize() {
      return "~" + this.record.filesize + "MB";
      //return Math.round((this.record.filesize / 1024)*100)/100 + "MB"
    },
    customClass() {
      var cls = "customIcon ";

      var ext = this.record.filename.split('.').pop().toLowerCase();
      switch(ext) {
        case "doc":
        case "docx":
          cls += "text-info";
          break;
        case "xls":
        case "xlsx":
          cls += "text-success";
          break;
        case "pdf":
          cls += "text-danger";
          break;
        case "ppt":
        case "pptx":
          cls += "text-danger";
          break;
        case "zip":
        case "tar":
        case "rar":
          cls += "text-warning";
          break;
        case "txt":
          cls += "text-secondary";
          break;
        default:
          cls += "text-secondary";
          break;
      }

      return cls;
    },
    icon() {
      var ext = this.record.filename.split('.').pop().toLowerCase();
      switch(ext) {
        case "doc":
        case "docx":
          return "b-icon-file-word-fill"
        case "xls":
        case "xlsx":
          return "b-icon-file-excel-fill"
        case "pdf":
          return "b-icon-file-pdf-fill"
        case "ppt":
        case "pptx":
          return "b-icon-file-ppt-fill"
        case "zip":
        case "tar":
        case "rar":
          return "b-icon-file-zip-fill"
        case "txt":
          return "b-icon-file-text-fill"
        default:
          return "b-icon-file-earmark"
      }
    }
  }
};
</script>

<style scoped>
  .customIcon {
    font-size: 22px;
    margin-right: 5px;
  }

  .filename {
    font-size: 18px;
    font-weight: bold;
  }
</style>
