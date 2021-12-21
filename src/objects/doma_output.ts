import * as abaplint from "@abaplint/core";

export class DOMAOutput {
  public output(object: abaplint.Objects.Domain, reg: abaplint.IRegistry): string {
    let ret = "";
    ret += object.parseType(reg).toText(0);
    return ret;
  }
}