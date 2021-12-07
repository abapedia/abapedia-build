import * as abaplint from "@abaplint/core";

export class CLASOutput {
  public output(object: abaplint.Objects.Class): string {
    return object.getName() + "<br>\n";
  }
}