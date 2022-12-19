const dataSource = require("../../src/DataSource");
const metadata = require("../../_data/metadata.js");

module.exports = function (data, title, tagSet, imgUrls) {
	let jsonLDProperties = [];
	let ogProperties = [
		{
			meta: "property",
			property: "og:url",
			content: `${data.metadata.baseUrl}/${data.page.url}`,
		},
		{ meta: "name", name: "author", content: `${data.metadata.username}` },
	];
	let metaProperties = [];

	let id = { "@id": `${data.page.url}` };

	let tags = ["Twitter", ...Object.keys(tagSet)];

	switch (data.page.fileSlug) {
		case "tweet-pages":
			let previewImage = false;
			if (imgUrls && imgUrls.length) {
				previewImage = imgUrls.at(-1);
			}

			jsonLDProperties.push({
				"@type": ["BlogPosting", "ArchiveComponent"],
			});
			jsonLDProperties.push({ name: `${title}` });
			jsonLDProperties.push({ identifier: `${data.tweet.id_str}` });
			// jsonLDProperties.push({"headline": `${title}`})

			jsonLDProperties.push({ itemLocation: `${data.page.url}` });
			jsonLDProperties.push({ holdingArchive: `${data.page.url}` });
			jsonLDProperties.push({ hasPart: `${data.metadata.baseUrl}` });
			jsonLDProperties.push({
				isPartOf: {
					"@type": ["ArchiveOrganization", "WebSite"],
					name: `${data.metadata.username}’s Twitter Archive`,
					url: `${data.metadata.baseUrl}`,
				},
			});
			if (previewImage) {
				jsonLDProperties.push({ image: [...imgUrls] });
			}
			break;
		case "newest":
		case "recent":
		case "popular":
			break;
		default:
			jsonLDProperties.push({
				"@type": ["ArchiveOrganization", "WebSite"],
			});
			jsonLDProperties.push({ archiveHeld: `${data.page.url}` });
			jsonLDProperties.push({ url: `${data.page.url}` });
			jsonLDProperties.push({
				name: `${data.metadata.username}’s Twitter Archive`,
			});
	}

	jsonLDProperties.push({
		about: [data.metadata.username, data.metadata.name, ...tags],
	});
	jsonLDProperties.push(id);
	let jsonLD = {
		"@context": "http://schema.org",
		creator: {
			"@type": "Person",
			name: data.me.name || data.metadata.username,
			sameAs: data.me.aboutMePage
				? data.me.aboutMePage
				: `https://twitter.com/${data.metadata.username}`,
			image: {
				"@type": "ImageObject",
				url: data.metadata.avatar,
			},
		},
		inLanguage: data.metadata.language,
		about: ["Twitter", data.metadata.username],
	};
	if (data.me.description) {
		jsonLD.creator.description = data.me.description;
		jsonLD.about.push(data.me.name);
	}
	if (data.me.PronounceableText) {
		jsonLD.creator.name = {
			"@type": "PronounceableText",
			textValue: data.me.name || data.metadata.username,
		};
		jsonLD.creator.name = Object.assign(
			jsonLD.creator.name,
			data.me.PronounceableText
		);
	}

	const jsonLDFinal = Object.assign(jsonLD, ...jsonLDProperties);

	const jsonLDTemp = {
		"@context": "http://schema.org",
		"@type": "Blog",
		url: "{{site.site_url}}{{ page.url }}",
		headline: "{{ title or site.site_name }}",
		about: "{{ description or site.description }}",
		image: [
			"https://41.media.tumblr.com/709bb3c371b9924add351bfe3386e946/tumblr_nxdq8uFdx81qzocgko1_1280.jpg",
		],
		about: ["Comedy", "Ronnie Barker"],
		creator: {
			"@type": "Person",
			name: "Ronnie Barker",
			sameAs: "http://viaf.org/viaf/2676198",
		},
		isAccessibleForFree: "True",
		isPartOf: {
			"@type": ["CreativeWork", "Product"],
			name: "Fight With Tools",
			productID: "fightwithtools.dev",
		},
		discussionUrl:
			"https://twitter.com/search?q=to%3AChronotope%20%23dev&src=typed_query&f=top",
		inLanguage: "en-US",
		license: "http://creativecommons.org/licenses/by-sa/4.0/",
		additionalType: "CreativeWork",
		alternateName: "Fight With Tools Dev",
		publisher: {
			"@type": "Organization",
			name: "Fight With Tools",
			description:
				"A site discussing how to imagine, build, analyze and use cool code and web tools. Better websites, better stories, better developers. Technology won't save the world, but you can.",
			sameAs: "https://fightwithtools.dev/",
			logo: {
				"@type": "ImageObject",
				url: "https://41.media.tumblr.com/709bb3c371b9924add351bfe3386e946/tumblr_nxdq8uFdx81qzocgko1_1280.jpg",
			},
			publishingPrinciples: "http://aramzs.github.io/about/",
		},
	};

	const jsonString = JSON.stringify(jsonLDFinal);

	return `<script type="application/ld+json">
    ${jsonString}
</script>
`;
};
