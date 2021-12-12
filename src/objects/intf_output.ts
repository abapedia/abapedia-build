import * as abaplint from "@abaplint/core";
import { outputDefinition } from "./_helpers";

export class INTFOutput {
  public output(object: abaplint.Objects.Interface): string {
    let ret = object.getType() + " " + object.getName() + "<br>\n";
    ret += outputDefinition(object.getDefinition());
    return ret;
  }
}