//Code for homepage
const errorContainer = document.createElement("div");
errorContainer.style.color = "red";

fetch('https://api.consumet.org/anime/gogoanime/top-airing')
    .then(response => response.json())
    .then(data => {
        var cardDiv = document.getElementById("card");
        data.results.slice(0, 20).forEach(anime => {
            var animeDiv = document.createElement("div");
            animeDiv.style.display = "inline-block";
            animeDiv.style.marginBottom = "20px";
            animeDiv.style.width = "300px";
            var title = anime.title;
            var shortTitle = title.substring(0, 50);
            if (title.length > 50)
                shortTitle += "...";
            animeDiv.innerHTML = `<img height="350" width="250" src="${anime.image}" alt="${anime.title}"> <a href="/anime.html?id=${anime.id}"> <h2>${shortTitle}</h2> </a> `;
            cardDiv.appendChild(animeDiv);
});
})
.catch(error => {
    errorContainer.innerText = "Error loading. Please refresh";
    document.body.appendChild(errorContainer);
});
    


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
