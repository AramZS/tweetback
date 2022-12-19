const dataSource = require("./src/DataSource");

class SearchSource {
	async data() {
		return {
			tweets: await dataSource.getAllTweets(),
			layout: "searchable.11ty.js",
			// permalink: false,
			permalink: "searchsource.json",
			hideHeaderTweetsLink: true,
		};
	}
	dataset(tweets) {
		// const tempdata = tweets.slice(0, 25);
		return tweets.map((tweet) => {
			return {
				id: tweet.id,
				full_text: tweet.full_text,
				date: tweet.date,
			};
		});
	}
	async render(data) {
		return JSON.stringify(this.dataset(data.tweets));
	}
}

module.exports = SearchSource;
