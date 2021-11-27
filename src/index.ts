import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as childProcess from "child_process";
import {config} from "./config";
import abaplintCli from "@abaplint/cli";

function run() {
  console.dir("hello");

  for (const p of config.projects) {
    process.stderr.write("Clone: " + p.url + "\n");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abapedia-build-"));
    childProcess.execSync("git clone --quiet --depth 1 " + p.url + " .", {cwd: dir, stdio: "inherit"});

    /*
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
    */
    console.dir(abaplintCli());
    /*
    abaplintCli.run(args);
    */

    fs.rmSync(dir, { recursive: true });
  }
}

run();