const fs = require("fs-extra");
const path = require("path")
const globby = require("globby")

const newFile = (filepath, contents) => {
  const ext = path.extname(filepath);
  const base = path.basename(filepath, ext);
  const dir = path.dirname(filepath);

  return {
    dir,
    ext,
    base,
    filepath,
    contents,
  };
};

exports.readFiles = (patterns) => {
  return globby.sync(patterns).map((filepath) => newFile(filepath, String(fs.readFileSync(filepath))))
}
