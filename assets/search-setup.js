window.el_index = elasticlunr(function () {
	this.addField("full_text");
	this.setRef("id");
});

function renderDate(d) {
	let months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	return `${d.getFullYear()} ${months[d.getMonth()]} ${d.getDate()}`;
}

fetch("/searchsource.json")
	.then((response) => {
		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}
		return response.json();
	})
	.then((json) => {
		json.tweets.forEach((tweet) => {
			window.el_index.addDoc(tweet);
		});
		document.getElementById("search-submit-button").disabled = false;
		document.getElementById("tweet-text").placeholder = "Search Tweets";
		const searchParams = new URLSearchParams(document.location.search);
		if (searchParams.has("q")) {
			getSearchResults(searchParams.get("q"), true);
			document.getElementById("tweet-text").value = searchParams.get("q");
		}
		//console.log(this.users);
	})
	.catch(function () {
		this.dataError = true;
		console.log("Search Source Loading failed");
	});

function getSearchResults(searchString, keepHistoryState) {
	console.log("Searching for: ", searchString);
	var landing = document.getElementById("searchbox");
	landing.innerHTML = "";
	if (searchString && searchString.length) {
		var results = window.el_index.search(searchString);
		if (results.length) {
			results.forEach((result) => {
				var tweet = `<div class="tweet-container">
					<div class="tweet-text">${result.doc.full_text}</div>
					<div class="tweet-date">
						<span class="tag tag-naked tag-lite">${renderDate(
							new Date(result.doc.date)
						)}</span>
					</div>
				</div>
				<a href="/${result.doc.id}/" class="tag tag-naked">Full Tweet</a>`;
				var liEl = document.createElement("li");
				liEl.id = result.doc.id;
				liEl.class = "tweet";
				liEl.innerHTML = tweet;
				landing.append(liEl);
			});
		} else {
			landing.innerHTML = `<p>No search results found.</p>`;
		}
		if (!keepHistoryState) {
			const baseURL =
				location.protocol + "//" + location.host + location.pathname;
			const searchParams = createUrlSearchParams(searchString);
			window.history.pushState(
				{ path: `${baseURL}/?${searchParams.toString()}` },
				"",
				`${baseURL}/?${searchParams.toString()}`
			);
		}
	}
}

function createUrlSearchParams(string) {
	return new URLSearchParams(`q=${string}`);
}

var searchForm = document.getElementById("search-text");
if (searchForm) {
	searchForm.addEventListener(
		"submit",
		function (e) {
			e.preventDefault();
			var textInput = searchForm.querySelector('input[type="text"]');
			if (textInput && textInput.value) {
				getSearchResults(textInput.value);
			}
		},
		false
	);
}
