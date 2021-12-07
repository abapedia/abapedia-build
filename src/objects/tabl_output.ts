import * as abaplint from "@abaplint/core";

export class TABLOutput {
  public output(object: abaplint.Objects.Table): string {
    return object.getName() + "<br>\n";
  }
}