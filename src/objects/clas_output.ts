import * as abaplint from "@abaplint/core";
import { outputDefinition } from "./_helpers";

export class CLASOutput {
  public output(object: abaplint.Objects.Class): string {
    let ret = "";
    ret += outputDefinition(object.getDefinition());
    return ret;
  }
}