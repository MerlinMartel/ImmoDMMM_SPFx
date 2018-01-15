
/**
 * Extract value from result source
 * @param result
 * @param key
 * @param defaultValue
 */

import { ResultTableCollection } from "sp-pnp-js/lib/sharepoint";

export function extractBool(value: string): boolean {
    return value.split("\n\n").some(x => x == "1" || x == "True");
}

export function extractValue<T>(result: { [key: string]: any }, key: string, defaultValue: T): T {
    if (key in result && result[key] != null && result[key] != "") {
      return result[key] as T;
    }
    // TO support taxonomy, with return an object
  if(key.indexOf(".") > 0){
    let firstKey = key.substring(0,key.indexOf("."));
    if(result[firstKey] != null && result[firstKey] != ""){
      let secondKey = key.substring(key.indexOf(".") + 1,10000000);
      let firstKeyValue = result[firstKey];
      if(secondKey in firstKeyValue){
        return firstKeyValue[secondKey];
      }
    }
  }
    return defaultValue;
}

/**
 * Map the result table to an object
 * that is more easily usable
 * @param resultTable
 */
export function mapResultTable(resultTable: ResultTableCollection): { [key: string]: any }[] {
    if (resultTable) {
        let rows = resultTable.RelevantResults.Table.Rows;
        return rows.map((row) => {
            let result: { [key: string]: any } = {};
            row.Cells.map((item) => {
                result[item.Key] = item.Value;
            });

            return result;
        });
    }
    return [];
}


/**
 * Extract the image src from an image html tag
 * @param imageTag image html tag <img src="{imageSrc}" />
 * @returns imageSrc
 */
export function extractImageSrc(imageTag: string): string {
    let element = document.createElement("div");
    element.innerHTML = imageTag;
    let image = element.childElementCount > 0 ? element.firstChild.attributes.getNamedItem("src").value : "";

    return image;
}
