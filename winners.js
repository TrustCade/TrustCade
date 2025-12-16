// SIMPLIFIED WINNERS.JS - GUARANTEED TO WORK

// Generate sample winners data
function generateWinners() {
    const names = ["Alex Johnson", "Maria Garcia", "David Chen", "Sarah Williams", "Mike Thompson", "Emma Wilson", "James Brown"];
    const prizes = ["iPhone 15 Pro", "$500 Cash", "PlayStation 5", "MacBook Air", "AirPods Pro", "Smart TV", "Nintendo Switch"];
    
    const winners = [];
    for (let i = 1; i <= 50; i++) {
        winners.push({
            id: i,
            name: names[Math.floor(Math.random() * names.length)],
            initials: "AJ",
            location: "New York, NY",
            prize: prizes[Math.floor(Math.random() * prizes.length)],
            value: Math.floor(Math.random() * 2000) + 100,
            date: "2024-03-" + (Math.floor(Math.random() * 15) + 1),
            status: "verified"
        });
    }
    return winners;
}

// Display winners in table
function displayWinners() {
    const winners = generateWinners();
    const tableBody = document.getElementById('winnersTableBody');
    
    if (!tableBody) {
        console.error('Table body not found!');
        return;
    }
    
    let html = '';
    winners.forEach(winner => {
        html += `
            <tr>
                <td>
                    <div class="winner-info">
                        <div class="winner-avatar">${winner.name.split(' ').map(n => n[0]).join('')}</div>
                        <div class="winner-details">
                            <h4>${winner.name}</h4>
                            <div class="location">
                                <i class="fas fa-map-marker-alt"></i> ${winner.location}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="prize-cell">${winner.prize}</td>
                <td class="value-cell">$${winner.value}</td>
                <td class="date-cell">${winner.date}</td>
                <td>
                    <span class="status-badge status-verified">
                        <i class="fas fa-check-circle"></i> Verified
                    </span>
                </td>
                <td>
                    <button class="view-details-btn" onclick="alert('Viewing ${winner.name} details')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Update counters
    document.getElementById('tableCount').textContent = `Showing 1-50 of ${winners.length} winners`;
    document.getElementById('totalWinners').textContent = winners.length;
    document.getElementById('currentRange').textContent = `1-50`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Winners page loaded');
    
    // Display winners
    displayWinners();
    
    // Setup search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#winnersTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    // Setup view toggle
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    
    if (tableViewBtn && cardViewBtn) {
        tableViewBtn.addEventListener('click', function() {
            this.classList.add('active');
            cardViewBtn.classList.remove('active');
            if (tableView) tableView.style.display = 'block';
            if (cardView) cardView.style.display = 'none';
        });
        
        cardViewBtn.addEventListener('click', function() {
            this.classList.add('active');
            tableViewBtn.classList.remove('active');
            if (tableView) tableView.style.display = 'none';
            if (cardView) {
                cardView.style.display = 'grid';
                displayCardView();
            }
        });
    }
});

// Display card view
function displayCardView() {
    const cardView = document.getElementById('cardView');
    if (!cardView) return;
    
    const winners = generateWinners().slice(0, 12);
    
    let html = '';
    winners.forEach(winner => {
        html += `
            <div class="winner-card">
                <div class="card-header">
                    <div class="card-avatar">${winner.name.split(' ').map(n => n[0]).join('')}</div>
                    <h3 class="card-winner-name">${winner.name}</h3>
                    <div class="card-winner-location">
                        <i class="fas fa-map-marker-alt"></i> ${winner.location}
                    </div>
                </div>
                
                <div class="card-content">
                    <div class="prize-highlight">
                        <h3>${winner.prize}</h3>
                        <div class="prize-value">$${winner.value}</div>
                    </div>
                    
                    <div class="card-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>Won: ${winner.date}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Status: Verified</span>
                        </div>
                    </div>
                </div>
                
                <div class="card-footer">
                    <span class="status-badge status-verified">
                        <i class="fas fa-check-circle"></i> Verified
                    </span>
                    <button class="view-details-btn" onclick="alert('Viewing ${winner.name} details')">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `;
    });
    
    cardView.innerHTML = html;
}

// Make functions global
window.displayWinners = displayWinners;
window.displayCardView = displayCardView;
