//API: http://www.omdbapi.com/?apikey=5efc08a5&s=avengers
//API to search: http://www.omdbapi.com/?apikey=5efc08a5&s=${searchTerm}
const movieListEl = document.querySelector(".movie")
const searchInputEl = document.getElementById("searchInput")
const searchButtonEl = document.getElementById("searchBtn")

async function suggestions(avengers) {
    const movie = await fetch("http://www.omdbapi.com/?apikey=5efc08a5&s=avengers")
    const moviesData = await movie.json()
    movieListEl.innerHTML = moviesData.Search.slice(0,4).map(movie => movieHTML(movie)).join("")
}

function movieHTML(movie) {
    return `<div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">
        <div class="movie-card_container">
        <img class="poster" src="${movie.Poster}" alt="${movie.Title}">
        <p>${movie.Title}</p>
        <p>(${movie.Year})</p>
        </div>
        </div>`
}

suggestions()

async function main(searchTerm) {
    showSpinner()

    try {
        const fullURL = `http://www.omdbapi.com/?apikey=5efc08a5&s=${encodeURIComponent(searchTerm)}`
        const response = await fetch(fullURL)
        const data = await response.json()

        await new Promise(resolve => setTimeout(resolve, 500))

        if (data.Response === "True") {
            displayResults(data.Search)
        } else {
            movieListEl.innerHTML = `<p>No results found for "${searchTerm}"</p>`
        }
    } catch (error) {
        movieListEl.innerHTML = `<p>Error fetching data. Please try again later.</p>`
        console.log("Fetch error", error)
    } finally {
        hideSpinner()
    }
}

function displayResults(results) {
    movieListEl.innerHTML = results.map(movie => `<div class="movie-card" onclick="showMovieInfo('${movie.imdbID}')">
        <div class="movie-card_container">
        <img class="poster" src="${movie.Poster}" alt="${movie.Title}">
        <p>${movie.Title}</p>
        <p>(${movie.Year})</p>
        </div>
        </div>`) .join("")
}

searchButtonEl.addEventListener("click", () => {
    const searchTerm = searchInputEl.value.trim()
    if (searchTerm) {
        main(searchTerm)
    }
})

searchInputEl.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const searchTerm = searchInputEl.value.trim()
        if (searchTerm) {
            main(searchTerm)
        }
    }
})

function showMovieDetails(id) {
    localStorage.setItem("id", id)
    window.location.href = `${window.location.origin}/user.html`
}

function showSpinner() {
    document.getElementById('spinner').style.display = 'block'
    document.getElementById('t-movie').style.display = 'none'
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none'
    document.getElementById('t-movie').style.display = 'block'
}

document.querySelectorAll('.header-options a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault()

        showSpinner()

        setTimeout(() => {
            hideSpinner()

            window.location.href = link.href
        }, 500)
    })
})