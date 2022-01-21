import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as childProcess from "child_process";
import {config, IProject} from "./config";
import * as abaplintCli from "@abaplint/cli";
import * as abaplint from "@abaplint/core";
import { BUILD_FOLDER, Output } from "./output";
import { buildFrontpage } from "./frontpage";
import fetch from 'cross-fetch';

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

function sortAndFilterObjects(objects: abaplint.IObject[]) {
  objects.filter((o) => {
    return o.getType() !== "PROG" && o.getType() !== "DEVC" && o.getType() !== "MSAG";
  });
  objects.sort((a, b) => {
    return (a.getType() + a.getName()).localeCompare(b.getType() + b.getName());
  });
  return objects;
}

async function buildExistence() {
  const res: any = {};
  let response = await fetch('https://raw.githubusercontent.com/abapedia/object-existence/main/json/on_prem_702.json');
  res["702"] = (await response.json()).object_list;

  response = await fetch('https://raw.githubusercontent.com/abapedia/object-existence/main/json/on_prem_750.json');
  res["750"] = (await response.json()).object_list;

  response = await fetch('https://raw.githubusercontent.com/abapedia/object-existence/main/json/on_prem_754.json');
  res["754"] = (await response.json()).object_list;

  return res;
}

async function run() {
  fs.rmSync(BUILD_FOLDER, {recursive: true, force: true});

  const existence = await buildExistence();

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

    new Output(p.name, result.result.reg, result.status, p.url, existence).output(sortAndFilterObjects(objects));
  }

  buildFrontpage();
  fs.copyFileSync("./img/favicon.ico", "./build/favicon.ico");
}

run().then(() => {
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(2);
});