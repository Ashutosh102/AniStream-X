//Code for getting parameters from URL
var url_string = window.location;
var url = new URL(url_string);
var query = url.searchParams.get("query");
var id = url.searchParams.get("id");

//Code which fetches API and displays info and other stuff
const errorContainer = document.createElement("div");
errorContainer.style.color = "red";

fetch('https://api.consumet.org/anime/gogoanime/info/' + id)
    .then(response => response.json())
    .then(data => {
        const anime = data;
        const capitalizedAnimeType = anime.type.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        const sideDataDiv = document.createElement('div');
        sideDataDiv.innerHTML = ` 
<img height="380" width="260" src = "${anime.image}"> </img> <br>

<h2>${anime.title}</h2>
<h3>Other Names: ${anime.otherName}</h3>
<h3>Status: ${anime.status}</h3>
<h3>Premiered: ${anime.releaseDate}</h3>
<h3>Type: ${capitalizedAnimeType}</h3>
<h3>Total Episodes: ${anime.episodes.length}</h3>

    `;
        document.getElementById('sidebar').appendChild(sideDataDiv);

        const synopsisDatDiv = document.createElement('div');
        synopsisDatDiv.innerHTML = ` <h2>Synopsis</h2>
<h3>${anime.description}</h3>
<h4>Genres: ${anime.genres.join(', ')}</h4>
<h2 id="yes"><a href="/watch.html?id=${id}&ep=${anime.episodes[0].id}&no=${anime.episodes[0].number}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 010 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" clip-rule="evenodd"></path></svg>Start Watching &nbsp</a></h2>
<h2 id="yes1"><a href="https://anilist.co/search/anime?search=${anime.title}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg>Find more info on AniList &nbsp</a></h2>
    `;
        document.getElementById('synopsis').appendChild(synopsisDatDiv);
        document.title = "Watch " + anime.title + ' - AniStream';
    })
    .catch(error => {
        errorContainer.innerText = "Error loading. Please refresh";
        document.body.appendChild(errorContainer);
    ;
    })
    
//Code for searching the last query the user made
const queryInput = document.getElementById("query");
if (localStorage.getItem("query")) {
    queryInput.value = localStorage.getItem("query");
}
queryInput.addEventListener("input", function () {
    localStorage.setItem("query", this.value);
});

//Code which fetches API and displays autocomplete results
const autocompleteResults = document.getElementById("autocomplete-results");
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}

const debouncedInput = debounce(function (event) {
    autocompleteResults.innerHTML = "";

    const query = document.querySelector("#query").value;

    fetch('https://api.consumet.org/anime/gogoanime/' + query)
        .then(response => response.json())
        .then(data => {
            data.results.slice(0, 4).forEach(result => {
                const li = document.createElement("li");
                li.innerText = result.title;

                li.addEventListener("click", function (event) {
          window.location.href = `/anime.html?id=${result.id}`;
                });

                autocompleteResults.appendChild(li);
            });
        });
}, 500);

queryInput.addEventListener("input", debouncedInput);

document.addEventListener("click", function (event) {
    if (event.target !== autocompleteResults) {
        autocompleteResults.innerHTML = "";
    }
});
