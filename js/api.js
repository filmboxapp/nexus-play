// TMDB API Functions

class TMDBApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = API_CONFIG.TMDB_BASE_URL;
    }

    async request(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseUrl}${endpoint}`);
            url.searchParams.append('api_key', this.apiKey);
            url.searchParams.append('language', 'es-ES');
            
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    url.searchParams.append(key, value);
                }
            });

            const response = await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('TMDB API Error:', error);
            throw error;
        }
    }

    // Trending movies and series
    async getTrending(type = 'all', timeWindow = 'week') {
        return this.request(`/trending/${type}/${timeWindow}`, {
            page: 1
        });
    }

    // Popular movies
    async getPopularMovies(page = 1) {
        return this.request('/movie/popular', {
            page
        });
    }

    // Popular series
    async getPopularSeries(page = 1) {
        return this.request('/tv/popular', {
            page
        });
    }

    // Top rated movies
    async getTopRatedMovies(page = 1) {
        return this.request('/movie/top_rated', {
            page
        });
    }

    // Top rated series
    async getTopRatedSeries(page = 1) {
        return this.request('/tv/top_rated', {
            page
        });
    }

    // Upcoming movies
    async getUpcomingMovies(page = 1) {
        return this.request('/movie/upcoming', {
            page
        });
    }

    // Get movie details
    async getMovieDetails(movieId) {
        return this.request(`/movie/${movieId}`, {
            append_to_response: 'credits,recommendations,similar'
        });
    }

    // Get series details
    async getSeriesDetails(seriesId) {
        return this.request(`/tv/${seriesId}`, {
            append_to_response: 'credits,recommendations,similar'
        });
    }

    // Get season details
    async getSeasonDetails(seriesId, seasonNumber) {
        return this.request(`/tv/${seriesId}/season/${seasonNumber}`);
    }

    // Get episode details
    async getEpisodeDetails(seriesId, seasonNumber, episodeNumber) {
        return this.request(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`);
    }

    // Search movies
    async searchMovies(query, page = 1) {
        return this.request('/search/movie', {
            query,
            page
        });
    }

    // Search series
    async searchSeries(query, page = 1) {
        return this.request('/search/tv', {
            query,
            page
        });
    }

    // Get image URL
    getImageUrl(path, size = 'w500') {
        if (!path) return null;
        return `${API_CONFIG.TMDB_IMAGE_BASE}${size}${path}`;
    }

    // Get embed URL
    getEmbedUrl(type, id, season = null, episode = null) {
        if (type === 'movie') {
            return `${API_CONFIG.UNLIMPLAY_MOVIE_URL}/${id}`;
        } else if (type === 'tv') {
            return `${API_CONFIG.UNLIMPLAY_SERIES_URL}/${id}/${season}/${episode}`;
        }
        return null;
    }
}

// Initialize API
const tmdb = new TMDBApi(API_CONFIG.TMDB_API_KEY);
