import * as abaplint from "@abaplint/core";

export class DTELOutput {
  public output(object: abaplint.Objects.DataElement, reg: abaplint.IRegistry): string {
    let ret = object.getType() + " " + object.getName() + "<br>\n";
    const parsed = object.parseType(reg);
    if (object.getDomainName() !== undefined && object.getDomainName() !== "") {
      ret += `<a href="todo">` + object.getDomainName() + "</a><br>\n";
    } else {
      ret += parsed.toText(0) + "<br>\n";
    }
    return ret;
  }
}