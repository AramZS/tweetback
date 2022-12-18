let data = {
	username: "eleven_ty", // No leading @ here
	homeLabel: "11ty.dev",
	homeUrl: "https://www.11ty.dev/",
	baseUrl: "https://twitter.11ty.dev/",
	language: "en-US",
};

data.avatar = `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(
	data.homeUrl
)}/`;

module.exports = data;
