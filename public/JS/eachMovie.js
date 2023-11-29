const API_KEY = "04c35731a5ee918f014970082a0088b1";
const BASE_URL = 'https://api.themoviedb.org/3';

const params = new URLSearchParams(window.location.search);
const movieId = params.get('movieId');
const seriesId = params.get('seriesId');

async function fetchMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovieDetails(data);
        displayTrailer(data.videos.results); // Assumes that the videos are included in the response
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function displayTrailer(videos) {
    // Find the first trailer in the list of videos
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailer) {
        const trailerEmbedUrl = `https://www.youtube.com/embed/${trailer.key}`;
        // Assuming you have an iframe with the id 'movie-trailer' in your HTML
        document.getElementById('movie-trailer').src = trailerEmbedUrl;
    }
}

function displayMovieDetails(data) {
    document.querySelector('.movie-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.querySelector('.movie-poster').draggable = false;
    document.querySelector('.movie-title').textContent = data.title;

    var ratingPoints = document.createElement('p');
    ratingPoints.textContent = `${data.vote_average.toFixed(1)}`;
    ratingPoints.className = 'rating-points';
    document.querySelector('.movie-rating').appendChild(ratingPoints);
    
    var ratingImg = document.createElement('img');
    ratingImg.src = "../../ASSETS/Movies/1⭐.png";
    ratingImg.alt = 'Star';
    ratingImg.className = 'star';
    document.querySelector('.movie-rating').appendChild(ratingImg);
    // document.querySelector('.movie-rating').textContent = `Rating: ${data.vote_average}`;
    document.querySelector('.movie-duration').textContent = `${data.runtime} min`;
    document.querySelector('.movie-release-year').textContent = `${new Date(data.release_date).getFullYear()}`;
    document.querySelector('.movie-genres').textContent = `${data.genres.map(genre => genre.name).join(', ')}`;
    document.querySelector('.movie-summary').textContent = data.overview;
    
    const mainCast = data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
    var starring = document.createElement('span');
    starring.textContent = 'Starring:';
    document.querySelector('.movie-cast').appendChild(starring);
    
    var starringPeople = document.createElement('p');
    starringPeople.textContent = `${mainCast}`;
    starringPeople.className = 'starring-people';
    document.querySelector('.movie-cast').appendChild(starringPeople);
    //document.querySelector('.movie-cast').textContent = `${mainCast}`;
      
    const director = data.credits.crew.find(member => member.job === 'Director');
    var direct = document.createElement('span');
    direct.textContent = 'Director:';
    document.querySelector('.movie-director').appendChild(direct);
    var directorName = document.createElement('p');
    directorName.textContent = `${director ? director.name : 'N/A'}`;
    directorName.className = 'director-name';
    document.querySelector('.movie-director').appendChild(directorName);
    ///document.querySelector('.movie-director').textContent = `Directed by: ${director ? director.name : 'N/A'}`;

    document.title = `Tvbe - ${data.title}`;
}

async function fetchSeriesDetails(seriesId) {
    const url = `${BASE_URL}/movie/${seriesId}?api_key=${API_KEY}&append_to_response=credits,videos`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovieDetails(data);
        displayTrailer(data.videos.results); // Assumes that the videos are included in the response
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function displayTrailer(videos) {
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailer) {
        const trailerEmbedUrl = `https://www.youtube.com/embed/${trailer.key}`;
        // Assuming you have an iframe with the id 'movie-trailer' in your HTML
        document.getElementById('movie-trailer').src = trailerEmbedUrl;
    }
}

function displaySeriesDetails(data) {
    document.querySelector('.movie-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.querySelector('.movie-poster').draggable = false;
    document.querySelector('.movie-title').textContent = data.title;

    var ratingPoints = document.createElement('p');
    ratingPoints.textContent = `${data.vote_average.toFixed(1)}`;
    ratingPoints.className = 'rating-points';
    document.querySelector('.movie-rating').appendChild(ratingPoints);
    
    var ratingImg = document.createElement('img');
    ratingImg.src = "../../ASSETS/Movies/1⭐.png";
    ratingImg.alt = 'Star';
    ratingImg.className = 'star';
    document.querySelector('.movie-rating').appendChild(ratingImg);
    // document.querySelector('.movie-rating').textContent = `Rating: ${data.vote_average}`;
    document.querySelector('.movie-duration').textContent = `${data.runtime} min`;
    document.querySelector('.movie-release-year').textContent = `${new Date(data.release_date).getFullYear()}`;
    document.querySelector('.movie-genres').textContent = `${data.genres.map(genre => genre.name).join(', ')}`;
    document.querySelector('.movie-summary').textContent = data.overview;
    
    const mainCast = data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
    var starring = document.createElement('span');
    starring.textContent = 'Starring:';
    document.querySelector('.movie-cast').appendChild(starring);
    
    var starringPeople = document.createElement('p');
    starringPeople.textContent = `${mainCast}`;
    starringPeople.className = 'starring-people';
    document.querySelector('.movie-cast').appendChild(starringPeople);
    //document.querySelector('.movie-cast').textContent = `${mainCast}`;
      
    const director = data.credits.crew.find(member => member.job === 'Director');
    var direct = document.createElement('span');
    direct.textContent = 'Director:';
    document.querySelector('.movie-director').appendChild(direct);
    var directorName = document.createElement('p');
    directorName.textContent = `${director ? director.name : 'N/A'}`;
    directorName.className = 'director-name';
    document.querySelector('.movie-director').appendChild(directorName);
    ///document.querySelector('.movie-director').textContent = `Directed by: ${director ? director.name : 'N/A'}`;

    document.title = `Tvbe - ${data.title}`;
}

if (movieId) {
    fetchMovieDetails(movieId);
}  
