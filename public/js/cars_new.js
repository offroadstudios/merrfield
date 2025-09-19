// VERSION 13 - FINAL FIX - USING DIRECT API IMAGE URLS
$(document).ready(function() {
    let allCars = [];
    let filteredCars = [];
    let currentPage = 1;
    const carsPerPage = 12;
    
    // Load cars on page load
    loadCars();
    
    // Filter event handlers
    $('#applyFilters').click(applyFilters);
    $('#clearFilters').click(clearFilters);
    $('#sortBy').change(applySorting);
    
    // Load more cars
    $('#loadMoreBtn').click(loadMoreCars);
    
    function loadCars() {
        console.log('VERSION 13 - FINAL FIX - Loading cars with DIRECT API IMAGE URLS...');
        showLoading(true);
        
        $.ajax({
            url: '/cars/data',
            method: 'GET',
            cache: false,
            data: { _: Date.now() }, // Force cache bust
            success: function(response) {
                console.log('Cars loaded successfully:', response);
                allCars = response.vehicles || [];
                filteredCars = [...allCars];
                
                console.log('Total cars loaded:', allCars.length);
                console.log('First car:', allCars[0]);
                console.log('First car image:', allCars[0]?.imagePath);
                console.log('Second car:', allCars[1]);
                console.log('Second car image:', allCars[1]?.imagePath);
                
                populateBrandFilter();
                displayCars();
                updateResultsCount();
                showLoading(false);
            },
            error: function(xhr, status, error) {
                console.error('Error loading cars:', error);
                console.error('Response:', xhr.responseText);
                showError('Failed to load cars. Please try again.');
                showLoading(false);
            }
        });
    }
    
    function populateBrandFilter() {
        const brands = [...new Set(allCars.map(car => car.brand))].sort();
        const brandFilter = $('#brandFilter');
        
        brandFilter.empty();
        brandFilter.append('<option value="">All Brands</option>');
        
        brands.forEach(brand => {
            brandFilter.append(`<option value="${brand}">${brand}</option>`);
        });
    }
    
    function displayCars() {
        console.log('Displaying cars...');
        console.log('Filtered cars count:', filteredCars.length);
        
        const carsGrid = $('#carsGrid');
        
        // Only clear the grid if we're on page 1 (fresh load or filter applied)
        if (currentPage === 1) {
            carsGrid.empty();
        }
        
        if (filteredCars.length === 0) {
            showNoResults();
            return;
        }
        
        const startIndex = (currentPage - 1) * carsPerPage;
        const endIndex = startIndex + carsPerPage;
        const carsToShow = filteredCars.slice(startIndex, endIndex);
        
        console.log('Cars to show:', carsToShow.length);
        console.log('First car to show:', carsToShow[0]);
        
        carsToShow.forEach((car, index) => {
            console.log(`Creating card ${index + 1} for:`, car.title, 'Image:', car.imagePath);
            const carCard = createCarCard(car);
            carsGrid.append(carCard);
        });
        
        // Show/hide load more button
        if (endIndex < filteredCars.length) {
            $('#loadMoreBtn').show();
        } else {
            $('#loadMoreBtn').hide();
        }
    }
    
    function createCarCard(car) {
        const timestamp = Date.now();
        
        // Use the real API image URL directly
        let imageUrl;
        if (car.imagePath) {
            // Use the imagePath directly - handle both {resize} and 800x600 cases
            let processedImagePath = car.imagePath;
            if (processedImagePath.includes('800x600')) {
                // Convert 800x600 back to {resize} for proper API usage
                processedImagePath = processedImagePath.replace('800x600', '{resize}');
            }
            imageUrl = `${processedImagePath}?v=${timestamp}`;
        } else if (car.images && car.images.length > 0) {
            // Fallback to first image from images array
            const exteriorImage = car.images.find(img => img.category === 'Exterior');
            const firstImage = exteriorImage || car.images[0];
            // Handle both {resize} and 800x600 cases
            let processedUrl = firstImage.url;
            if (processedUrl.includes('800x600')) {
                // Convert 800x600 back to {resize} for proper API usage
                processedUrl = processedUrl.replace('800x600', '{resize}');
            }
            imageUrl = `${processedUrl}?v=${timestamp}`;
        } else {
            // Use Merrifield logo as default thumbnail for cars without images
            imageUrl = `/images/t1.png?v=${timestamp}`;
        }
        
        console.log('Creating card for:', car.title);
        console.log('ImagePath:', car.imagePath);
        console.log('Images array length:', car.images ? car.images.length : 0);
        console.log('Final Image URL:', imageUrl);
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="car-card" onclick="viewCarDetails('${car._id}')">
                    <div class="car-image-container">
                        <img src="${imageUrl}" alt="${car.title}" class="car-image">
                        <div class="car-price">£${car.price?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div class="car-body">
                        <h5 class="car-title">${car.title || 'Unknown Car'}</h5>
                        <p class="car-subtitle">${car.brand || ''} ${car.model || ''} • ${car.year || ''}</p>
                        
                        <div class="car-specs">
                            <div class="spec-item">
                                <i class="fas fa-tachometer-alt"></i>
                                <span>${car.mileage?.toLocaleString() || 'N/A'} miles</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-cog"></i>
                                <span>${car.transmission || 'N/A'}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-gas-pump"></i>
                                <span>${car.fuelType || 'N/A'}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-car"></i>
                                <span>${car.bodyType || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="car-actions">
                            <button class="btn btn-view" onclick="event.stopPropagation(); viewCarDetails('${car._id}')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-whatsapp" onclick="event.stopPropagation(); contactWhatsApp('${car._id}')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function applyFilters() {
        const brand = $('#brandFilter').val();
        const bodyType = $('#bodyTypeFilter').val();
        const priceRange = $('#priceFilter').val();
        const fuelType = $('#fuelFilter').val();
        
        filteredCars = allCars.filter(car => {
            let matches = true;
            
            if (brand && car.brand !== brand) matches = false;
            if (bodyType && car.bodyType !== bodyType) matches = false;
            if (fuelType && car.fuelType !== fuelType) matches = false;
            
            if (priceRange && car.price) {
                const price = car.price;
                if (priceRange === '0-20000' && price > 20000) matches = false;
                if (priceRange === '20000-30000' && (price < 20000 || price > 30000)) matches = false;
                if (priceRange === '30000-40000' && (price < 30000 || price > 40000)) matches = false;
                if (priceRange === '40000-50000' && (price < 40000 || price > 50000)) matches = false;
                if (priceRange === '50000+' && price < 50000) matches = false;
            }
            
            return matches;
        });
        
        currentPage = 1; // Reset to page 1 when applying filters
        displayCars();
        updateResultsCount();
    }
    
    function clearFilters() {
        $('#brandFilter').val('');
        $('#bodyTypeFilter').val('');
        $('#priceFilter').val('');
        $('#fuelFilter').val('');
        
        filteredCars = [...allCars];
        currentPage = 1; // Reset to page 1 when clearing filters
        displayCars();
        updateResultsCount();
    }
    
    function applySorting() {
        const sortBy = $('#sortBy').val();
        
        filteredCars.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return (a.price || 0) - (b.price || 0);
                case 'price-desc':
                    return (b.price || 0) - (a.price || 0);
                case 'year-desc':
                    return (b.year || 0) - (a.year || 0);
                case 'mileage-asc':
                    return (a.mileage || 0) - (b.mileage || 0);
                default:
                    return 0;
            }
        });
        
        currentPage = 1; // Reset to page 1 when applying sorting
        displayCars();
    }
    
    function loadMoreCars() {
        currentPage++;
        displayCars();
    }
    
    function updateResultsCount() {
        const count = filteredCars.length;
        const text = count === 1 ? '1 car found' : `${count} cars found`;
        $('#resultsCount').text(text);
    }
    
    function showLoading(show) {
        if (show) {
            $('#carsGrid').html(`
                <div class="col-12">
                    <div class="loading-spinner" style="display: block;">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading cars...</p>
                    </div>
                </div>
            `);
        }
    }
    
    function showNoResults() {
        $('#carsGrid').html(`
            <div class="col-12">
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No cars found</h3>
                    <p>Try adjusting your filters to see more results.</p>
                    <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
                </div>
            </div>
        `);
    }
    
    function showError(message) {
        $('#carsGrid').html(`
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${message}
                </div>
            </div>
        `);
    }
});

// Helper function to get car color based on brand
function getCarColor(brand) {
    const colors = {
        'Audi': '0066cc',
        'BMW': '1a1a1a',
        'Mercedes-Benz': '00a651',
        'Jaguar': 'ff6600',
        'Land Rover': '8b4513',
        'Vauxhall': 'ff0000',
        'MG': 'ff6b35',
        'Tesla': 'cc0000',
        'Ford': '003366',
        'Volkswagen': '0066cc'
    };
    return colors[brand] || '666666';
}

// Global functions
function viewCarDetails(carId) {
    window.location.href = `/cars/details/${carId}`;
}

function contactWhatsApp(carId) {
    const message = `Hi! I'm interested in this car. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/447123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

