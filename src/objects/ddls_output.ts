import * as abaplint from "@abaplint/core";

export class DDLSOutput {
  public output(object: abaplint.Objects.DataDefinition): string {
    let ret = "";

    for (const f of object.getParsedData()?.fields || []) {
      ret += f.key + ", " + f.name + "<br>";
    }

    return ret;
  }
}