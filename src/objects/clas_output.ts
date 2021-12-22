import * as abaplint from "@abaplint/core";
import { objectLink, outputDefinition } from "./_helpers";

export class CLASOutput {
  public output(object: abaplint.Objects.Class): string {
    let ret = "";

    const def = object.getClassDefinition();
    if (def?.superClassName) {
      ret += "Superclass: " + objectLink("CLAS", def.superClassName) + "<br><br>\n";
    }

    ret += outputDefinition(object.getDefinition());
    return ret;
  }
}