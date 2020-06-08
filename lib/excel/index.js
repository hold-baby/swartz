const excel = require('easy-excel-exporter');

const DataType = excel.dataType

const create = (options, header, data = []) => {
	const adapter = excel(options)
	adapter.createColumns(header)
	adapter.addObjects(data)
	adapter.downloadFile()
}

exports.DataType = DataType

exports.create = create

module.exports = excel