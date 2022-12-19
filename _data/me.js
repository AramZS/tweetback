let data = {
	name: "Aram Zucker-Scharff",
	PronounceableText: {
		inLanguage: "en-US",
		speechToTextMarkup: "IPA",
		phoneticText: "/ˌæ.ɹəm ˈt͡sʊ.kɚ 'ʃɑɹf/",
	},
	description:
		"Aram Zucker-Scharff is Lead Privacy Engineer at The Washington Post, lead dev for PressForward and a consultant. Tech solutions for journo problems.",
	aboutMePage: "http://aramzs.github.io/aramzs/",
	givenName: "Aram",
	familyName: "Zucker-Scharff",
};

let exportedData = false;

if (data.name.length) {
	exportedData = data;
}

module.exports = exportedData;
