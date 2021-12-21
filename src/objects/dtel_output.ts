import * as abaplint from "@abaplint/core";
import { objectLink } from "./_helpers";

export class DTELOutput {
  public output(object: abaplint.Objects.DataElement, reg: abaplint.IRegistry): string {
    let ret = "";
    const parsed = object.parseType(reg);
    const domainName = object.getDomainName();
    if (domainName !== undefined && domainName !== "") {
      ret += objectLink("DOMA", domainName) + `<br>\n`;
    } else {
      ret += parsed.toText(0) + "<br>\n";
    }
    return ret;
  }
}