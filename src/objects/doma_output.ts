import * as abaplint from "@abaplint/core";

export class DOMAOutput {
  public output(object: abaplint.Objects.Domain): string {
    return object.getName() + "<br>\n";
  }
}