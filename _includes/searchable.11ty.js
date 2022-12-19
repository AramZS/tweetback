const dataSource = require("../src/DataSource");
const metadata = require("../_data/metadata.js");

module.exports = async function (data) {
	return `{
		"tweets": ${data.content}
	}`;
};
