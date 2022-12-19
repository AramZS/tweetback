const dataSource = require("./src/DataSource");

class SampleSource {
	async data() {
		return {
			tweets: await dataSource.getAllTweets(),
			layout: "searchable.11ty.js",
			// permalink: false,
			permalink: "samplesource.json",
			hideHeaderTweetsLink: true,
		};
	}
	dataset(tweets) {
		const tempdata = tweets.slice(0, 25);
		return tempdata.map((tweet) => {
			return tweet;
		});
	}
	async render(data) {
		return JSON.stringify(this.dataset(data.tweets));
	}
}

module.exports = SampleSource;
