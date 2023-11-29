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
    totalPages = respData.total_pages; // Update total pages based on response

    console.log(respData);

    showMovies(respData.results);
    updatePageControls();
}

function showMovies(movies) {
    // clear main
    main.innerHTML = "";

    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average } = movie;

        const movieLink = document.createElement("a");
        movieLink.href = `eachMoviee.html?movieId=${id}`; // URL for movie details
        movieLink.classList.add("movie");

        // Format the vote_average to one decimal place
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
    currentPage = 1; // Reset to first page for new search

    if (currentSearchTerm) {
        getMovies(currentPage);
        search.value = "";
    }
});


async function applyFilters(page) {
    let url = `${API_BASE_URL}?api_key=${API_KEY}&page=${page}`;

    // Check for a search term and apply it if present
    if (currentSearchTerm) {
        url = `${SEARCHAPI}${currentSearchTerm}&page=${page}`;
    } else {
        // Apply genre filter if selected
        const genre = document.querySelector('[name="genre"]').value;
        if (genre && genre !== 'a') { // Assuming 'a' is the value for "Select Genre"
            url += `&with_genres=${genre}`;
        }

        // Apply year filter if selected
        const year = document.querySelector('[name="year"]').value;
        if (year && year !== 'a') { // Assuming 'a' is the value for "Select Year"
            url += `&primary_release_year=${year}`;
        }

        // Note: The TMDb API does not have a rating filter, so we will filter by vote_average after fetching the results.
    }
    
    try {
        const response = await fetch(url);
        const respData = await response.json();
        totalPages = respData.total_pages;

        let filteredResults = respData.results;
        // Apply rating filter after fetching the results
        const rating = document.querySelector('[name="rating"]').value;
        if (rating && rating !== 'a') { // Assuming 'a' is the value for "Select Rating"
            filteredResults = filteredResults.filter(movie => Math.round(movie.vote_average) >= parseInt(rating));
        }

        showMovies(filteredResults);
        updatePageControls();
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
    }
}

// Update the form event listener to handle submissions with only one filter
document.getElementById('filters-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear the search term if the filters form is submitted
    currentSearchTerm = '';
    currentPage = 1; // Reset to the first page for new filters
    applyFilters(currentPage); // Apply filters and fetch movies
});


function updatePageControls() {
    document.getElementById("currentPage").innerText = `Page ${currentPage}`;
    document.getElementById("prevButton").disabled = currentPage === 1;
}

document.getElementById("nextButton").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage += 1;
        getMovies(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
    }
});

document.getElementById("prevButton").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        getMovies(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
