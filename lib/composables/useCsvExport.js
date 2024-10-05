import { unparse } from "papaparse";
import { saveAs } from "file-saver";

export default () => {
  return {
    generate: (data, filename, config) => {
      const config = {
        delimiter: config.delimiter || ",",
        encoding: config.encoding || "utf-8",
        opts: config.opts || {}
      }

      if(!data) {
        console.error("No data to export");
        return;
      }

      let csv = unparse(
        data,
        Object.assign({
          delimiter: config.delimiter,
          encoding: config.encoding
        },
        config.opts)
      );

      //Add BOM when UTF-8
      if (config.encoding === "utf-8") {
        csv = "\ufeff" + csv;
      }

      let blob = new Blob([csv], {
        type: "text/csv;charset=" + config.encoding
      });
      saveAs(blob, filename);
    }
  }
}