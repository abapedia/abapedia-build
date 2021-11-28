import * as abaplint from "@abaplint/core";

export class DTELOutput {
  public output(object: abaplint.Objects.DataElement): string {
    return object.getName() + "<br>\n";
  }
}