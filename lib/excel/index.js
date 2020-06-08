const exporter = require('easy-excel-exporter');

const create = (options, header, data = []) => {
	const adapter = exporter(options)
	adapter.createColumns(header)
	adapter.addObjects(data)
	adapter.downloadFile()
}

exports.Types = exporter.dataType

exports.create = create

exports.exporter = exporter