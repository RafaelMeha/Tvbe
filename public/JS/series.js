let currentPage = 1;
let currentSearchTerm = '';
let totalPages = 100;

const API_BASE_URL = "https://api.themoviedb.org/3/tv/popular";
const API_KEY = "04c35731a5ee918f014970082a0088b1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const SEARCHAPI =
    "https://api.themoviedb.org/3/search/tv?&api_key=04c35731a5ee918f014970082a0088b1&query=";

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

function showMovies(series) {
    // clear main
    main.innerHTML = "";

    series.forEach((serie) => {
        const { poster_path, name, vote_average, overview } = serie; // Use 'name' instead of 'title'

        const seriesEl = document.createElement("div");
        seriesEl.classList.add("movie");

        seriesEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${name}"
            />
            <div class="movie-info">
                <h3>${name}</h3> <!-- Use 'name' here -->
                <span class="${getClassByRate(
                    vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(seriesEl);
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
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
    }
});

