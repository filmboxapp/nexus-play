// Main Application Logic

class NexusPlay {
    constructor() {
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContent();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Logo click
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => window.location.href = 'index.html');
        }
    }

    async loadContent() {
        try {
            // Load trending
            await this.loadTrending();
            
            // Load popular movies
            await this.loadPopularMovies();
            
            // Load popular series
            await this.loadPopularSeries();
            
            // Load top rated
            await this.loadTopRated();
            
            // Load new releases
            await this.loadNewReleases();
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError('Error cargando contenido');
        }
    }

    async loadTrending() {
        const container = document.getElementById('trendingContainer');
        if (!container) return;

        container.innerHTML = this.getSkeletons(8);

        try {
            const data = await tmdb.getTrending('all', 'week');
            container.innerHTML = this.createCardsHtml(data.results);
        } catch (error) {
            console.error('Error loading trending:', error);
        }
    }

    async loadPopularMovies() {
        const container = document.getElementById('popularMoviesContainer');
        if (!container) return;

        container.innerHTML = this.getSkeletons(8);

        try {
            const data = await tmdb.getPopularMovies(1);
            container.innerHTML = this.createCardsHtml(data.results, 'movie');
        } catch (error) {
            console.error('Error loading popular movies:', error);
        }
    }

    async loadPopularSeries() {
        const container = document.getElementById('popularSeriesContainer');
        if (!container) return;

        container.innerHTML = this.getSkeletons(8);

        try {
            const data = await tmdb.getPopularSeries(1);
            container.innerHTML = this.createCardsHtml(data.results, 'tv');
        } catch (error) {
            console.error('Error loading popular series:', error);
        }
    }

    async loadTopRated() {
        const container = document.getElementById('topRatedContainer');
        if (!container) return;

        container.innerHTML = this.getSkeletons(8);

        try {
            const movieData = await tmdb.getTopRatedMovies(1);
            container.innerHTML = this.createCardsHtml(movieData.results, 'movie');
        } catch (error) {
            console.error('Error loading top rated:', error);
        }
    }

    async loadNewReleases() {
        const container = document.getElementById('newReleasesContainer');
        if (!container) return;

        container.innerHTML = this.getSkeletons(8);

        try {
            const data = await tmdb.getUpcomingMovies(1);
            container.innerHTML = this.createCardsHtml(data.results, 'movie');
        } catch (error) {
            console.error('Error loading new releases:', error);
        }
    }

    createCardsHtml(items, defaultType = null) {
        if (!items || items.length === 0) {
            return '<div class="empty-state"><p>No hay contenido disponible</p></div>';
        }

        return items
            .filter(item => item.poster_path)
            .map(item => {
                const type = item.media_type || defaultType || (item.first_air_date ? 'tv' : 'movie');
                const id = item.id;
                const title = item.title || item.name;
                const posterUrl = tmdb.getImageUrl(item.poster_path, IMAGE_SIZES.poster);
                const rating = (item.vote_average / 2).toFixed(1);
                const year = (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A';

                const link = type === 'tv' 
                    ? `series.html?id=${id}&season=1` 
                    : `movie.html?id=${id}`;

                return `
                    <div class="card" onclick="window.location.href='${link}'" style="cursor: pointer;">
                        <div class="card-image">
                            <img src="${posterUrl}" alt="${title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 500 750%22%3E%3Crect fill=%22%231a2535%22 width=%22500%22 height=%22750%22/%3E%3C/svg%3E'">
                            <div class="card-overlay">
                                <div class="card-info">
                                    <div class="card-title">${title}</div>
                                    <div class="card-meta">
                                        <span class="card-rating">
                                            <span class="card-rating-star">★</span>
                                            ${rating}
                                        </span>
                                        <span>${year}</span>
                                    </div>
                                    <span class="card-type">${type === 'tv' ? 'SERIE' : 'PELÍCULA'}</span>
                                </div>
                            </div>
                            <div class="card-premium">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L15 10H23L17 15L19 23L12 18L5 23L7 15L1 10H9L12 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    getSkeletons(count = 8) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="card">
                    <div class="card-image skeleton" style="aspect-ratio: 3/4;"></div>
                </div>
            `;
        }
        return html;
    }

    async handleSearch(query) {
        if (!query.trim()) {
            this.loadContent();
            return;
        }

        const sections = [
            { id: 'trendingContainer', label: 'Tendencias' },
            { id: 'popularMoviesContainer', label: 'Películas' },
            { id: 'popularSeriesContainer', label: 'Series' },
            { id: 'topRatedContainer', label: 'Mejor Calificadas' },
            { id: 'newReleasesContainer', label: 'Recién Agregadas' }
        ];

        try {
            // Clear other sections
            sections.forEach(section => {
                const container = document.getElementById(section.id);
                if (container) container.innerHTML = '';
            });

            // Search both movies and series
            const [movies, series] = await Promise.all([
                tmdb.searchMovies(query, 1),
                tmdb.searchSeries(query, 1)
            ]);

            const movieContainer = document.getElementById('popularMoviesContainer');
            const seriesContainer = document.getElementById('popularSeriesContainer');

            if (movieContainer) {
                movieContainer.innerHTML = movies.results.length > 0
                    ? this.createCardsHtml(movies.results, 'movie')
                    : '<div class="empty-state"><p>No se encontraron películas</p></div>';
            }

            if (seriesContainer) {
                seriesContainer.innerHTML = series.results.length > 0
                    ? this.createCardsHtml(series.results, 'tv')
                    : '<div class="empty-state"><p>No se encontraron series</p></div>';
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    showError(message) {
        console.error(message);
        // Implementar notificación visual si es necesario
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NexusPlay();
});
