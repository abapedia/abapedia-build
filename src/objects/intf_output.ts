import * as abaplint from "@abaplint/core";

export class INTFOutput {
  public output(object: abaplint.Objects.Interface): string {
    return object.getName() + "<br>\n";
  }
}