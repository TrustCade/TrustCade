// Profile page functionality - UPDATED VERSION

// Status configuration
const statusConfig = {
    pending: { text: "Verification Pending", class: "status-pending", icon: "fas fa-clock" },
    verified: { text: "Verified - Ready to Ship", class: "status-verified", icon: "fas fa-check-circle" },
    shipped: { text: "Shipped", class: "status-shipped", icon: "fas fa-shipping-fast" },
    delivered: { text: "Delivered", class: "status-delivered", icon: "fas fa-box-open" }
};

// Get user wins from localStorage
function getUserWins() {
    try {
        return JSON.parse(localStorage.getItem('trustcade_wins')) || [];
    } catch (e) {
        return [];
    }
}

// Get user data
function getUserData() {
    try {
        return JSON.parse(localStorage.getItem('trustcade_user')) || { name: "User", email: "" };
    } catch (e) {
        return { name: "User", email: "" };
    }
}

// Display user's wins
function displayUserWins() {
    const userWins = getUserWins();
    const winsGrid = document.getElementById('userWinsGrid');
    const noWinsMessage = document.getElementById('noWinsMessage');
    
    if (!winsGrid) return;
    
    if (userWins.length === 0) {
        if (winsGrid) winsGrid.style.display = 'none';
        if (noWinsMessage) noWinsMessage.style.display = 'block';
        return;
    }
    
    // Show wins grid, hide no wins message
    winsGrid.style.display = 'grid';
    if (noWinsMessage) noWinsMessage.style.display = 'none';
    
    winsGrid.innerHTML = userWins.map((win, index) => `
        <div class="win-card">
            <div class="win-status ${statusConfig[win.status || 'pending'].class}">
                <i class="${statusConfig[win.status || 'pending'].icon}"></i> ${statusConfig[win.status || 'pending'].text}
            </div>
            
            <div style="text-align: center; margin-bottom: 1rem;">
                <i class="fas fa-gift" style="font-size: 3rem; color: #8B5CF6;"></i>
            </div>
            
            <h3 style="margin: 1rem 0;">${win.prize}</h3>
            <p style="color: #666;"><strong>Value:</strong> ${win.value}</p>
            <p style="color: #666;"><i class="fas fa-calendar"></i> Won on: ${win.date}</p>
            <p style="color: #666;"><i class="fas fa-tag"></i> Claim Code: <code>${win.claimCode}</code></p>
            
            ${win.requiresVerification ? 
                `<button class="claim-btn" onclick="showVerificationRequired()">
                    <i class="fas fa-gift"></i> Complete Verification to Claim
                </button>` 
                : 
                `<button class="claim-btn" onclick="claimPrize(${win.id})">
                    <i class="fas fa-gift"></i> ${(win.status === 'pending' || !win.status) ? 'Claim Prize' : 'View Details'}
                </button>`
            }
        </div>
    `).join('');
}

// Calculate user stats
function calculateUserStats() {
    const userWins = getUserWins();
    const totalWins = userWins.length;
    
    const totalValue = userWins.reduce((sum, win) => {
        const valueStr = win.value.replace('$', '').replace(',', '');
        const value = parseInt(valueStr) || 0;
        return sum + value;
    }, 0);
    
    // Get spins used from localStorage
    const spinsUsed = parseInt(localStorage.getItem('trustcade_spins')) || 0;
    const winRate = spinsUsed > 0 ? ((totalWins / spinsUsed) * 100).toFixed(1) : 0;
    
    // Update UI elements if they exist
    const totalWinsEl = document.getElementById('totalWins');
    const totalValueEl = document.getElementById('totalValue');
    const spinsUsedEl = document.getElementById('spinsUsed');
    const winRateEl = document.getElementById('winRate');
    
    if (totalWinsEl) totalWinsEl.textContent = totalWins;
    if (totalValueEl) totalValueEl.textContent = `$${totalValue.toLocaleString()}`;
    if (spinsUsedEl) spinsUsedEl.textContent = spinsUsed;
    if (winRateEl) winRateEl.textContent = `${winRate}%`;
    
    // Update win date if there are wins
    if (totalWins > 0) {
        const latestWin = userWins[userWins.length - 1];
        const winDateEl = document.getElementById('winDate');
        if (winDateEl) winDateEl.textContent = latestWin.date;
    }
}

// Claim prize function
function claimPrize(winId) {
    const userWins = getUserWins();
    const winIndex = userWins.findIndex(w => w.id == winId);
    
    if (winIndex === -1) {
        alert('Prize not found!');
        return;
    }
    
    const win = userWins[winIndex];
    
    if (win.status === 'pending' || !win.status) {
        const address = prompt("Please enter your shipping address:");
        if (address && address.trim()) {
            // Update win status
            userWins[winIndex].status = 'verified';
            userWins[winIndex].shippingAddress = address;
            localStorage.setItem('trustcade_wins', JSON.stringify(userWins));
            
            alert(`✅ Prize claimed successfully!\n\nWe'll ship your ${win.prize} to:\n${address}\n\nYou'll receive tracking info within 48 hours.`);
            
            // Refresh display
            displayUserWins();
        }
    } else {
        showPrizeDetails(win);
    }
}

// Show prize details modal
function showPrizeDetails(win) {
    const modalHtml = `
        <div class="prize-modal">
            <h2><i class="fas fa-gift"></i> ${win.prize}</h2>
            <div style="margin: 1.5rem 0;">
                <p><strong>Status:</strong> ${statusConfig[win.status || 'pending'].text}</p>
                <p><strong>Claim Code:</strong> <code>${win.claimCode}</code></p>
                <p><strong>Value:</strong> ${win.value}</p>
                <p><strong>Date Won:</strong> ${win.date}</p>
                <p><strong>Requires Verification:</strong> ${win.requiresVerification ? 'Yes' : 'No'}</p>
                ${win.shippingAddress ? `<p><strong>Shipping to:</strong> ${win.shippingAddress}</p>` : ''}
            </div>
            <button onclick="closeModal()" class="spin-btn" style="margin-top: 1rem; padding: 0.8rem 2rem;">Close</button>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

// Show verification required
function showVerificationRequired() {
    if (confirm('🔐 Verification Required\n\nTo claim this prize, you need to verify your account with a $100 Steam/Apple gift card.\n\nGo to verification page?')) {
        window.location.href = 'register.html';
    }
}

// Check verification status
function checkVerificationStatus() {
    const isVerified = localStorage.getItem('trustcade_verified') === 'true';
    const giftCardAlert = document.getElementById('giftCardAlert');
    const userWins = getUserWins();
    
    if (giftCardAlert) {
        if (!isVerified && userWins.some(win => win.requiresVerification)) {
            giftCardAlert.style.display = 'block';
        } else {
            giftCardAlert.style.display = 'none';
        }
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Don't clear wins, just clear login status
        localStorage.removeItem('trustcade_user');
        window.location.href = 'index.html';
    }
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = localStorage.getItem('trustcade_user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    const userData = getUserData();
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = userData.name || 'User';
    }
    
    // Update email if element exists
    const userEmailEl = document.querySelector('.profile-header p:nth-child(2)');
    if (userEmailEl && userData.email) {
        userEmailEl.innerHTML = `<i class="fas fa-envelope"></i> ${userData.email}`;
    }
    
    // Setup logout button
    const logoutBtn = document.querySelector('a[href="login.html"].btn-login');
    if (logoutBtn) {
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.href = '#';
        logoutBtn.onclick = logout;
    }
    
    // Load user content
    displayUserWins();
    calculateUserStats();
    checkVerificationStatus();
});

// Make functions available globally
window.claimPrize = claimPrize;
window.showVerificationRequired = showVerificationRequired;
window.closeModal = closeModal;
window.showPrizeDetails = showPrizeDetails;
