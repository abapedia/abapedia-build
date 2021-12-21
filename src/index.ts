import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as childProcess from "child_process";
import {config, IProject} from "./config";
import * as abaplintCli from "@abaplint/cli";
import * as abaplint from "@abaplint/core";
import { BUILD_FOLDER, Output } from "./output";
import { HTML } from "./html";

async function cloneAndParse(p: IProject) {
  process.stderr.write("Clone: " + p.url + "\n");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abapedia-build-"));
  childProcess.execSync("git clone --quiet --depth 1 " + p.url + " .", {cwd: dir, stdio: "inherit"});
  const oldCWD = process.cwd();
  process.chdir(dir);

  const args: abaplintCli.Arguments = {"format": "standard"};

  const result = await abaplintCli.run(args);
  process.chdir(oldCWD);
  fs.rmSync(dir, {recursive: true});

  console.log("issues: " + result.issues.length);
  return result;
}

function buildIndex() {
  let html = "";
  for (const p of config.projects) {
    html += `<a href="./${p.name}/">${p.name}<br>\n`;
  }
  fs.writeFileSync(path.join(BUILD_FOLDER, "index.html"),
    HTML.preAmble() + html + HTML.postAmble(),
    "utf-8");
}

function sortAndFilterObjects(objects: abaplint.IObject[]) {
  objects.filter((o) => {
    return o.getType() !== "PROG" && o.getType() !== "DEVC" && o.getType() !== "MSAG";
  });
  objects.sort((a, b) => {
    return (a.getType() + a.getName()).localeCompare(b.getType() + b.getName());
  });
  return objects;
}

async function run() {
  fs.rmSync(BUILD_FOLDER, {recursive: true, force: true});

  for (const p of config.projects) {
    const result = await cloneAndParse(p);
    if (result.reg === undefined) {
      continue;
    }

    const objects: abaplint.IObject[] = [];
    for (const o of result.reg.getObjects()) {
      if (result.reg.isDependency(o)) {
        continue;
      } else if (p.skip && o.getFiles()[0].getFilename().includes(p.skip)) {
        continue;
      }
      objects.push(o);
    }

    new Output(p.name, result.reg).output(sortAndFilterObjects(objects));
  }

  buildIndex();
}

run().then(() => {
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(2);
});