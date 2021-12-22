import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as childProcess from "child_process";
import {config, IProject} from "./config";
import * as abaplintCli from "@abaplint/cli";
import * as abaplint from "@abaplint/core";
import { BUILD_FOLDER, Output } from "./output";
import { HTML } from "./html";

export type StatusResult = {
  status: string,
  successors: {type: string, name: string}[],
}

async function cloneAndParse(p: IProject) {
  process.stderr.write("Clone: " + p.url + "\n");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abapedia-build-"));
  childProcess.execSync("git clone --quiet --depth 1 " + p.url + " .", {cwd: dir, stdio: "inherit"});
  const oldCWD = process.cwd();
  process.chdir(dir);

  let status = {}
  const statusFilename = path.join(dir, "src", "_status.json");
  if (fs.existsSync(statusFilename)) {
    status = JSON.parse(fs.readFileSync(statusFilename, "utf-8"));
  }

  const args: abaplintCli.Arguments = {"format": "standard"};
  const result = await abaplintCli.run(args);
  process.chdir(oldCWD);
  fs.rmSync(dir, {recursive: true});

  console.log("issues: " + result.issues.length);

  return {result, status};
}

function buildIndex() {
  let html = "";
  for (const p of config.projects) {
    html += `<a href="./${p.name}/">${p.name}</a><br>\n`;
  }

  html += `<script>
window.addEventListener('DOMContentLoaded', (event) => {
    getValue();
});

function getValue() {
   var sys = localStorage.getItem("ADT_SYSTEM");
   if (sys === null) {
     sys = "ME1";
     localStorage.setItem("ADT_SYSTEM", sys);
   }
   document.getElementById("ADT_SYSTEM").value = sys;
}

function handleValueChange(i) {
  localStorage.setItem("ADT_SYSTEM", i.toUpperCase());
  return false;
}
</script>
<br>
System for "Open in ADT" link: <input type="text" size="4" maxlength="3" class="" id="ADT_SYSTEM" oninput="handleValueChange(this.value)"/>`;

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
    if (result.result.reg === undefined) {
      continue;
    }

    const objects: abaplint.IObject[] = [];
    for (const o of result.result.reg.getObjects()) {
      if (result.result.reg.isDependency(o)) {
        continue;
      } else if (p.skip && o.getFiles()[0].getFilename().includes(p.skip)) {
        continue;
      }
      objects.push(o);
    }

    new Output(p.name, result.result.reg, result.status, p.url).output(sortAndFilterObjects(objects));
  }

  buildIndex();
  fs.copyFileSync("./img/favicon.ico", "./build/favicon.ico");
}

run().then(() => {
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(2);
});