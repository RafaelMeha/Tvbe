const API_KEY = "04c35731a5ee918f014970082a0088b1";
const BASE_URL = 'https://api.themoviedb.org/3';

const params = new URLSearchParams(window.location.search);
const movieId = params.get('movieId');

async function fetchMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovieDetails(data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function displayMovieDetails(data) {
    document.querySelector('.movie-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.querySelector('.movie-title').textContent = data.title;
    document.querySelector('.movie-rating').textContent = `Rating: ${data.vote_average}`;
    document.querySelector('.movie-duration').textContent = `Duration: ${data.runtime} min`;
    document.querySelector('.movie-release-year').textContent = `Release Year: ${new Date(data.release_date).getFullYear()}`;
    document.querySelector('.movie-genres').textContent = `Genres: ${data.genres.map(genre => genre.name).join(', ')}`;
    document.querySelector('.movie-summary').textContent = data.overview;
    
    const cast = data.credits.cast.map(actor => actor.name).join(', ');
    document.querySelector('.movie-cast').textContent = `Starring: ${cast}`;
    
    const director = data.credits.crew.find(member => member.job === 'Director');
    document.querySelector('.movie-director').textContent = `Directed by: ${director ? director.name : 'N/A'}`;

    document.title = `Tvbe - ${data.title}`;
}

if (movieId) {
    fetchMovieDetails(movieId);
}