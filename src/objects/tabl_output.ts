import * as abaplint from "@abaplint/core";

export class TABLOutput {
  public output(obj: abaplint.Objects.Table, reg: abaplint.IRegistry): string {
    let ret = obj.getType() + " " + obj.getName() + "<br>\n";
    const type = obj.parseType(reg);
    if (type instanceof abaplint.BasicTypes.StructureType) {
      ret += `<table border="1">\n`;
      ret += `<tr><td><u>Field</u></td><td></td><td></td></tr>\n`;
      for (const f of type.getComponents()) {
        ret += `<tr><td>${f.name}</td><td>${f.type.getQualifiedName()}</td><td>${f.type.toText(0)}</td></tr>\n`;
      }
      ret += `</table>\n`;
    }

    return ret;
  }
}