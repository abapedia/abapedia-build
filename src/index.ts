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
    process.chdir(dir);

    const args: abaplintCli.Arguments = {
      "configFilename": undefined,
      "format": "standard",
      "compress": false,
      "parsingPerformance": false,
      "showHelp": false,
      "showVersion": false,
      "outputDefaultConfig": false,
      "runFix": false,
      "runRename": false,
    };

    const result = await abaplintCli.run(args);
    console.dir("issues: " + result.issues.length);
    console.dir("objects: " + result.reg?.getObjectCount());

    fs.rmSync(dir, { recursive: true });
  }
}

run().then(() => {
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit(2);
});