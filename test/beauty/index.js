const fs = require("../../utils/fs/fs")
const beauty = require("../../utils/beauty")
const path = require("path")

const files = fs.readFiles([path.resolve(__dirname, "./*.json")])

files.forEach((file) => {
	console.log(beauty(file.contents))
})