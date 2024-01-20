const API_KEY = "04c35731a5ee918f014970082a0088b1";
const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const MOVIES_API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=`;

const genreIds = {
    Action: 28,
    Comedy: 35,
    Horror: 27,
};

async function fetchMoviesByGenre(genreId) {
    try {
        const response = await fetch(`${MOVIES_API_URL}${genreId}`);
        const data = await response.json();
        return data.results; 
    } catch (error) {
        console.error('Fetching movies by genre failed:', error);
        return [];
    }
}

async function displayMoviesForAllGenres() {
    const moviesContainer = document.getElementById('genre-movies-container');
    moviesContainer.innerHTML = ''; 

    for (const [genreName, genreId] of Object.entries(genreIds)) {
        const movies = await fetchMoviesByGenre(genreId);
        movies.forEach(movie => {
            const movieImg = document.createElement('img');
            movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieImg.alt = movie.title;
            movieImg.draggable = false;
            moviesContainer.appendChild(movieImg);
        });
    }
}

displayMoviesForAllGenres();
