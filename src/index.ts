import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as childProcess from "child_process";
import {config} from "./config";
import * as abaplintCli from "@abaplint/cli";

async function run() {

  for (const p of config.projects) {
    process.stderr.write("Clone: " + p.url + "\n");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abapedia-build-"));
    childProcess.execSync("git clone --quiet --depth 1 " + p.url + " .", {cwd: dir, stdio: "inherit"});
    const oldCWD = process.cwd();
    process.chdir(dir);

    const args: abaplintCli.Arguments = {
      "format": "standard",
    };

    const result = await abaplintCli.run(args);
    process.chdir(oldCWD);
    fs.rmSync(dir, {recursive: true});

    console.log("issues: " + result.issues.length);
    if (result.reg) {
      console.log("objects: " + result.reg.getObjectCount());
      for (const o of result.reg.getObjects()) {
        if (result.reg.isDependency(o)) {
          continue;
        } else if (p.skip && o.getFiles()[0].getFilename().includes(p.skip)) {
          continue;
        }
        console.dir(o.getType() + " " + o.getName());
      }
    }
  }
}

run().then(() => {
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(2);
});