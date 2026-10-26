const fs = require("fs"), path = require("path");
const Ajv = require("ajv"); const addFormats = require("ajv-formats");
const root = process.argv[2];
const ajv = new Ajv({ allErrors: true, strict: false }); addFormats(ajv);
// The community schemas name draft-07 by its https URL without the fragment, which Ajv does not know; the keyword is dropped and draft-07 is Ajv's default.
const load = (name) => { const s = JSON.parse(fs.readFileSync(path.join(root, name))); delete s.$schema; return s; };
const schemas = { "chain.json": load("chain.schema.json"), "assetlist.json": load("assetlist.schema.json") };
let bad = 0;
for (const net of ["ark", "arktestnet", "arklocal"]) for (const file of Object.keys(schemas)) {
  const data = JSON.parse(fs.readFileSync(path.join(root, net, file)));
  const ok = ajv.validate(schemas[file], data);
  console.log(`${ok ? "ok  " : "FAIL"} ${net}/${file}`);
  if (!ok) { bad++; for (const e of ajv.errors) console.log("     ", e.instancePath || "/", e.message, JSON.stringify(e.params)); }
}
process.exit(bad ? 1 : 0);
