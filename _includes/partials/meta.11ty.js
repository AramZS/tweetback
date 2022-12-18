const dataSource = require("../../src/DataSource");
const metadata = require("../../_data/metadata.js");

module.exports = async function (data, title) {
	let titleTweetNumberStr = "";
	console.log('Data', data)
	if (data.page.fileSlug === "tweet-pages") {
		titleTweetNumberStr = `—№ ${this.renderNumber(
			data.pagination.hrefs.length - data.pagination.pageNumber
		)}`;
	} else if (data.page.fileSlug === "newest") {
		titleTweetNumberStr = `—№ ${this.renderNumber(
			(await dataSource.getAllTweets()).length
		)}`;
	}

	let navHtml = "";
	if (
		data.page.fileSlug === "tweet-pages" ||
		data.page.fileSlug === "newest"
	) {
		let newestHref = "/newest/";
		let previousHref = data.pagination.previousPageHref;
		let nextHref = data.pagination.nextPageHref;

		if (data.page.fileSlug === "newest") {
			newestHref = "";
			previousHref = "";
			nextHref =
				"/" +
				(await dataSource.getAllTweets())
					.sort((a, b) => b.date - a.date)
					.slice(1, 2)
					.map((tweet) => tweet.id_str)
					.join("") +
				"/";
		} else if (
			data.page.fileSlug === "tweet-pages" &&
			data.pagination.firstPageHref === data.page.url
		) {
			newestHref = "";
		}

		navHtml = `<ul class="tweets-nav">
			<li>${
				newestHref ? `<a href="${newestHref}">` : ""
			}⇤ Newest<span class="sr-only"> Tweet</span>${
			newestHref ? `</a>` : ""
		}</li>
			<li>${
				previousHref ? `<a href="${previousHref}">` : ""
			}⇠ Newer<span class="sr-only"> Tweet</span>${
			previousHref ? `</a>` : ""
		}</li>
			<li>${
				nextHref ? `<a href="${nextHref}">` : ""
			}Older<span class="sr-only"> Tweet</span> ⇢${
			nextHref ? `</a>` : ""
		}</li>
		</ul>`;
	}

	let jsonLDProperties = [];
	let ogProperties = [
		{'meta': 'property', 'property': 'og:url', 'content': `${data.metadata.baseUrl}/${data.page.url}`},
		{'meta': 'name', 'name': 'author', 'content': `${data.metadata.username}`}
	];
	let metaProperties = [];

	let id = {"@id": `${data.page.url}`}

	let tags = ["Twitter"]
	
	switch (data.page.fileSlug) {
		case "tweet-pages":
			const {imgUrls} = await this.pullTwitterMedia(tweet)
			let previewImage = false;
			if (imgUrls.length){
				previewImage = imgUrls.at(-1)
			}
			tags = this.getHashTagsFromText(data.tweet.full_text);

			jsonLDProperties.push({"@type": ["BlogPosting","ArchiveComponent"]})
			jsonLDProperties.push({"name": `${title}`})
			jsonLDProperties.push({"identifier": `${data.tweet.id_str}`})
			// jsonLDProperties.push({"headline": `${title}`})

			jsonLDProperties.push({"itemLocation": `${data.page.url}`})
			jsonLDProperties.push({"holdingArchive": `${data.page.url}`})
			jsonLDProperties.push({"hasPart": `${data.metadata.baseUrl}`})
			jsonLDProperties.push({"isPartOf": {
				"@type": ["ArchiveOrganization", "WebSite"],
				"name": `${data.metadata.username}’s Twitter Archive`,
				"productID": `${data.metadata.baseUrl}`,
			}})
			if (previewImage){
				jsonLDProperties.push({"image": [
					...imgUrls
				]})
			}
			break;
		case 'newest':
		case 'recent':
		case 'popular':

			break;
		default:
			jsonLDProperties.push({"@type": ["ArchiveOrganization","WebSite"]})
			jsonLDProperties.push({"archiveHeld": `${data.page.url}`,})
			jsonLDProperties.push({"url": `${data.page.url}`,})
			jsonLDProperties.push({"name": `${data.metadata.username}’s Twitter Archive`})
	}

	jsonLDProperties.push({"about": [data.metadata.username, data.metadata.name, ...tags]})
	jsonLDProperties.push(id);
	let jsonLD = {
        "@context": "http://schema.org",
		"creator": {
			"@type": "Person",
			"name": data.metadata.name,
			"sameAs": data.metadata.aboutMePage ? data.metadata.aboutMePage : `https://twitter.com/${data.metadata.username}`
	 	},
		"inLanguage": data.metadata.language,
		"isPartOf": {
            "@type": ["CreativeWork", "Product"],
            "name": "Fight With Tools",
            "productID": "fightwithtools.dev"
        },
	}

	const jsonLDFinal = Object.assign(jsonLD, ...jsonLDProperties)

	const jsonLDTemp = {
        "@context": "http://schema.org",
        "@type": "Blog",
        "url": "{{site.site_url}}{{ page.url }}",
        "headline": "{{ title or site.site_name }}",
        "about": "{{ description or site.description }}",
        "image": [
            "https://41.media.tumblr.com/709bb3c371b9924add351bfe3386e946/tumblr_nxdq8uFdx81qzocgko1_1280.jpg"
        ],
		"about": ["Comedy","Ronnie Barker"],
		"creator": {
			   "@type": "Person",
			   "name": "Ronnie Barker",
			   "sameAs": "http://viaf.org/viaf/2676198"
		},
        "isAccessibleForFree": "True",
        "isPartOf": {
            "@type": ["CreativeWork", "Product"],
            "name": "Fight With Tools",
            "productID": "fightwithtools.dev"
        },
        "discussionUrl": "https://twitter.com/search?q=to%3AChronotope%20%23dev&src=typed_query&f=top",
        "author": {% include "partials/json-ld-objs/person.njk" -%}, {# this will need to turn into an if statement if I ever have another author on here #}
        "editor": {% include "partials/json-ld-objs/person.njk" %},
        "inLanguage": "en-US",
        "license": "http://creativecommons.org/licenses/by-sa/4.0/",
        "additionalType": "CreativeWork",
        "alternateName": "Fight With Tools Dev",
        "publisher": {
            "@type": "Organization",
            "name": "Fight With Tools",
            "description": "A site discussing how to imagine, build, analyze and use cool code and web tools. Better websites, better stories, better developers. Technology won't save the world, but you can.",
            "sameAs": "https://fightwithtools.dev/",
            "logo": {
                "@type": "ImageObject",
                "url": "https://41.media.tumblr.com/709bb3c371b9924add351bfe3386e946/tumblr_nxdq8uFdx81qzocgko1_1280.jpg"
            },
            "publishingPrinciples": "http://aramzs.github.io/about/"
        }
    }

	const jsonString = JSON.stringify(jsonLDFinal)

	return `<script type="application/ld+json">
    ${jsonString}
</script>
`;
};
