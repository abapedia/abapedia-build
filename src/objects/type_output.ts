import * as abaplint from "@abaplint/core";

export class TYPEOutput {
  public output(object: abaplint.Objects.TypePool): string {
    return object.getName() + "<br>\n";
  }
}