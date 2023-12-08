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
    const url = `${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&append_to_response=credits,videos`;
    console.log('Fetching URL:', url); // Debugging: log the full URL
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            console.log('Response Data:', data);
            console.log('Videos:', data.videos.results); // This will show you the video results
            displaySeriesDetails(data);
            displayTrailer(data.videos.results);
        } else {
            // ... existing error handling code ...
        }
    } catch (error) {
        console.error('Error fetching series details:', error);
    }
}

function displayTrailer(videos) {
    const trailerElement = document.getElementById('movie-trailer');
    const holeElement = document.getElementById('hole'); // Get the container element for the trailer

    if (!videos || videos.length === 0) {
        console.error('No videos available for this series.');
        if (trailerElement) {
            trailerElement.style.display = 'none'; // Hide the trailer iframe
        }
        // Display the message directly in the 'hole' div
        holeElement.innerHTML = '<p class="trailer-not-available">⚠️Trailer not available. <br> Sorry for the inconvenience!🥲</p>';
        return;
    }
    
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    
    if (trailer) {
        const trailerEmbedUrl = `https://www.youtube.com/embed/${trailer.key}`;
        trailerElement.src = trailerEmbedUrl;
        trailerElement.style.display = 'block'; // Make sure the iframe is visible
        // Ensure any existing not available message is cleared
        holeElement.querySelector('.trailer-not-available')?.remove();
    } else {
        console.error('Trailer not found or iframe element missing');
        if (trailerElement) {
            trailerElement.style.display = 'none'; // Hide the trailer iframe
        }
        // Display the message directly in the 'hole' div
        holeElement.innerHTML = '<p class="trailer-not-available">⚠️Trailer not available. <br> Sorry for the inconvenience!🥲</p>';
    }
}


function displaySeriesDetails(data) {
    document.querySelector('.movie-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.querySelector('.movie-poster').draggable = false;
    document.querySelector('.movie-title').textContent = data.name;


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
    const totalEpisodes = data.seasons.reduce((acc, season) => acc + season.episode_count, 0);
    document.querySelector('.movie-duration').textContent = `${data.seasons.length} seasons, ${totalEpisodes} episodes`;
    document.querySelector('.movie-release-year').textContent = `${new Date(data.first_air_date).getFullYear()}`;
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

    document.title = `Tvbe - ${data.name}`;
}

if (movieId) {
    fetchMovieDetails(movieId);
}  

if(seriesId){
    fetchSeriesDetails(seriesId);
}

// // Funcao para salvar o estado da checkbox em um cookie
// function saveCheckboxState() {
//     // Obtem a referencia para a checkbox
//     var checkbox = document.getElementById('my-list-button');
    
//     // Armazena o estado do checkbox em um cookie
//     document.cookie = 'checkboxState=' + checkbox.checked;
// }


// // Funcao para obter a data de expiracao para o cookie
// // function getCookieExpiration(days) {
// //     var date = new Date();
// //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
// //     return date.toUTCString();
// // }

// // Funcao executada ao carregar a pagina
// window.onload = function() {
//     // Obtem a referencia para a checkbox
//     var checkbox = document.getElementById('my-list-button');

//     // Obtem o valor do cookie 'checkboxState'
//     var checkboxState = getCookieValue('checkboxState');
    
//     // Se o valor do cookie existir, define o estado da checkbox de acordo
//     if (checkboxState !== null) {
//         checkbox.checked = checkboxState === 'true';
//     }
// };

// // Funcao para obter o valor de um cookie pelo nome
// function getCookieValue(name) {
//     // Divide a string de cookies em pares chave-valor
//     var cookies = document.cookie.split('; ');
    
//     // Itera sobre os cookies
//     for (var i = 0; i < cookies.length; i++) {
//         // Divide cada cookie em chave e valor
//         var cookie = cookies[i].split('=');

//         // Se a chave corresponder ao nome desejado, retorna o valor
//         if (cookie[0] === name) {
//             return cookie[1];
//         }
//     }
//     // Retorna null se o cookie nao for encontrado
//     return null;
// }