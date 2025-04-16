// Search functionality for Academic Materials Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize multi-tag search
    initializeTagSearch();
    
    // Initialize search filters
    initializeSearchFilters();
    
    // Initialize sort functionality
    initializeSorting();
    
    // Handle live search if enabled
    initializeLiveSearch();
});

// Initialize tag-based search functionality
function initializeTagSearch() {
    const tagSelect = document.getElementById('tag-select');
    const selectedTagsContainer = document.getElementById('selected-tags');
    const tagSearchInput = document.getElementById('tag-search-input');
    
    if (!tagSelect || !selectedTagsContainer) return;
    
    // Handle tag selection
    tagSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const tagId = selectedOption.value;
        const tagName = selectedOption.text;
        const tagCategory = selectedOption.dataset.category || 'custom';
        
        if (tagId && !document.querySelector(`input[name="tags"][value="${tagId}"]`)) {
            addTag(tagId, tagName, tagCategory);
        }
        
        // Reset select
        this.selectedIndex = 0;
    });
    
    // Handle tag search if input exists
    if (tagSearchInput) {
        tagSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const options = tagSelect.options;
            
            for (let i = 1; i < options.length; i++) {
                const optionText = options[i].text.toLowerCase();
                if (optionText.includes(searchTerm)) {
                    options[i].style.display = '';
                } else {
                    options[i].style.display = 'none';
                }
            }
        });
    }
    
    // Pre-populate selected tags if they exist in the form
    const existingTags = document.querySelectorAll('input[name="tags"]');
    existingTags.forEach(tagInput => {
        const tagId = tagInput.value;
        const tagElement = document.querySelector(`[data-tag-id="${tagId}"]`);
        if (tagElement) {
            const tagName = tagElement.textContent;
            const tagCategory = tagElement.dataset.category || 'custom';
            addTag(tagId, tagName, tagCategory);
        }
    });
    
    // Function to add a tag to the selected tags container
    function addTag(id, name, category) {
        // Create tag element
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag', category);
        tagElement.textContent = name;
        
        // Create remove button
        const removeButton = document.createElement('span');
        removeButton.classList.add('tag-remove');
        removeButton.innerHTML = '&times;';
        removeButton.addEventListener('click', function() {
            tagElement.remove();
            document.querySelector(`input[name="tags"][value="${id}"]`).remove();
        });
        
        // Create hidden input for form submission
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'tags';
        hiddenInput.value = id;
        
        // Append everything
        tagElement.appendChild(removeButton);
        selectedTagsContainer.appendChild(tagElement);
        document.querySelector('form').appendChild(hiddenInput);
    }
}

// Initialize search filters
function initializeSearchFilters() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterContainer = document.getElementById('filter-container');
    
    if (filterToggle && filterContainer) {
        filterToggle.addEventListener('click', function() {
            filterContainer.classList.toggle('show');
            this.textContent = filterContainer.classList.contains('show') ? 'Hide Filters' : 'Show Filters';
        });
    }
    
    // Type filter
    const typeFilter = document.getElementById('material_type');
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            document.getElementById('search-form').submit();
        });
    }
    
    // Price range filter
    const priceMin = document.getElementById('price_min');
    const priceMax = document.getElementById('price_max');
    const priceRange = document.getElementById('price_range');
    
    if (priceMin && priceMax && priceRange) {
        // Update range input from min/max inputs
        function updatePriceRange() {
            const min = parseFloat(priceMin.value) || 0;
            const max = parseFloat(priceMax.value) || 100;
            priceRange.value = min + ',' + max;
        }
        
        priceMin.addEventListener('change', updatePriceRange);
        priceMax.addEventListener('change', updatePriceRange);
        
        // Update min/max inputs from range input
        priceRange.addEventListener('input', function() {
            const values = this.value.split(',');
            if (values.length === 2) {
                priceMin.value = values[0];
                priceMax.value = values[1];
            }
        });
    }
    
    // Availability filter
    const availabilityFilter = document.getElementById('availability');
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', function() {
            document.getElementById('search-form').submit();
        });
    }
}

// Initialize sorting functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sort_by');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            document.getElementById('search-form').submit();
        });
    }
}

// Initialize live search functionality
function initializeLiveSearch() {
    const searchInput = document.getElementById('search-query');
    const resultsContainer = document.getElementById('live-search-results');
    
    if (searchInput && resultsContainer) {
        let debounceTimer;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            // Clear previous timer
            clearTimeout(debounceTimer);
            
            // Hide results if query is empty
            if (!query) {
                resultsContainer.innerHTML = '';
                resultsContainer.classList.remove('show');
                return;
            }
            
            // Debounce search to avoid too many requests
            debounceTimer = setTimeout(() => {
                // Show loading indicator
                resultsContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
                resultsContainer.classList.add('show');
                
                // Fetch search results
                fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        // Clear results container
                        resultsContainer.innerHTML = '';
                        
                        if (data.length === 0) {
                            resultsContainer.innerHTML = '<div class="empty-state">No results found</div>';
                            return;
                        }
                        
                        // Display results
                        data.forEach(material => {
                            const resultItem = document.createElement('div');
                            resultItem.classList.add('search-result-item');
                            
                            resultItem.innerHTML = `
                                <a href="/material/${material.id}" class="search-result-link">
                                    <div class="search-result-title">${material.title}</div>
                                    <div class="search-result-info">
                                        ${material.material_type} · ${material.course_code || 'No course code'} · ${material.price ? '$' + material.price : 'Free'}
                                    </div>
                                </a>
                            `;
                            
                            resultsContainer.appendChild(resultItem);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching search results:', error);
                        resultsContainer.innerHTML = '<div class="empty-state">Error fetching results</div>';
                    });
            }, 300);
        });
        
        // Hide results when clicking outside
        document.addEventListener('click', function(event) {
            if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
                resultsContainer.classList.remove('show');
            }
        });
    }
}

// Material filtering on search results page
function filterMaterials() {
    const filters = {
        type: document.getElementById('filter-type')?.value || 'all',
        priceMin: parseFloat(document.getElementById('filter-price-min')?.value) || 0,
        priceMax: parseFloat(document.getElementById('filter-price-max')?.value) || Infinity,
        availability: document.getElementById('filter-availability')?.checked || false,
        tags: Array.from(document.querySelectorAll('.filter-tag:checked')).map(el => el.value)
    };
    
    const materials = document.querySelectorAll('.material-card');
    let visibleCount = 0;
    
    materials.forEach(material => {
        const type = material.dataset.type;
        const price = parseFloat(material.dataset.price) || 0;
        const available = material.dataset.available === 'true';
        const materialTags = material.dataset.tags?.split(',') || [];
        
        // Check if material matches all filters
        const typeMatch = filters.type === 'all' || type === filters.type;
        const priceMatch = price >= filters.priceMin && price <= filters.priceMax;
        const availabilityMatch = !filters.availability || available;
        const tagsMatch = filters.tags.length === 0 || filters.tags.some(tag => materialTags.includes(tag));
        
        if (typeMatch && priceMatch && availabilityMatch && tagsMatch) {
            material.style.display = '';
            visibleCount++;
        } else {
            material.style.display = 'none';
        }
    });
    
    // Update count
    const countElement = document.getElementById('results-count');
    if (countElement) {
        countElement.textContent = visibleCount;
    }
    
    // Show empty state if no results
    const emptyState = document.getElementById('empty-results');
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}
