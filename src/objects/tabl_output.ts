import * as abaplint from "@abaplint/core";
import { objectLink } from "./_helpers";

export class TABLOutput {
  public output(obj: abaplint.Objects.Table, reg: abaplint.IRegistry): string {
    let ret = "";
    const type = obj.parseType(reg);

    switch (obj.getTableCategory()) {
      case abaplint.Objects.TableCategory.Structure:
        ret += "Category: Structure<br><br>";
        break;
      case abaplint.Objects.TableCategory.Transparent:
        ret += "Category: Transparent Table<br><br>";
        break;
      default:
        ret += "Category: " + obj.getTableCategory() + "<br><br>";
        break;
    }

    if (type instanceof abaplint.BasicTypes.StructureType) {
      ret += `<table border="1">\n`;
      ret += `<tr>
      <td><u>Field</u></td>
      <td><u>DDIC</u></td>
      <td><u>Type</u></td>
      </tr>\n`;
      for (const f of type.getComponents()) {
        let text = f.type.toText(0);
        if (f.type instanceof abaplint.BasicTypes.StructureType) {
          text = "Structure";
        } else if (f.type instanceof abaplint.BasicTypes.TableType) {
          text = "Table";
        }
        let ddicName = f.type.getQualifiedName() || "";
        if (ddicName.startsWith(obj.getName() + "-")) {
          ddicName = "";
        }
        if (ddicName !== "") {
          if (f.type instanceof abaplint.BasicTypes.StructureType) {
            ddicName = objectLink("TABL", ddicName);
          } else if (f.type instanceof abaplint.BasicTypes.TableType) {
            ddicName = objectLink("TTYP", ddicName);
          } else {
            ddicName = objectLink("DTEL", ddicName);
          }
        }
        ret += `<tr>
        <td><tt>${f.name}</tt></td>
        <td>${ddicName}</td>
        <td>${text}</td>
        </tr>\n`;
      }
      ret += `</table>\n`;
    }

    return ret;
  }
}