// Winners page functionality - COMPLETE VERSION

// Configuration
const CONFIG = {
    itemsPerPage: 20,
    maxVisiblePages: 5,
    apiDelay: 300 // Simulated API delay in ms
};

// State management
let state = {
    winners: [],
    filteredWinners: [],
    currentPage: 1,
    currentView: 'table',
    filters: {
        search: '',
        status: '',
        prize: '',
        sort: 'newest'
    }
};

// Generate 5,000+ sample winners
function generateSampleWinners(count = 5247) {
    const firstNames = [
        "Alex", "Jamie", "Taylor", "Morgan", "Casey", "Jordan", "Riley", "Quinn",
        "Avery", "Blake", "Cameron", "Dakota", "Drew", "Emerson", "Finley", "Harley",
        "Hayden", "Kai", "Peyton", "Rowan", "Sage", "Skyler", "London", "Paris",
        "Skye", "Phoenix", "River", "Ocean", "Forest", "Winter", "Summer", "Autumn"
    ];
    
    const lastNames = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
        "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
        "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
        "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
        "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell"
    ];
    
    const locations = [
        "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
        "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
        "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
        "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
        "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
        "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD"
    ];
    
    const prizeCategories = [
        {
            name: "iPhone 17 Pro Max",
            value: 1299,
            category: "iphone"
        },
        {
            name: "$500 Cash Prize",
            value: 500,
            category: "cash"
        },
        {
            name: "PlayStation 5 Pro",
            value: 599,
            category: "gaming"
        },
        {
            name: "MacBook Pro M3",
            value: 1599,
            category: "electronics"
        },
        {
            name: "AirPods Pro 2",
            value: 249,
            category: "electronics"
        },
        {
            name: "$1000 Amazon Gift Card",
            value: 1000,
            category: "cash"
        },
        {
            name: "Nintendo Switch OLED",
            value: 349,
            category: "gaming"
        },
        {
            name: "Samsung Smart TV 65\"",
            value: 799,
            category: "electronics"
        },
        {
            name: "$250 Steam Gift Card",
            value: 250,
            category: "cash"
        },
        {
            name: "Bose Headphones",
            value: 349,
            category: "electronics"
        }
    ];
    
    const statuses = ['verified', 'verified', 'verified', 'verified', 'pending', 'shipped'];
    
    const winners = [];
    const startDate = new Date(2023, 0, 1); // Start from Jan 1, 2023
    const endDate = new Date();
    
    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const prize = prizeCategories[Math.floor(Math.random() * prizeCategories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate random date between start and end
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        
        winners.push({
            id: i,
            name: `${firstName} ${lastName}`,
            initials: `${firstName[0]}${lastName[0]}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            prize: prize.name,
            value: prize.value,
            valueFormatted: `$${prize.value.toLocaleString()}`,
            category: prize.category,
            date: randomDate.toISOString().split('T')[0],
            dateFormatted: randomDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            time: randomDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            status: status,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
        });
    }
    
    return winners;
}

// Initialize winners page
function initWinnersPage() {
    // Load winners data
    loadWinnersData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI
    updateUI();
}

// Load winners data
function loadWinnersData() {
    // Show loading state
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        // Generate sample data
        state.winners = generateSampleWinners(5247);
        
        // Apply initial filters
        applyFilters();
        
        // Update UI
        updateUI();
        
        // Hide loading
        hideLoading();
    }, CONFIG.apiDelay);
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            state.filters.search = e.target.value.toLowerCase();
            applyFilters();
            updateUI();
        }, 300));
    }
    
    // Filter selects
    const filters = ['statusFilter', 'prizeFilter', 'sortFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', (e) => {
                state.filters[filterId.replace('Filter', '')] = e.target.value;
                applyFilters();
                updateUI();
            });
        }
    });
    
    // View toggle
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    
    if (tableViewBtn) {
        tableViewBtn.addEventListener('click', () => {
            state.currentView = 'table';
            updateViewToggle();
            updateUI();
        });
    }
    
    if (cardViewBtn) {
        cardViewBtn.addEventListener('click', () => {
            state.currentView = 'card';
            updateViewToggle();
            updateUI();
        });
    }
    
    // Pagination
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                updateUI();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(state.filteredWinners.length / CONFIG.itemsPerPage);
            if (state.currentPage < totalPages) {
                state.currentPage++;
                updateUI();
            }
        });
    }
    
    // Items per page
    const itemsPerPageSelect = document.getElementById('tableItemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            CONFIG.itemsPerPage = parseInt(e.target.value);
            state.currentPage = 1;
            updateUI();
        });
    }
    
    // Reset filters
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Close modal
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
}

// Apply filters to winners
function applyFilters() {
    let filtered = [...state.winners];
    
    // Apply search filter
    if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(winner => 
            winner.name.toLowerCase().includes(searchTerm) ||
            winner.prize.toLowerCase().includes(searchTerm) ||
            winner.location.toLowerCase().includes(searchTerm) ||
            winner.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (state.filters.status) {
        filtered = filtered.filter(winner => winner.status === state.filters.status);
    }
    
    // Apply prize filter
    if (state.filters.prize) {
        filtered = filtered.filter(winner => winner.category === state.filters.prize);
    }
    
    // Apply sorting
    switch (state.filters.sort) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'value_high':
            filtered.sort((a, b) => b.value - a.value);
            break;
        case 'value_low':
            filtered.sort((a, b) => a.value - b.value);
            break;
    }
    
    state.filteredWinners = filtered;
    state.currentPage = 1; // Reset to first page on filter change
}

// Update the entire UI
function updateUI() {
    updateViewToggle();
    updateCounters();
    updatePagination();
    
    if (state.currentView === 'table') {
        updateTableView();
    } else {
        updateCardView();
    }
    
    updateEmptyState();
}

// Update view toggle buttons
function updateViewToggle() {
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    
    if (tableViewBtn && cardViewBtn) {
        if (state.currentView === 'table') {
            tableViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
            if (tableView) tableView.style.display = 'block';
            if (cardView) cardView.style.display = 'none';
        } else {
            tableViewBtn.classList.remove('active');
            cardViewBtn.classList.add('active');
            if (tableView) tableView.style.display = 'none';
            if (cardView) cardView.style.display = 'grid';
        }
    }
}

// Update counters and statistics
function updateCounters() {
    const tableCount = document.getElementById('tableCount');
    const totalWinners = document.getElementById('totalWinners');
    const currentRange = document.getElementById('currentRange');
    
    if (tableCount) {
        const start = (state.currentPage - 1) * CONFIG.itemsPerPage + 1;
        const end = Math.min(state.currentPage * CONFIG.itemsPerPage, state.filteredWinners.length);
        tableCount.textContent = `Showing ${start}-${end} of ${state.filteredWinners.length} winners`;
    }
    
    if (totalWinners) {
        totalWinners.textContent = state.filteredWinners.length.toLocaleString();
    }
    
    if (currentRange) {
        const start = (state.currentPage - 1) * CONFIG.itemsPerPage + 1;
        const end = Math.min(state.currentPage * CONFIG.itemsPerPage, state.filteredWinners.length);
        currentRange.textContent = `${start}-${end}`;
    }
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(state.filteredWinners.length / CONFIG.itemsPerPage);
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    
    // Update previous/next buttons
    if (prevPageBtn) {
        prevPageBtn.disabled = state.currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = state.currentPage === totalPages;
    }
    
    // Update page numbers
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        let startPage = Math.max(1, state.currentPage - Math.floor(CONFIG.maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + CONFIG.maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < CONFIG.maxVisiblePages) {
            startPage = Math.max(1, endPage - CONFIG.maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('div');
            pageBtn.className = `page-number ${i === state.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                state.currentPage = i;
                updateUI();
            });
            pageNumbers.appendChild(pageBtn);
        }
    }
}

// Update table view
function updateTableView() {
    const tableBody = document.getElementById('winnersTableBody');
    if (!tableBody) return;
    
    // Calculate pagination
    const startIndex = (state.currentPage - 1) * CONFIG.itemsPerPage;
    const endIndex = startIndex + CONFIG.itemsPerPage;
    const currentWinners = state.filteredWinners.slice(startIndex, endIndex);
    
    if (currentWinners.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #e9ecef; margin-bottom: 1rem;"></i>
                    <p>No winners found matching your criteria</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = currentWinners.map(winner => `
        <tr>
            <td>
                <div class="winner-info">
                    <div class="winner-avatar">${winner.initials}</div>
                    <div class="winner-details">
                        <h4>${winner.name}</h4>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i> ${winner.location}
                        </div>
                    </div>
                </div>
            </td>
            <td class="prize-cell">${winner.prize}</td>
            <td class="value-cell">$${winner.value.toLocaleString()}</td>
            <td class="date-cell">
                ${winner.dateFormatted}<br>
                <small>${winner.time}</small>
            </td>
            <td>
                <span class="status-badge status-${winner.status}">
                    <i class="fas fa-${getStatusIcon(winner.status)}"></i>
                    ${winner.status.charAt(0).toUpperCase() + winner.status.slice(1)}
                </span>
            </td>
            <td>
                <button class="view-details-btn" onclick="showWinnerDetails(${winner.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// Update card view
function updateCardView() {
    const cardView = document.getElementById('cardView');
    if (!cardView) return;
    
    // Calculate pagination
    const startIndex = (state.currentPage - 1) * CONFIG.itemsPerPage;
    const endIndex = startIndex + CONFIG.itemsPerPage;
    const currentWinners = state.filteredWinners.slice(startIndex, endIndex);
    
    if (currentWinners.length === 0) {
        cardView.innerHTML = '';
        return;
    }
    
    cardView.innerHTML = currentWinners.map(winner => `
        <div class="winner-card">
            <div class="card-header">
                <div class="card-avatar">${winner.initials}</div>
                <h3 class="card-winner-name">${winner.name}</h3>
                <div class="card-winner-location">
                    <i class="fas fa-map-marker-alt"></i> ${winner.location}
                </div>
            </div>
            
            <div class="card-content">
                <div class="prize-highlight">
                    <h3>${winner.prize}</h3>
                    <div class="prize-value">$${winner.value.toLocaleString()}</div>
                </div>
                
                <div class="card-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Won: ${winner.dateFormatted}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Time: ${winner.time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-${getStatusIcon(winner.status)}"></i>
                        <span>Status: ${winner.status.charAt(0).toUpperCase() + winner.status.slice(1)}</span>
                    </div>
                </div>
            </div>
            
            <div class="card-footer">
                <span class="status-badge status-${winner.status}">
                    <i class="fas fa-${getStatusIcon(winner.status)}"></i>
                    ${winner.status.charAt(0).toUpperCase() + winner.status.slice(1)}
                </span>
                <button class="view-details-btn" onclick="showWinnerDetails(${winner.id})">
                    <i class="fas fa-eye"></i> Details
                </button>
            </div>
        </div>
    `).join('');
}

// Update empty state visibility
function updateEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = state.filteredWinners.length === 0 ? 'block' : 'none';
    }
}

// Show winner details modal
function showWinnerDetails(winnerId) {
    const winner = state.winners.find(w => w.id === winnerId);
    if (!winner) return;
    
    const modal = document.getElementById('winnerModal');
    const modalContent = document.getElementById('winnerModalContent');
    
    if (!modal || !modalContent) return;
    
    const statusConfig = {
        verified: { color: '#10B981', icon: 'check-circle' },
        pending: { color: '#F59E0B', icon: 'clock' },
        shipped: { color: '#3B82F6', icon: 'shipping-fast' }
    };
    
    const status = statusConfig[winner.status] || statusConfig.verified;
    
    modalContent.innerHTML = `
        <div class="modal-body" style="padding: 2rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #8B5CF6, #667eea); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 1rem;">
                    ${winner.initials}
                </div>
                <h2 style="margin: 0 0 0.5rem 0;">${winner.name}</h2>
                <p style="color: #666; margin: 0;">
                    <i class="fas fa-map-marker-alt"></i> ${winner.location}
                </p>
            </div>
            
            <div style="background: ${status.color}15; border-left: 4px solid ${status.color}; padding: 1rem; border-radius: 0 8px 8px 0; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; gap: 0.8rem; color: ${status.color};">
                    <i class="fas fa-${status.icon}" style="font-size: 1.2rem;"></i>
                    <div>
                        <h3 style="margin: 0; font-size: 1.1rem;">${winner.status.charAt(0).toUpperCase() + winner.status.slice(1)}</h3>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem; opacity: 0.9;">
                            ${getStatusDescription(winner.status)}
                        </p>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 0.5rem 0; font-size: 0.9rem;">Prize Won</p>
                    <h3 style="margin: 0; color: #333;">${winner.prize}</h3>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 0.5rem 0; font-size: 0.9rem;">Value</p>
                    <h3 style="margin: 0; color: #10B981;">$${winner.value.toLocaleString()}</h3>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 0.5rem 0; font-size: 0.9rem;">Date Won</p>
                    <h3 style="margin: 0; color: #333;">${winner.dateFormatted}</h3>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 0.5rem 0; font-size: 0.9rem;">Time</p>
                    <h3 style="margin: 0; color: #333;">${winner.time}</h3>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">
                    <i class="fas fa-info-circle"></i> Additional Information
                </h3>
                <div style="display: grid; gap: 0.8rem;">
                    <div style="display: flex; align-items: center; gap: 0.8rem;">
                        <i class="fas fa-envelope" style="color: #8B5CF6;"></i>
                        <span>${winner.email}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.8rem;">
                        <i class="fas fa-gift" style="color: #8B5CF6;"></i>
                        <span>Category: ${winner.category.charAt(0).toUpperCase() + winner.category.slice(1)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.8rem;">
                        <i class="fas fa-tag" style="color: #8B5CF6;"></i>
                        <span>Winner ID: TC-${winner.id.toString().padStart(6, '0')}</span>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="closeModal()" style="padding: 0.8rem 2rem; background: #8B5CF6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-check"></i> Close
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'verified': return 'check-circle';
        case 'pending': return 'clock';
        case 'shipped': return 'shipping-fast';
        default: return 'check-circle';
    }
}

// Get status description
function getStatusDescription(status) {
    switch (status) {
        case 'verified': return 'Account verified and prize ready for shipping';
        case 'pending': return 'Waiting for verification and shipping confirmation';
        case 'shipped': return 'Prize has been shipped to the winner';
        default: return 'Status information';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('winnerModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Reset all filters
function resetFilters() {
    // Reset filter values
    state.filters = {
        search: '',
        status: '',
        prize: '',
        sort: 'newest'
    };
    
    // Reset UI elements
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const prizeFilter = document.getElementById('prizeFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (prizeFilter) prizeFilter.value = '';
    if (sortFilter) sortFilter.value = 'newest';
    
    // Apply filters and update UI
    applyFilters();
    updateUI();
}

// Show loading state
function showLoading() {
    const tableBody = document.getElementById('winnersTableBody');
    const cardView = document.getElementById('cardView');
    
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                        <div class="loading-spinner"></div>
                        <p>Loading winners...</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    if (cardView) {
        cardView.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                    <div class="loading-spinner"></div>
                    <p>Loading winners...</p>
                </div>
            </div>
        `;
    }
    
    // Add loading spinner styles
    const styles = `
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #8B5CF6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Hide loading state
function hideLoading() {
    // Loading state is automatically replaced when content loads
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add button styles
function addButtonStyles() {
    const styles = `
        .view-details-btn {
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            color: #333;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .view-details-btn:hover {
            background: #8B5CF6;
            color: white;
            border-color: #8B5CF6;
        }
        
        .btn-view-all {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #8B5CF6;
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-view-all:hover {
            background: #7c3aed;
            transform: translateY(-2px);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addButtonStyles();
    initWinnersPage();
});

// Make functions available globally
window.showWinnerDetails = showWinnerDetails;
window.closeModal = closeModal;
window.resetFilters = resetFilters;
