import * as abaplint from "@abaplint/core";

export class DDLSOutput {
  public output(object: abaplint.Objects.DataDefinition): string {
    let ret = "";

    ret += `<table border="1">\n`;
    ret += `<tr>
    <td><u>Key</u></td>
    <td><u>Field</u></td>
    </tr>\n`;
    for (const f of object.getParsedData()?.fields || []) {
      ret += "<tr><td>" + (f.key === true ? "KEY" : "") + "</td><td><tt>" + f.name + "</tt></td></tr>\n";
    }
    ret += `</table>\n`;

    return ret;
  }
}