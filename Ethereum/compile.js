const solc = require("solc");
const fs = require("fs-extra");
const path = require("path");

const buildPath = path.resolve(__dirname, "build");
// remove build folder
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf-8");
const output = solc.compile(source, 1).contracts;

// if build folder does not exist this funciton will be create one
fs.ensureDirSync(buildPath);

// loop through output object then write each property in seprate files
for (let contract in output) {
  fs.writeJSONSync(path.resolve(buildPath, `${contract.replace(":", "")}.json`), output[contract]);
}
