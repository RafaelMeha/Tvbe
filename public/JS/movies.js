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

async function getMovies(page) {
    let url;
    if (currentSearchTerm) {
        url = `${SEARCHAPI}${currentSearchTerm}&page=${page}`;
    } else {
        url = `${API_BASE_URL}?api_key=${API_KEY}&page=${page}`;
    }
    
    const resp = await fetch(url);
    const respData = await resp.json();
    totalPages = respData.total_pages; 

    console.log(respData);

    showMovies(respData.results);
    updatePageControls();
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


form.addEventListener("submit", (e) => {
    e.preventDefault();

    currentSearchTerm = search.value;
    currentPage = 1;

    if (currentSearchTerm) {
        getMovies(currentPage);
        search.value = "";
    }
});


async function applyFilters(page) {
    let url = `${API_BASE_URL}?api_key=${API_KEY}&page=${page}`;

    if (currentSearchTerm) {
        url = `${SEARCHAPI}${currentSearchTerm}&page=${page}`;
    } else {
        const genre = document.querySelector('[name="genre"]').value;
        if (genre && genre !== 'a') { 
            url += `&with_genres=${genre}`;
        }

        const year = document.querySelector('[name="year"]').value;
        if (year && year !== 'a') { 
            url += `&primary_release_year=${year}`;
        }

    }
    
    try {
        const response = await fetch(url);
        const respData = await response.json();
        totalPages = respData.total_pages;

        let filteredResults = respData.results;
        const rating = document.querySelector('[name="rating"]').value;
        if (rating && rating !== 'a') { 
            filteredResults = filteredResults.filter(movie => Math.round(movie.vote_average) >= parseInt(rating));
        }

        showMovies(filteredResults);
        updatePageControls();
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
    }
}

document.getElementById('filters-form').addEventListener('submit', function(e) {
    e.preventDefault();

    currentSearchTerm = '';
    currentPage = 1; 
    applyFilters(currentPage); 
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
