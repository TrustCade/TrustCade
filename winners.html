// winners.js - TrustCade Winners Page JavaScript
// Complete functionality for filtering, searching, and displaying winners

// ========== CONFIGURATION ==========
const CONFIG = {
    ITEMS_PER_PAGE: 20,
    API_DELAY: 300, // Simulated API delay in ms
    MAX_WINNERS: 5247,
    AUTO_REFRESH_INTERVAL: 60000 // 1 minute
};

// ========== DATA GENERATION ==========
const winnersData = generateWinnersData(100); // Generate 100 sample winners

function generateWinnersData(count) {
    const firstNames = [
        "Alex", "Jamie", "Taylor", "Morgan", "Casey", "Jordan", "Riley", "Quinn",
        "Avery", "Blake", "Charlie", "Dakota", "Emerson", "Finley", "Harley",
        "Justice", "Kai", "London", "Marley", "Noah", "Ocean", "Phoenix", "River",
        "Rowan", "Sage", "Skyler", "Storm", "Sunny", "Terry", "Winter"
    ];
    
    const lastNames = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
        "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
        "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
    ];
    
    const locations = [
        { city: "New York", state: "NY", country: "US", flag: "🇺🇸" },
        { city: "Los Angeles", state: "CA", country: "US", flag: "🇺🇸" },
        { city: "Chicago", state: "IL", country: "US", flag: "🇺🇸" },
        { city: "Miami", state: "FL", country: "US", flag: "🇺🇸" },
        { city: "London", state: "", country: "UK", flag: "🇬🇧" },
        { city: "Toronto", state: "ON", country: "CA", flag: "🇨🇦" },
        { city: "Sydney", state: "NSW", country: "AU", flag: "🇦🇺" },
        { city: "Berlin", state: "", country: "DE", flag: "🇩🇪" },
        { city: "Paris", state: "", country: "FR", flag: "🇫🇷" },
        { city: "Tokyo", state: "", country: "JP", flag: "🇯🇵" }
    ];
    
    const prizes = [
        { name: "iPhone 17 Pro", value: 1299, category: "iphone" },
        { name: "MacBook Pro M3", value: 1599, category: "electronics" },
        { name: "PlayStation 5 Pro", value: 499, category: "gaming" },
        { name: "Nintendo Switch OLED", value: 349, category: "gaming" },
        { name: "$1000 Cash", value: 1000, category: "cash" },
        { name: "$500 Amazon Gift Card", value: 500, category: "cash" },
        { name: "AirPods Pro 2", value: 249, category: "electronics" },
        { name: "Apple Watch Ultra", value: 799, category: "electronics" },
        { name: "Samsung Galaxy S24", value: 899, category: "electronics" },
        { name: "Gaming PC RTX 4090", value: 2499, category: "gaming" },
        { name: "Smart TV 65\"", value: 699, category: "electronics" },
        { name: "Drone Pro", value: 899, category: "electronics" },
        { name: "$250 Steam Gift Card", value: 250, category: "cash" },
        { name: "iPad Pro 12.9\"", value: 1099, category: "electronics" },
        { name: "VR Headset", value: 399, category: "gaming" }
    ];
    
    const statuses = [
        { type: "verified", label: "Verified", color: "success", icon: "fa-check-circle" },
        { type: "pending", label: "Pending", color: "warning", icon: "fa-clock" },
        { type: "shipped", label: "Shipped", color: "info", icon: "fa-truck" }
    ];
    
    const winners = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate a random date within the last 90 days
        const daysAgo = Math.floor(Math.random() * 90);
        const winDate = new Date(now);
        winDate.setDate(winDate.getDate() - daysAgo);
        
        // Create winner ID
        const winnerId = `WIN${String(1000 + i).padStart(4, '0')}`;
        
        winners.push({
            id: winnerId,
            index: i + 1,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            username: `${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
            initials: `${firstName[0]}${lastName[0]}`,
            location: `${location.city}${location.state ? ', ' + location.state : ''}`,
            country: location.country,
            flag: location.flag,
            prize: prize.name,
            prizeCategory: prize.category,
            value: prize.value,
            formattedValue: `$${prize.value.toLocaleString()}`,
            date: winDate,
            formattedDate: winDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            timeAgo: getTimeAgo(winDate),
            status: status.type,
            statusLabel: status.label,
            statusIcon: status.icon,
            statusColor: status.color,
            deliveryProof: Math.random() > 0.3 ? `delivery_${winnerId}.jpg` : null,
            claimCode: `TC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            verified: status.type === 'verified',
            avatarColor: getRandomColor()
        });
    }
    
    // Sort by date (newest first)
    return winners.sort((a, b) => b.date - a.date);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
}

function getRandomColor() {
    const colors = [
        '#8B5CF6', '#10B981', '#3B82F6', '#EF4444', '#F59E0B',
        '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ========== STATE MANAGEMENT ==========
let state = {
    currentView: 'table',
    currentPage: 1,
    itemsPerPage: CONFIG.ITEMS_PER_PAGE,
    searchQuery: '',
    statusFilter: '',
    prizeFilter: '',
    sortBy: 'newest',
    filteredWinners: [...winnersData],
    isLoading: false
};

// ========== DOM ELEMENTS ==========
const elements = {
    // View toggles
    tableViewBtn: document.getElementById('tableViewBtn'),
    cardViewBtn: document.getElementById('cardViewBtn'),
    tableView: document.getElementById('tableView'),
    cardView: document.getElementById('cardView'),
    
    // Filters
    searchInput: document.getElementById('searchInput'),
    statusFilter: document.getElementById('statusFilter'),
    prizeFilter: document.getElementById('prizeFilter'),
    sortFilter: document.getElementById('sortFilter'),
    
    // Content containers
    winnersTableBody: document.getElementById('winnersTableBody'),
    cardViewContainer: document.getElementById('cardView'),
    emptyState: document.getElementById('emptyState'),
    
    // Pagination
    prevPageBtn: document.getElementById('prevPage'),
    nextPageBtn: document.getElementById('nextPage'),
    pageNumbers: document.getElementById('pageNumbers'),
    currentRange: document.getElementById('currentRange'),
    totalWinners: document.getElementById('totalWinners'),
    tableCount: document.getElementById('tableCount'),
    itemsPerPageSelect: document.getElementById('tableItemsPerPage'),
    
    // Reset button
    resetFiltersBtn: document.getElementById('resetFilters'),
    
    // Modal
    winnerModal: document.getElementById('winnerModal'),
    closeModalBtn: document.getElementById('closeModal'),
    winnerModalContent: document.getElementById('winnerModalContent')
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    applyFilters();
    updateStats();
    
    // Auto-refresh data every minute
    setInterval(() => {
        if (!state.isLoading) {
            updateStats();
        }
    }, CONFIG.AUTO_REFRESH_INTERVAL);
});

function initializeElements() {
    // Set initial items per page
    if (elements.itemsPerPageSelect) {
        elements.itemsPerPageSelect.value = state.itemsPerPage;
    }
}

// ========== EVENT HANDLERS ==========
function setupEventListeners() {
    // View toggle
    if (elements.tableViewBtn) {
        elements.tableViewBtn.addEventListener('click', () => switchView('table'));
    }
    
    if (elements.cardViewBtn) {
        elements.cardViewBtn.addEventListener('click', () => switchView('card'));
    }
    
    // Search
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filters
    if (elements.statusFilter) {
        elements.statusFilter.addEventListener('change', handleFilterChange);
    }
    
    if (elements.prizeFilter) {
        elements.prizeFilter.addEventListener('change', handleFilterChange);
    }
    
    if (elements.sortFilter) {
        elements.sortFilter.addEventListener('change', handleSortChange);
    }
    
    // Pagination
    if (elements.prevPageBtn) {
        elements.prevPageBtn.addEventListener('click', goToPrevPage);
    }
    
    if (elements.nextPageBtn) {
        elements.nextPageBtn.addEventListener('click', goToNextPage);
    }
    
    if (elements.itemsPerPageSelect) {
        elements.itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
    }
    
    // Reset filters
    if (elements.resetFiltersBtn) {
        elements.resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    
    // Modal
    if (elements.closeModalBtn) {
        elements.closeModalBtn.addEventListener('click', closeWinnerModal);
    }
    
    // Close modal on outside click
    if (elements.winnerModal) {
        elements.winnerModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeWinnerModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.winnerModal.classList.contains('show')) {
            closeWinnerModal();
        }
    });
}

// ========== VIEW MANAGEMENT ==========
function switchView(viewType) {
    if (state.currentView === viewType) return;
    
    state.currentView = viewType;
    
    // Update active button
    if (elements.tableViewBtn && elements.cardViewBtn) {
        elements.tableViewBtn.classList.toggle('active', viewType === 'table');
        elements.cardViewBtn.classList.toggle('active', viewType === 'card');
    }
    
    // Show/hide views
    if (elements.tableView) {
        elements.tableView.style.display = viewType === 'table' ? 'block' : 'none';
    }
    
    if (elements.cardViewContainer) {
        elements.cardViewContainer.style.display = viewType === 'card' ? 'flex' : 'none';
    }
    
    // Render the current view
    renderCurrentView();
}

// ========== FILTERING & SORTING ==========
function handleSearch() {
    if (!elements.searchInput) return;
    state.searchQuery = elements.searchInput.value.toLowerCase().trim();
    state.currentPage = 1;
    applyFilters();
}

function handleFilterChange() {
    if (elements.statusFilter) {
        state.statusFilter = elements.statusFilter.value;
    }
    
    if (elements.prizeFilter) {
        state.prizeFilter = elements.prizeFilter.value;
    }
    
    state.currentPage = 1;
    applyFilters();
}

function handleSortChange() {
    if (!elements.sortFilter) return;
    state.sortBy = elements.sortFilter.value;
    applyFilters();
}

function handleItemsPerPageChange() {
    if (!elements.itemsPerPageSelect) return;
    state.itemsPerPage = parseInt(elements.itemsPerPageSelect.value);
    state.currentPage = 1;
    applyFilters();
}

function applyFilters() {
    state.isLoading = true;
    
    // Simulate API delay
    setTimeout(() => {
        let filtered = [...winnersData];
        
        // Apply search filter
        if (state.searchQuery) {
            filtered = filtered.filter(winner =>
                winner.fullName.toLowerCase().includes(state.searchQuery) ||
                winner.username.toLowerCase().includes(state.searchQuery) ||
                winner.location.toLowerCase().includes(state.searchQuery) ||
                winner.prize.toLowerCase().includes(state.searchQuery)
            );
        }
        
        // Apply status filter
        if (state.statusFilter) {
            filtered = filtered.filter(winner => winner.status === state.statusFilter);
        }
        
        // Apply prize category filter
        if (state.prizeFilter) {
            filtered = filtered.filter(winner => winner.prizeCategory === state.prizeFilter);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (state.sortBy) {
                case 'oldest':
                    return a.date - b.date;
                case 'value_high':
                    return b.value - a.value;
                case 'value_low':
                    return a.value - b.value;
                case 'newest':
                default:
                    return b.date - a.date;
            }
        });
        
        state.filteredWinners = filtered;
        state.isLoading = false;
        
        updateUI();
    }, CONFIG.API_DELAY);
}

function resetAllFilters() {
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.statusFilter) elements.statusFilter.value = '';
    if (elements.prizeFilter) elements.prizeFilter.value = '';
    if (elements.sortFilter) elements.sortFilter.value = 'newest';
    
    state.searchQuery = '';
    state.statusFilter = '';
    state.prizeFilter = '';
    state.sortBy = 'newest';
    state.currentPage = 1;
    state.itemsPerPage = CONFIG.ITEMS_PER_PAGE;
    
    if (elements.itemsPerPageSelect) {
        elements.itemsPerPageSelect.value = state.itemsPerPage;
    }
    
    applyFilters();
}

// ========== PAGINATION ==========
function goToPrevPage() {
    if (state.currentPage > 1) {
        state.currentPage--;
        updateUI();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(state.filteredWinners.length / state.itemsPerPage);
    if (state.currentPage < totalPages) {
        state.currentPage++;
        updateUI();
    }
}

function goToPage(pageNumber) {
    const totalPages = Math.ceil(state.filteredWinners.length / state.itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        state.currentPage = pageNumber;
        updateUI();
    }
}

// ========== RENDERING ==========
function renderCurrentView() {
    switch (state.currentView) {
        case 'table':
            renderTableView();
            break;
        case 'card':
            renderCardView();
            break;
    }
}

function renderTableView() {
    if (!elements.winnersTableBody) return;
    
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const currentWinners = state.filteredWinners.slice(startIndex, endIndex);
    
    if (currentWinners.length === 0) {
        elements.winnersTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                    No winners found matching your criteria
                </td>
            </tr>
        `;
        return;
    }
    
    elements.winnersTableBody.innerHTML = currentWinners.map(winner => `
        <tr data-winner-id="${winner.id}">
            <td>
                <div class="winner-info">
                    <div class="winner-avatar" style="background: ${winner.avatarColor}">
                        ${winner.initials}
                    </div>
                    <div class="winner-details">
                        <h4>${winner.fullName}</h4>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${winner.location} ${winner.flag}
                        </div>
                        <small style="color: #999; font-size: 0.8rem;">@${winner.username}</small>
                    </div>
                </div>
            </td>
            <td class="prize-cell">
                ${winner.prize}
            </td>
            <td class="value-cell">
                ${winner.formattedValue}
            </td>
            <td class="date-cell">
                <div>${winner.formattedDate}</div>
                <small style="color: #999;">${winner.timeAgo}</small>
            </td>
            <td>
                <span class="status-badge status-${winner.status}">
                    <i class="fas ${winner.statusIcon}"></i> ${winner.statusLabel}
                </span>
            </td>
            <td>
                <button class="view-details-btn" onclick="viewWinnerDetails('${winner.id}')">
                    <i class="fas fa-eye"></i> Details
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add click handlers for table rows
    document.querySelectorAll('#winnersTableBody tr[data-winner-id]').forEach(row => {
        row.addEventListener('click', function(e) {
            if (!e.target.classList.contains('view-details-btn')) {
                const winnerId = this.getAttribute('data-winner-id');
                viewWinnerDetails(winnerId);
            }
        });
    });
}

function renderCardView() {
    if (!elements.cardViewContainer) return;
    
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const currentWinners = state.filteredWinners.slice(startIndex, endIndex);
    
    if (currentWinners.length === 0) {
        elements.cardViewContainer.innerHTML = '';
        return;
    }
    
    elements.cardViewContainer.innerHTML = currentWinners.map(winner => `
        <div class="winner-card" data-winner-id="${winner.id}">
            <div class="card-header">
                <div class="card-avatar" style="background: ${winner.avatarColor}">
                    ${winner.initials}
                </div>
                <h3 class="card-winner-name">${winner.fullName}</h3>
                <div class="card-winner-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${winner.location} ${winner.flag}
                </div>
            </div>
            
            <div class="card-content">
                <div class="prize-highlight">
                    <h3>${winner.prize}</h3>
                    <div class="prize-value">${winner.formattedValue}</div>
                </div>
                
                <div class="card-details">
                    <div class="detail-item">
                        <i class="fas fa-trophy"></i>
                        <span>Won ${winner.timeAgo}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user-tag"></i>
                        <span>@${winner.username}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-hashtag"></i>
                        <span>ID: ${winner.id}</span>
                    </div>
                </div>
            </div>
            
            <div class="card-footer">
                <span class="status-badge status-${winner.status}">
                    <i class="fas ${winner.statusIcon}"></i> ${winner.statusLabel}
                </span>
                <button class="view-details-btn" onclick="viewWinnerDetails('${winner.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for cards
    document.querySelectorAll('.winner-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('view-details-btn')) {
                const winnerId = this.getAttribute('data-winner-id');
                viewWinnerDetails(winnerId);
            }
        });
    });
}

// ========== WINNER DETAILS MODAL ==========
function viewWinnerDetails(winnerId) {
    const winner = state.filteredWinners.find(w => w.id === winnerId);
    if (!winner) return;
    
    if (!elements.winnerModalContent) return;
    
    const statusColors = {
        verified: '#10B981',
        pending: '#F59E0B',
        shipped: '#3B82F6'
    };
    
    const statusIcons = {
        verified: 'fa-check-circle',
        pending: 'fa-clock',
        shipped: 'fa-truck'
    };
    
    elements.winnerModalContent.innerHTML = `
        <div class="winner-modal-content" style="padding: 2rem;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="
                    width: 100px;
                    height: 100px;
                    background: ${winner.avatarColor};
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 2rem;
                    margin: 0 auto 1rem;
                    border: 4px solid white;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                ">
                    ${winner.initials}
                </div>
                <h2 style="margin: 0 0 0.5rem 0; color: #333;">${winner.fullName}</h2>
                <div style="color: #666; margin-bottom: 0.5rem;">
                    <i class="fas fa-map-marker-alt"></i> ${winner.location} ${winner.flag}
                </div>
                <div style="color: #999; font-size: 0.9rem;">@${winner.username}</div>
            </div>
            
            <!-- Status Banner -->
            <div style="
                background: ${statusColors[winner.status]}15;
                border: 1px solid ${statusColors[winner.status]}30;
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.8rem;
            ">
                <i class="fas ${statusIcons[winner.status]}" style="color: ${statusColors[winner.status]}; font-size: 1.2rem;"></i>
                <span style="font-weight: 600; color: ${statusColors[winner.status]};">${winner.statusLabel.toUpperCase()}</span>
                <span style="color: #666;">• Winner ID: ${winner.id}</span>
            </div>
            
            <!-- Prize Details -->
            <div style="
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 15px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                text-align: center;
            ">
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">PRIZE WON</div>
                <h3 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem;">${winner.prize}</h3>
                <div style="font-size: 2.5rem; font-weight: 700; color: #10B981; margin: 0.5rem 0;">${winner.formattedValue}</div>
                <div style="color: #666; font-size: 0.9rem;">Value</div>
            </div>
            
            <!-- Details Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                <div style="
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    padding: 1rem;
                    text-align: center;
                ">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">DATE WON</div>
                    <div style="font-weight: 600; color: #333;">${winner.formattedDate}</div>
                    <div style="font-size: 0.9rem; color: #999;">${winner.timeAgo}</div>
                </div>
                
                <div style="
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    padding: 1rem;
                    text-align: center;
                ">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">CLAIM CODE</div>
                    <div style="font-weight: 600; color: #333; font-family: monospace;">${winner.claimCode}</div>
                    <div style="font-size: 0.9rem; color: #999;">For verification</div>
                </div>
                
                <div style="
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    padding: 1rem;
                    text-align: center;
                    grid-column: span 2;
                ">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">PRIZE CATEGORY</div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-${winner.prizeCategory === 'cash' ? 'money-bill-wave' : winner.prizeCategory === 'gaming' ? 'gamepad' : 'mobile-alt'}"></i>
                        <span style="font-weight: 600; color: #333; text-transform: capitalize;">${winner.prizeCategory}</span>
                    </div>
                </div>
            </div>
            
            <!-- Verification Info -->
            <div style="
                background: rgba(16, 185, 129, 0.05);
                border: 1px solid rgba(16, 185, 129, 0.2);
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 2rem;
            ">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <i class="fas fa-shield-alt" style="color: #10B981;"></i>
                    <span style="font-weight: 600; color: #333;">Verification Status</span>
                </div>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    ${winner.verified ? 
                        'This winner has been verified with ID proof and delivery confirmation.' :
                        'Verification is in progress. This winner will be verified within 48 hours.'
                    }
                </p>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem;">
                <button onclick="shareWinner('${winner.id}')" style="
                    flex: 1;
                    padding: 1rem;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                ">
                    <i class="fas fa-share-alt"></i> Share
                </button>
                <button onclick="reportWinner('${winner.id}')" style="
                    flex: 1;
                    padding: 1rem;
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                ">
                    <i class="fas fa-flag"></i> Report
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    if (elements.winnerModal) {
        elements.winnerModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeWinnerModal() {
    if (elements.winnerModal) {
        elements.winnerModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ========== SHARE & REPORT FUNCTIONS ==========
function shareWinner(winnerId) {
    const winner = state.filteredWinners.find(w => w.id === winnerId);
    if (!winner) return;
    
    const shareText = `🎉 ${winner.fullName} just won ${winner.prize} (${winner.formattedValue}) on TrustCade! #TrustCadeWinners`;
    const shareUrl = `https://trustcade.com/winners/${winnerId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'TrustCade Winner',
            text: shareText,
            url: shareUrl
        }).catch(console.error);
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

function reportWinner(winnerId) {
    if (confirm('Are you sure you want to report this winner? This action is for suspicious or fake winners only.')) {
        // In a real app, this would be an API call
        console.log(`Reported winner: ${winnerId}`);
        alert('Thank you for your report. Our team will review it within 24 hours.');
        closeWinnerModal();
    }
}

// ========== UI UPDATES ==========
function updateUI() {
    const totalWinners = state.filteredWinners.length;
    const totalPages = Math.ceil(totalWinners / state.itemsPerPage);
    
    // Update pagination buttons
    if (elements.prevPageBtn) {
        elements.prevPageBtn.disabled = state.currentPage <= 1;
    }
    
    if (elements.nextPageBtn) {
        elements.nextPageBtn.disabled = state.currentPage >= totalPages;
    }
    
    // Update page numbers
    if (elements.pageNumbers) {
        renderPageNumbers(totalPages);
    }
    
    // Update range display
    if (elements.currentRange) {
        const start = (state.currentPage - 1) * state.itemsPerPage + 1;
        const end = Math.min(state.currentPage * state.itemsPerPage, totalWinners);
        elements.currentRange.textContent = `${start}-${end}`;
    }
    
    // Update total winners count
    if (elements.totalWinners) {
        elements.totalWinners.textContent = totalWinners.toLocaleString();
    }
    
    // Update table count
    if (elements.tableCount) {
        elements.tableCount.textContent = `Showing ${totalWinners.toLocaleString()} winners`;
    }
    
    // Show/hide empty state
    if (elements.emptyState) {
        if (totalWinners === 0) {
            elements.emptyState.style.display = 'block';
            if (elements.tableView) elements.tableView.style.display = 'none';
            if (elements.cardViewContainer) elements.cardViewContainer.style.display = 'none';
        } else {
            elements.emptyState.style.display = 'none';
            renderCurrentView();
        }
    }
}

function renderPageNumbers(totalPages) {
    if (!elements.pageNumbers) return;
    
    let pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
        // Show all pages
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        // Show limited pages with ellipsis
        if (state.currentPage <= 3) {
            pageNumbers = [1, 2, 3, 4, '...', totalPages];
        } else if (state.currentPage >= totalPages - 2) {
            pageNumbers = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pageNumbers = [1, '...', state.currentPage - 1, state.currentPage, state.currentPage + 1, '...', totalPages];
        }
    }
    
    elements.pageNumbers.innerHTML = pageNumbers.map(page => {
        if (page === '...') {
            return `<span class="page-number" style="pointer-events: none;">...</span>`;
        }
        return `
            <span class="page-number ${page === state.currentPage ? 'active' : ''}" 
                  onclick="goToPage(${page})">
                ${page}
            </span>
        `;
    }).join('');
}

// ========== STATISTICS ==========
function updateStats() {
    // Update hero stats with some randomness to make it look live
    const baseTotal = 5247;
    const baseValue = 892450;
    
    // Add some randomness (±10 winners, ±$5000 value)
    const currentTotal = baseTotal + Math.floor(Math.random() * 20) - 10;
    const currentValue = baseValue + Math.floor(Math.random() * 10000) - 5000;
    
    // Update hero stats if elements exist
    const heroStats = document.querySelectorAll('.hero-stat h3');
    if (heroStats.length >= 2) {
        heroStats[0].textContent = currentTotal.toLocaleString();
        heroStats[1].textContent = `$${(currentValue / 1000).toFixed(0)}K`;
    }
}

// ========== UTILITY FUNCTIONS ==========
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

// ========== GLOBAL EXPORTS ==========
// Make functions available globally
window.switchView = switchView;
window.viewWinnerDetails = viewWinnerDetails;
window.closeWinnerModal = closeWinnerModal;
window.goToPage = goToPage;
window.shareWinner = shareWinner;
window.reportWinner = reportWinner;
window.resetAllFilters = resetAllFilters;
