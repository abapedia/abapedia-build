import * as abaplint from "@abaplint/core";
import * as fs from "fs";
import * as path from "path";
import { CLASOutput } from "./objects/clas_output";
import { DOMAOutput } from "./objects/doma_output";
import { DTELOutput } from "./objects/dtel_output";
import { INTFOutput } from "./objects/intf_output";
import { TABLOutput } from "./objects/tabl_output";
import { TTYPOutput } from "./objects/ttyp_output";
import { TYPEOutput } from "./objects/type_output";

export const BUILD_FOLDER = "build";

export class Output {
  private readonly folder: string;

  public constructor(name: string) {
    this.folder = path.join(BUILD_FOLDER, name);
    fs.mkdirSync(this.folder, {recursive: true});
  }

  public output(objects: abaplint.IObject[]): void {
    console.log("objects: " + objects.length);

    let result = "";
    for (const o of objects) {
      switch (o.getType()) {
        case "CLAS":
          result += new CLASOutput().output(o as abaplint.Objects.Class);
          break;
        case "TTYP":
          result += new TTYPOutput().output(o as abaplint.Objects.TableType);
          break;
        case "DTEL":
          result += new DTELOutput().output(o as abaplint.Objects.DataElement);
          break;
        case "DOMA":
          result += new DOMAOutput().output(o as abaplint.Objects.Domain);
          break;
        case "TABL":
          result += new TABLOutput().output(o as abaplint.Objects.Table);
          break;
        case "INTF":
          result += new INTFOutput().output(o as abaplint.Objects.Interface);
          break;
        case "TYPE":
          result += new TYPEOutput().output(o as abaplint.Objects.TypePool);
          break;
        case "PROG":
          continue;
        case "DEVC":
          continue;
        case "MSAG":
          continue;
        case "XSLT":
          continue;
        default:
          console.dir("TODO: handle object type " + o.getType());
          break;
      }
    }
    fs.writeFileSync(path.join(this.folder, "index.html"), result, "utf-8");

  }
}