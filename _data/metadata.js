require("dotenv").config();

let data = {
	username: "Chronotope", // No leading @ here
	homeLabel: "Fight With Tools by AramZS",
	homeUrl: "https://aramzs.github.io/",
	baseUrl:
		process.env.ENV == "local"
			? "http://localhost:8080/"
			: "https://tweets.aramzs.com/",
	language: "en-US",
};

data.avatar = `${data.baseUrl}img/twitter-avy.jpg`;

module.exports = data;
