import * as abaplint from "@abaplint/core";

export class TTYPOutput {
  public output(object: abaplint.Objects.TableType): string {
    return object.getName() + "<br>\n";
  }
}