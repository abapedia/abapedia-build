import * as abaplint from "@abaplint/core";

export class XSLTOutput {
  public output(object: abaplint.Objects.Transformation): string {
    let ret = object.getType() + " " + object.getName() + "<br>\n";
    return ret;
  }
}