const API_KEY = "04c35731a5ee918f014970082a0088b1";

// URLs
const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const MOVIES_API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=`;
const   TOP_RATED_API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

// Genre IDs
const genreIds = {
    Action: 28,
    Comedy: 35,
    Horror: 27,
    Romance: 10749,
    Drama: 18,
    Fantasy: 14,
    Adventure: 12,
    Mystery: 9648,
    Crime: 80,
    Animation: 16,
    Music: 10402,
    History: 36,
    Western: 37,
    TVMovie: 10770,
    Documentary: 99,
    Biography: 878,
    War: 10752,
};

let topRatedMovies = [];
let currentMovieIndex = 0;

async function fetchMoviesByGenre(genreId, page = 1) {
    try {
        const url = `${MOVIES_API_URL}${genreId}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results; 
    } catch (error) {
        console.error(`Fetching movies by genre failed for page ${page}:`, error);
        return [];
    }
}

async function displayMoviesForAllGenres() {
    const moviesSec = document.getElementById('moviesSec');
    moviesSec.innerHTML = ''; 

    for (const [genreName, genreId] of Object.entries(genreIds)) {
        const movies = await fetchMoviesByGenre(genreId);
        const genreContainer = document.createElement('div');
        genreContainer.classList.add('genre-container');

        const genreTitle = document.createElement('h2');
        if (genreName.length >= 2) {
            genreTitle.innerHTML = genreName.charAt(0) + `<span class="second-letter">${genreName.charAt(1)}</span>` + genreName.slice(2);
        } else {
            genreTitle.textContent = genreName; 
        }
        genreTitle.classList.add('genre-title'); 
        genreContainer.appendChild(genreTitle);

        const movieList = document.createElement('div');
        movieList.classList.add('movie-list');

        movies.slice(0, 19).forEach(movie => {
            const movieLink = document.createElement('a');
            movieLink.href = `HTML/Menu/eachMoviee.html?movieId=${movie.id}`; 
        
            const movieImg = document.createElement('img');
            movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieImg.alt = movie.title;
            movieImg.draggable = false; 
        
            movieLink.appendChild(movieImg);
            movieList.appendChild(movieLink);
        });        

        genreContainer.appendChild(movieList);
        moviesSec.appendChild(genreContainer);
    }
}

async function fetchTopRatedMovies() {
    try {
        const response = await fetch(TOP_RATED_API_URL);
        const data = await response.json();
        topRatedMovies = data.results.slice(0, 5); 
        displayMovieDetails(); 
    } catch (error) {
        console.error('Fetching top rated movies failed:', error);
    }
}

function displayMovieDetails() {
    const movie = topRatedMovies[currentMovieIndex];
    const tendSection = document.querySelector('#tend');
    
    tendSection.querySelector('h1').textContent = movie.title;
    tendSection.querySelector('p').textContent = movie.overview;
    tendSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    const playButton = tendSection.querySelector('button');
    playButton.onclick = function() {
        window.location.href = `HTML/Menu/eachMoviee.html?movieId=${movie.id}`;
    };

    currentMovieIndex = (currentMovieIndex + 1) % topRatedMovies.length;
}

displayMoviesForAllGenres();
fetchTopRatedMovies();

setInterval(displayMovieDetails, 10000);