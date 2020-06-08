const fs = require("../../utils/fs/fs")
const path = require("path")

const path1 = path.join(__dirname, "./*.js")
const files = fs.readFiles([path1])

console.log(files)