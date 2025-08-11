document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const resourceList = document.getElementById('resource-list');
    const filterContainer = document.getElementById('filter-container');
    const searchBar = document.getElementById('search-bar');
    const sortBy = document.getElementById('sort-by');
    const activeFiltersDisplay = document.getElementById('active-filters-display');

    // State Management
    let allResources = [];
    const activeFilters = {
        audience: new Set(),
        format: new Set(),
        language: new Set(),
        features: new Set(),
        diagnosis: new Set(),
        symptom: new Set(),
        therapyStyle: new Set()
    };
    const filterKeys = Object.keys(activeFilters);

    // --- 1. DATA FETCHING ---
    fetch('/resourcedatabase/data/resources.json')
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            allResources = data;
            // Initial render
            updateUI();
            // Add event listeners after data is loaded
            searchBar.addEventListener('input', updateUI);
            sortBy.addEventListener('change', updateUI);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            resourceList.innerHTML = `<p class="text-red-400">Error: Could not load resources.</p>`;
        });

    // --- 2. MAIN UPDATE FUNCTION ---
    function updateUI() {
        const filteredResources = getFilteredAndSortedResources();
        populateAllFilters(filteredResources);
        updateActiveFiltersDisplay();
        displayResources(filteredResources);
    }

    // --- 3. FILTERING AND SORTING LOGIC ---
    function getFilteredAndSortedResources() {
        const searchQuery = searchBar.value.toLowerCase();

        // Apply checkbox filters first
        const checkboxFiltered = allResources.filter(resource => {
            const check = (key, resourceValue) => {
                if (activeFilters[key].size === 0) return true;
                if (Array.isArray(resourceValue)) {
                    return resourceValue.some(val => activeFilters[key].has(val));
                }
                return activeFilters[key].has(resourceValue);
            };
            return filterKeys.every(key => {
                if (['diagnosis', 'symptom', 'therapyStyle'].includes(key)) {
                    return check(key, resource.topics[key]);
                }
                return check(key, resource[key]);
            });
        });

        // Apply search bar filter
        const searchFiltered = checkboxFiltered.filter(resource => {
            if (searchQuery === '') return true;
            const titleMatch = resource.title.toLowerCase().includes(searchQuery);
            const descriptionMatch = resource.description.toLowerCase().includes(searchQuery);
            return titleMatch || descriptionMatch;
        });
        
        // Apply sorting
        const sortValue = sortBy.value;
        if (sortValue === 'a-z') {
            searchFiltered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortValue === 'z-a') {
            searchFiltered.sort((a, b) => b.title.localeCompare(a.title));
        }
        
        return searchFiltered;
    }

    // --- 4. DYNAMIC UI RENDERING ---
    function populateAllFilters(filteredResources) {
        const filterData = {
            audience: {}, format: {}, language: {}, features: {}, diagnosis: {}, symptom: {}, therapyStyle: {}
        };
        const allFilterValues = {
            audience: new Set(), format: new Set(), language: new Set(), features: new Set(), diagnosis: new Set(), symptom: new Set(), therapyStyle: new Set()
        };

        // First, get all possible options from the entire dataset
        allResources.forEach(res => {
            res.audience.forEach(i => allFilterValues.audience.add(i));
            allFilterValues.format.add(res.format);
            res.language.forEach(i => allFilterValues.language.add(i));
            res.features.forEach(i => allFilterValues.features.add(i));
            res.topics.diagnosis.forEach(i => allFilterValues.diagnosis.add(i));
            res.topics.symptom.forEach(i => allFilterValues.symptom.add(i));
            res.topics.therapyStyle.forEach(i => allFilterValues.therapyStyle.add(i));
        });
        
        // Then, count matching items from the *currently filtered* list
        filteredResources.forEach(res => {
            res.audience.forEach(i => filterData.audience[i] = (filterData.audience[i] || 0) + 1);
            filterData.format[res.format] = (filterData.format[res.format] || 0) + 1;
            res.language.forEach(i => filterData.language[i] = (filterData.language[i] || 0) + 1);
            res.features.forEach(i => filterData.features[i] = (filterData.features[i] || 0) + 1);
            res.topics.diagnosis.forEach(i => filterData.diagnosis[i] = (filterData.diagnosis[i] || 0) + 1);
            res.topics.symptom.forEach(i => filterData.symptom[i] = (filterData.symptom[i] || 0) + 1);
            res.topics.therapyStyle.forEach(i => filterData.therapyStyle[i] = (filterData.therapyStyle[i] || 0) + 1);
        });

        filterContainer.innerHTML = `
            ${createFilterGroupHTML('Audience', 'audience', Array.from(allFilterValues.audience).sort(), filterData.audience)}
            ${createFilterGroupHTML('Format', 'format', Array.from(allFilterValues.format).sort(), filterData.format)}
            ${createFilterGroupHTML('Language', 'language', Array.from(allFilterValues.language).sort(), filterData.language)}
            ${createFilterGroupHTML('Features', 'features', Array.from(allFilterValues.features).sort(), filterData.features)}
            ${createFilterGroupHTML('Diagnosis', 'diagnosis', Array.from(allFilterValues.diagnosis).sort(), filterData.diagnosis)}
            ${createFilterGroupHTML('Symptom', 'symptom', Array.from(allFilterValues.symptom).sort(), filterData.symptom)}
            ${createFilterGroupHTML('Therapy Style', 'therapyStyle', Array.from(allFilterValues.therapyStyle).sort(), filterData.therapyStyle)}
        `;

        filterContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const group = e.target.dataset.group;
                const value = e.target.dataset.value;
                if (e.target.checked) {
                    activeFilters[group].add(value);
                } else {
                    activeFilters[group].delete(value);
                }
                updateUI();
            });
        });
    }

    function createFilterGroupHTML(title, groupKey, options, counts) {
        return `
            <fieldset class="filter-group">
                <legend>${title}</legend>
                <div class="filter-options">
                    ${options.map(option => {
                        const count = counts[option] || 0;
                        const isChecked = activeFilters[groupKey].has(option);
                        return `
                        <label class="filter-option" style="${!isChecked && count === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
                            <span class="flex-grow">${option}</span>
                            <span class="filter-count">${count}</span>
                            <input type="checkbox" data-group="${groupKey}" data-value="${option}" ${isChecked ? 'checked' : ''} ${!isChecked && count === 0 ? 'disabled' : ''}>
                            <span class="checkmark"></span>
                        </label>
                    `}).join('')}
                </div>
            </fieldset>
        `;
    }

    function updateActiveFiltersDisplay() {
        activeFiltersDisplay.innerHTML = '';
        let hasActiveFilters = false;

        filterKeys.forEach(group => {
            activeFilters[group].forEach(value => {
                hasActiveFilters = true;
                const tag = document.createElement('div');
                tag.className = 'active-filter-tag';
                tag.innerHTML = `${value} <button class="remove-filter-btn" data-group="${group}" data-value="${value}">&times;</button>`;
                activeFiltersDisplay.appendChild(tag);
            });
        });

        if (hasActiveFilters) {
            const clearButton = document.createElement('button');
            clearButton.className = 'clear-all-btn';
            clearButton.textContent = 'Clear All';
            clearButton.onclick = () => {
                filterKeys.forEach(group => activeFilters[group].clear());
                updateUI();
            };
            activeFiltersDisplay.appendChild(clearButton);
        }

        activeFiltersDisplay.querySelectorAll('.remove-filter-btn').forEach(button => {
            button.onclick = (e) => {
                const group = e.target.dataset.group;
                const value = e.target.dataset.value;
                activeFilters[group].delete(value);
                updateUI();
            };
        });
    }

    function displayResources(filteredList) {
        resourceList.innerHTML = '';
        if (filteredList.length === 0) {
            resourceList.innerHTML = `<p class="text-sky-300 col-span-full">No resources found matching your criteria.</p>`;
            return;
        }

        filteredList.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            resourceCard.innerHTML = `
                <div class="card-header">
                    <h3><a href="${resource.url}" target="_blank" rel="noopener noreferrer">${resource.title}</a></h3>
                    <span class="resource-type">${resource.format}</span>
                </div>
                <p>${resource.description}</p>
                <div class="tags">
                    ${[...resource.audience, ...resource.features].map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="citation-section">
                    <details>
                        <summary>References</summary>
                        <p>${resource.citation}</p>
                    </details>
                </div>
            `;
            resourceList.appendChild(resourceCard);
        });
    }
});