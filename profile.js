// User wins data (in real app, this comes from database)
const userWins = [
    {
        id: 1,
        prize: "iPhone 15 Pro",
        value: "$999",
        date: "2024-03-15",
        status: "pending", // pending, verified, shipped, delivered
        claimCode: "TC-IP15-7A3B9",
        image: "https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=iPhone15",
        requiresVerification: true
    },
    {
        id: 2,
        prize: "$500 Cash Prize",
        value: "$500",
        date: "2024-03-10",
        status: "verified",
        claimCode: "TC-CASH-2X8Y4",
        image: "https://via.placeholder.com/200x200/10B981/FFFFFF?text=$500",
        requiresVerification: false
    },
    {
        id: 3,
        prize: "Wireless Headphones",
        value: "$199",
        date: "2024-03-05",
        status: "shipped",
        claimCode: "TC-AUDIO-5Z1Q9",
        image: "https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=Headphones",
        trackingNumber: "UPS-9348-2934-1234"
    }
];

// Status labels and colors
const statusConfig = {
    pending: { text: "Verification Pending", class: "status-pending", icon: "fas fa-clock" },
    verified: { text: "Verified - Ready to Ship", class: "status-verified", icon: "fas fa-check-circle" },
    shipped: { text: "Shipped", class: "status-shipped", icon: "fas fa-shipping-fast" },
    delivered: { text: "Delivered", class: "status-delivered", icon: "fas fa-box-open" }
};

// Display user's wins
function displayUserWins() {
    const winsGrid = document.getElementById('userWinsGrid');
    const noWinsMessage = document.getElementById('noWinsMessage');
    
    if (userWins.length === 0) {
        winsGrid.style.display = 'none';
        noWinsMessage.style.display = 'block';
        return;
    }
    
    winsGrid.innerHTML = userWins.map(win => `
        <div class="win-card">
            <div class="win-status ${statusConfig[win.status].class}">
                <i class="${statusConfig[win.status].icon}"></i> ${statusConfig[win.status].text}
            </div>
            
            <div class="win-image">
                <img src="${win.image}" alt="${win.prize}" style="width: 100px; height: 100px; border-radius: 10px;">
            </div>
            
            <h3>${win.prize}</h3>
            <p class="win-value"><strong>Value:</strong> ${win.value}</p>
            <p class="win-date"><i class="fas fa-calendar"></i> Won on: ${win.date}</p>
            <p class="win-code"><i class="fas fa-tag"></i> Claim Code: <code>${win.claimCode}</code></p>
            
            ${win.trackingNumber ? 
                `<p class="tracking"><i class="fas fa-truck"></i> Tracking: ${win.trackingNumber}</p>` 
                : ''}
            
            ${win.requiresVerification ? 
                `<button class="claim-btn" onclick="showVerificationRequired()">
                    <i class="fas fa-gift"></i> Complete Verification to Claim
                </button>` 
                : 
                `<button class="claim-btn" onclick="claimPrize(${win.id})">
                    <i class="fas fa-gift"></i> ${win.status === 'pending' ? 'Claim Prize' : 'View Details'}
                </button>`
            }
        </div>
    `).join('');
}

// Calculate user stats
function calculateUserStats() {
    const totalWins = userWins.length;
    const totalValue = userWins.reduce((sum, win) => {
        const value = parseInt(win.value.replace('$', '').replace(',', ''));
        return sum + (isNaN(value) ? 0 : value);
    }, 0);
    
    // Update UI
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString()}`;
    
    // Simulate user data
    const spinsUsed = 24; // This would come from database
    const winRate = ((totalWins / spinsUsed) * 100).toFixed(1);
    
    document.getElementById('spinsUsed').textContent = spinsUsed;
    document.getElementById('winRate').textContent = `${winRate}%`;
}

// Claim prize function
function claimPrize(winId) {
    const win = userWins.find(w => w.id === winId);
    
    if (!win) return;
    
    if (win.status === 'pending') {
        const address = prompt("Please enter your shipping address:");
        if (address) {
            alert(`Prize claimed! We'll ship your ${win.prize} to:\n${address}\n\nYou'll receive tracking info within 48 hours.`);
            // In real app, send to backend
            win.status = 'verified';
            displayUserWins();
        }
    } else {
        // Show prize details
        showPrizeDetails(win);
    }
}

// Show prize details modal
function showPrizeDetails(win) {
    const modalHtml = `
        <div class="prize-modal">
            <h3>${win.prize} Details</h3>
            <p><strong>Status:</strong> ${statusConfig[win.status].text}</p>
            <p><strong>Claim Code:</strong> ${win.claimCode}</p>
            ${win.trackingNumber ? `<p><strong>Tracking:</strong> ${win.trackingNumber}</p>` : ''}
            <p><strong>Date Won:</strong> ${win.date}</p>
            <p><strong>Estimated Delivery:</strong> ${getEstimatedDelivery(win.status)}</p>
            <button onclick="closeModal()">Close</button>
        </div>
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function getEstimatedDelivery(status) {
    const estimates = {
        pending: "After verification (2-3 days)",
        verified: "Within 5-7 business days",
        shipped: "3-5 business days",
        delivered: "Already delivered"
    };
    return estimates[status] || "To be determined";
}

// Gift card verification alert
function checkVerificationStatus() {
    const isVerified = false; // This would check from database
    const giftCardAlert = document.getElementById('giftCardAlert');
    
    if (!isVerified && userWins.some(win => win.requiresVerification)) {
        giftCardAlert.style.display = 'block';
    } else {
        giftCardAlert.style.display = 'none';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayUserWins();
    calculateUserStats();
    checkVerificationStatus();
    
    // Check if user is logged in (simulated)
    const isLoggedIn = localStorage.getItem('trustcade_user') || true;
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
});
