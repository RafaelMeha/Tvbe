let currentPage = 1;
let currentSearchTerm = '';
let totalPages = 100;

const API_BASE_URL = "https://api.themoviedb.org/3/movie/now_playing";
const API_KEY = "04c35731a5ee918f014970082a0088b1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("movies");
const form = document.getElementById("search-form");
const search = document.getElementById("search");

getMovies(currentPage);

async function getMovies(page, genre = null, year = null, rating = null) {
    let url = API_BASE_URL + `?api_key=${API_KEY}&page=${page}`;

    if (currentSearchTerm) {
        url = `${SEARCHAPI}${currentSearchTerm}&page=${page}`;
    }   else {
        url = `${API_BASE_URL}?api_key=${API_KEY}&page=${page}`;
    }

    if (genre && genre !== 'a') {
        url += `&with_genres=${genre}`;
    }
    if (year && year !== 'a') {
        url += `&year=${year}`;
    }
    if (rating && rating !== 'a') {
        url += `&vote_average.gte=${rating}`;
    } 
    
    const resp = await fetch(url);
    const respData = await resp.json();
    totalPages = respData.total_pages; 

    console.log(respData);

    showMovies(respData.results);
    updatePageControls();

    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(`API call failed: ${resp.status}`);
        }
        const respData = await resp.json();
        totalPages = respData.total_pages;
        console.log(respData);
        showMovies(respData.results);
        updatePageControls();
    } catch (error) {
        console.error("Failed to fetch movies:", error);
    }
}

function showMovies(movies) {
    main.innerHTML = "";

    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average } = movie;

        const movieLink = document.createElement("a");
        movieLink.href = `eachMoviee.html?movieId=${id}`; 
        movieLink.classList.add("movie");

        const formattedVoteAverage = parseFloat(vote_average).toFixed(1);

        movieLink.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${formattedVoteAverage}</span>
            </div>
        `;

        main.appendChild(movieLink);
    });
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

const filtersForm = document.getElementById("filters-form");

filtersForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const genre = filtersForm.elements["genre"].value;
    const year = filtersForm.elements["year"].value;
    const rating = filtersForm.elements["rating"].value;

    currentPage = 1; 
    getMovies(currentPage, genre, year, rating);
});

function updatePageControls() {
    document.getElementById("currentPage").innerText = `Page ${currentPage}`;
    document.getElementById("prevButton").disabled = currentPage === 1;
}

document.getElementById("nextButton").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage += 1;
        getMovies(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.getElementById("prevButton").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        getMovies(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
