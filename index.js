const movieListEl = document.querySelector(".movie")
const searchInputEl = document.getElementById("searchInput")
const searchButtonEl = document.getElementById("searchBtn")

function openMenu() {
    document.body.classList += " menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

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
        document.getElementById('searchTitle').innerHTML = `Search results for <span style="color: green;">"${searchTerm}"</span>`
    }
})

searchInputEl.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const searchTerm = searchInputEl.value.trim()
        if (searchTerm) {
            main(searchTerm)
            document.getElementById('searchTitle').innerHTML = `Search results for <span style="color: green;">"${searchTerm}"</span>`
        }
    }
})

function showSpinner() {
    const movieContainer = document.querySelector('.movie');
    movieContainer.style.opacity = '0'
    movieContainer.style.pointerEvents = 'none'

    document.getElementById('spinner').style.display = 'block'
    document.getElementById('searchTitle').style.display = 'none'
}

function hideSpinner() {
    const movieContainer = document.querySelector('.movie');
    movieContainer.style.opacity = '1'
    movieContainer.style.pointerEvents = 'auto'

    document.getElementById('spinner').style.display = 'none'
    document.getElementById('searchTitle').style.display = 'block'
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

window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('backToTop')
    if (this.window.scrollY > 200) {
        backToTopButton.classList.add('show')
    } else {
        backToTopButton.classList.remove('show')
    }
})

document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})