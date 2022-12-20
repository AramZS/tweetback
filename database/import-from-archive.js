require("dotenv").config();
const {
	checkInDatabase,
	logTweetCount,
	saveToDatabaseApiV1,
	createTable,
} = require("./tweet-to-db");
const shouldFilterOutCircleTweets = process.argv.includes("removecircletweets");
const twitterPart0 = require("./tweets.js");
const twitterPart1 = require("./tweets-part1.js");
const twitterPart2 = require("./tweets-part2.js");
const tweets = [...twitterPart0, ...twitterPart1, ...twitterPart2];
let circleTweets;

if (shouldFilterOutCircleTweets) {
	circleTweets = require("./twitter-circle-tweet.js");
}

console.log(`${tweets.length} tweets found in archive.`);
logTweetCount();

function tweetIsForCircles(tweet) {
	return circleTweets.some(
		(circleTweet) => circleTweet.tweet.id_str === tweet.id_str
	);
}

async function retrieveTweets() {
	let existingRecordsFound = 0;
	let missingTweets = 0;
	let circleTweets = 0;

	for (let { tweet } of tweets) {
		checkInDatabase(tweet).then((tweet) => {
			if (tweet === false) {
				existingRecordsFound++;
			} else if (
				shouldFilterOutCircleTweets &&
				tweetIsForCircles(tweet)
			) {
				circleTweets++;
				console.log({ circleTweets });
			} else {
				missingTweets++;
				saveToDatabaseApiV1(tweet);
				// console.log( "Missing tweet", { tweet });
				console.log({ existingRecordsFound, missingTweets });
				logTweetCount();
			}
		});
	}
}

(async function () {
	try {
		createTable();

		await retrieveTweets();
	} catch (e) {
		console.log("ERROR", e);
	}
})();
