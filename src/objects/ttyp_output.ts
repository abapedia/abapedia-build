import * as abaplint from "@abaplint/core";

export class TTYPOutput {
  public output(object: abaplint.Objects.TableType, reg: abaplint.IRegistry): string {
    let html = "";
    const type = object.parseType(reg);
    html += "Line Type:<br>";
    if (type instanceof abaplint.BasicTypes.TableType) {
      const line = type.getRowType();
      html += line.getQualifiedName() !== undefined ? line.getQualifiedName()! : line.toABAP();
    }
    return html;
  }
}