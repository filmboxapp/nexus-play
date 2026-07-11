// API Configuration
const API_CONFIG = {
    TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE', // Reemplaza con tu API key de TMDB
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p',
    UNLIMPLAY_MOVIE_URL: 'https://unlimplay.com/f/embed/movie',
    UNLIMPLAY_SERIES_URL: 'https://unlimplay.com/f/embed/tv'
};

// Image sizes
const IMAGE_SIZES = {
    poster: '/w500',
    backdrop: '/w1280',
    logo: '/w92'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
