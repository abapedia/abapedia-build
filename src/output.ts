import * as abaplint from "@abaplint/core";
import * as fs from "fs";
import lunr = require("lunr");
import * as path from "path";
import { HTML } from "./html";
import { CLASOutput } from "./objects/clas_output";
import { DOMAOutput } from "./objects/doma_output";
import { DTELOutput } from "./objects/dtel_output";
import { INTFOutput } from "./objects/intf_output";
import { TABLOutput } from "./objects/tabl_output";
import { TTYPOutput } from "./objects/ttyp_output";
import { TYPEOutput } from "./objects/type_output";
import { XSLTOutput } from "./objects/xslt_output";
import { objectFilename, objectLink } from "./objects/_helpers";

export const BUILD_FOLDER = "build";

type IndexData = {
  name: string,
  text: string,
}

export class Output {
  private readonly folder: string;
  private readonly name: string;
  private readonly reg: abaplint.IRegistry;
  private readonly status: any;

  public constructor(name: string, reg: abaplint.IRegistry, status: any) {
    this.reg = reg;
    this.name = name;
    this.status = status;
    this.folder = path.join(BUILD_FOLDER, name);
    fs.mkdirSync(this.folder, {recursive: true});
  }

  public output(objects: abaplint.IObject[]): void {
    console.log("objects: " + objects.length);

    let index = "";
    const indexData: IndexData[] = [];
    for (let i = 0; i < objects.length; i++) {
      const o = objects[i];
      const prev = objects[i-1];
      const next = objects[i+1];
      let result = "<h2>" + o.getType() + " " + o.getName() + "</h2>\n";

      result += `<small><a href="./">Home</a></small><br>`;
      if (prev) {
        result += "<small>Previous Object: " + objectLink(prev.getType(), prev.getName()) + "</small><br>";
      }
      if (next) {
        result += "<small>Next Object: " + objectLink(next.getType(), next.getName()) + "</small><br>";
      }
      result += "<br>";

      const stat = this.status[o.getType().toLowerCase() + "," + o.getName().toLowerCase()];
      if (stat !== undefined) {
        result += "Status: " + stat.status;
        if (stat.successors.length > 0) {
          result += ", use " + stat.successors.map((a: any) => objectLink(a.type, a.name)).join(" or ") + " instead";
          result += "<br>";
        } else {
          result += "<br>";
        }
        result += "<br>";
      }

      switch (o.getType()) {
        case "CLAS":
          result += new CLASOutput().output(o as abaplint.Objects.Class);
          break;
        case "TTYP":
          result += new TTYPOutput().output(o as abaplint.Objects.TableType);
          break;
        case "DTEL":
          result += new DTELOutput().output(o as abaplint.Objects.DataElement, this.reg);
          break;
        case "DOMA":
          result += new DOMAOutput().output(o as abaplint.Objects.Domain, this.reg);
          break;
        case "TABL":
          result += new TABLOutput().output(o as abaplint.Objects.Table, this.reg);
          break;
        case "INTF":
          result += new INTFOutput().output(o as abaplint.Objects.Interface);
          break;
        case "TYPE":
          result += new TYPEOutput().output(o as abaplint.Objects.TypePool);
          break;
        case "XSLT":
          result += new XSLTOutput().output(o as abaplint.Objects.Transformation);
          break;
        default:
          console.dir("TODO: handle object type " + o.getType());
          break;
      }
      const filename = objectFilename(o);
      fs.writeFileSync(
        path.join(this.folder, filename.toLowerCase()),
        HTML.preAmble(" - " + o.getName() + " " + o.getType()) + result + HTML.preAmble(),
        "utf-8");

      indexData.push({
        "name": o.getName() + " " + o.getType(),
        "text": result.replace(/<[^>]*>?/gm, ''),
      });

      index += `<a href="./${encodeURIComponent(filename)}">${o.getType()} ${o.getName()}</a><br>\n`
    }

    fs.writeFileSync(
      path.join(this.folder, "index.html"),
      HTML.preAmble(" - " + this.name) + index + HTML.preAmble(),
      "utf-8");

    this.buildIndex(indexData);
  }

  private buildIndex(indexData: IndexData[]) {
    const idx = lunr(function () {
      this.ref('name');
      this.field('text');

      indexData.forEach(
        function (doc) {this.add(doc)},
        this);
    });

    fs.writeFileSync(path.join(this.folder, "index.json"), JSON.stringify(idx), "utf-8");;
  }
}