const pkg = require('../package.json');

const info = [
	'  ' + (typeof pkg.author == 'string' ? pkg.author : pkg.author.name).blue + ' - ' + 'v'.yellow + pkg.version.yellow +''
].join('\n')

module.exports = {
	"info" : info
}