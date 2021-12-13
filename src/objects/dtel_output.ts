import * as abaplint from "@abaplint/core";

export class DTELOutput {
  public output(object: abaplint.Objects.DataElement, reg: abaplint.IRegistry): string {
    let ret = object.getType() + " " + object.getName() + "<br>\n";
    const parsed = object.parseType(reg);
    ret += parsed.toText(0) + "<br>\n";
// todo    ret += object.getDomainName()
    return ret;
  }
}