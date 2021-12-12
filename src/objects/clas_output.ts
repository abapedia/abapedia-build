import * as abaplint from "@abaplint/core";
import { outputDefinition } from "./_helpers";

export class CLASOutput {
  public output(object: abaplint.Objects.Class): string {
    let ret = object.getType() + " " + object.getName() + "<br>\n";
    ret += outputDefinition(object.getDefinition());
    return ret;
  }
}