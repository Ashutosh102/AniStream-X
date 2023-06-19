//Code for getting parameters from URL

var url_string = window.location;
var url = new URL(url_string);
var query = url.searchParams.get("query");
var tvid = url.searchParams.get("id");

let showingResultsForDisplayed = false;

//Code which fetches API and displays info and other stuff
const errorContainer = document.createElement("div");
errorContainer.style.color = "red";

fetch('https://api.consumet.org/anime/gogoanime/' + query)
    .then(response => response.json())
    .then(data => {
        var cardDiv = document.getElementById("card");

        document.title = "Searching for " + query;

        for (var i = 0; i < data.results.length; i++) {
            var anime = data.results[i];
            var animeDiv = document.createElement("div");
            var cardDiv = document.getElementById("card");
            cardDiv.style.marginTop = "20px";
            animeDiv.style.display = "inline-block";
            animeDiv.style.marginBottom = "20px";
            animeDiv.style.width = "300px";
            animeDiv.innerHTML = `<img height="350" width="250" src="${anime.image}" alt="${anime.title}"> <a href="/anime.html?id=${anime.id}"  </a> <h2>${anime.title}</h2>`;
            cardDiv.appendChild(animeDiv);
        }
    })
    .catch(error => {
        errorContainer.innerText = "Error loading. Please refresh";
        document.body.appendChild(errorContainer);
    });
