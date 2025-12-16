// Profile page functionality - COMPLETE VERSION

// Status configuration with more detailed info
const statusConfig = {
    pending: { 
        text: "Verification Pending", 
        class: "status-pending", 
        icon: "fas fa-clock",
        description: "Waiting for gift card verification",
        color: "#F59E0B"
    },
    verified: { 
        text: "Verified - Ready to Ship", 
        class: "status-verified", 
        icon: "fas fa-check-circle",
        description: "Account verified, preparing shipment",
        color: "#10B981"
    },
    shipped: { 
        text: "Shipped", 
        class: "status-shipped", 
        icon: "fas fa-shipping-fast",
        description: "Package is on its way",
        color: "#3B82F6"
    },
    delivered: { 
        text: "Delivered", 
        class: "status-delivered", 
        icon: "fas fa-box-open",
        description: "Package delivered successfully",
        color: "#8B5CF6"
    }
};

// Prize categories for better organization
const prizeCategories = {
    electronics: { icon: "fas fa-mobile-alt", color: "#8B5CF6" },
    cash: { icon: "fas fa-money-bill-wave", color: "#10B981" },
    gaming: { icon: "fas fa-gamepad", color: "#EF4444" },
    lifestyle: { icon: "fas fa-tshirt", color: "#F59E0B" },
    other: { icon: "fas fa-gift", color: "#6B7280" }
};

// Get user wins from localStorage
function getUserWins() {
    try {
        const wins = JSON.parse(localStorage.getItem('trustcade_wins')) || [];
        // Sort by date (newest first)
        return wins.sort((a, b) => b.id - a.id);
    } catch (e) {
        console.error('Error loading user wins:', e);
        return [];
    }
}

// Get user data with defaults
function getUserData() {
    try {
        const user = JSON.parse(localStorage.getItem('trustcade_user'));
        if (!user) {
            // Redirect to login if no user data
            window.location.href = 'login.html';
            return null;
        }
        
        // Ensure user has all required properties
        return {
            name: user.name || "User",
            email: user.email || "",
            joined: user.joined || new Date().toISOString(),
            verified: user.verified || false,
            avatar: user.avatar || getInitials(user.name || "U")
        };
    } catch (e) {
        console.error('Error loading user data:', e);
        return null;
    }
}

// Get user statistics
function getUserStats() {
    try {
        return JSON.parse(localStorage.getItem('trustcade_user_stats')) || {
            totalWins: 0,
            totalValue: 0,
            spinsUsed: 0,
            winRate: 0,
            lastUpdated: new Date().toISOString()
        };
    } catch (e) {
        return {
            totalWins: 0,
            totalValue: 0,
            spinsUsed: 0,
            winRate: 0,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Categorize prize for better display
function categorizePrize(prizeName) {
    const lowerPrize = prizeName.toLowerCase();
    
    if (lowerPrize.includes('iphone') || lowerPrize.includes('macbook') || lowerPrize.includes('ipad') || 
        lowerPrize.includes('watch') || lowerPrize.includes('headphone') || lowerPrize.includes('tv')) {
        return 'electronics';
    } else if (lowerPrize.includes('cash') || lowerPrize.includes('$') || lowerPrize.includes('gift card')) {
        return 'cash';
    } else if (lowerPrize.includes('playstation') || lowerPrize.includes('xbox') || lowerPrize.includes('nintendo') || 
               lowerPrize.includes('gaming')) {
        return 'gaming';
    } else if (lowerPrize.includes('bicycle') || lowerPrize.includes('equipment') || lowerPrize.includes('speaker') || 
               lowerPrize.includes('camera')) {
        return 'lifestyle';
    } else {
        return 'other';
    }
}

// Update tracking timeline based on win status
function updateTrackingTimeline(winStatus = 'pending') {
    const steps = document.querySelectorAll('.tracking-step');
    if (!steps.length) return;
    
    const statusOrder = ['pending', 'verified', 'shipped', 'delivered'];
    const currentStepIndex = statusOrder.indexOf(winStatus);
    
    steps.forEach((step, index) => {
        if (index <= currentStepIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Display user's wins with enhanced UI
function displayUserWins() {
    const userWins = getUserWins();
    const winsGrid = document.getElementById('userWinsGrid');
    const noWinsMessage = document.getElementById('noWinsMessage');
    
    if (!winsGrid) return;
    
    if (userWins.length === 0) {
        winsGrid.style.display = 'none';
        if (noWinsMessage) noWinsMessage.style.display = 'block';
        return;
    }
    
    // Show wins grid, hide no wins message
    winsGrid.style.display = 'grid';
    if (noWinsMessage) noWinsMessage.style.display = 'none';
    
    winsGrid.innerHTML = userWins.map((win, index) => {
        const category = categorizePrize(win.prize);
        const categoryInfo = prizeCategories[category] || prizeCategories.other;
        const status = win.status || 'pending';
        
        return `
            <div class="win-card">
                <div class="win-status ${statusConfig[status].class}" style="background: ${statusConfig[status].color}">
                    <i class="${statusConfig[status].icon}"></i> ${statusConfig[status].text}
                </div>
                
                <div class="win-header">
                    <div class="win-category" style="color: ${categoryInfo.color}">
                        <i class="${categoryInfo.icon}"></i>
                    </div>
                    <div class="win-prize-info">
                        <h3>${win.prize}</h3>
                        <div class="win-value">${win.value}</div>
                    </div>
                </div>
                
                <div class="win-details">
                    <div class="detail-row">
                        <i class="fas fa-calendar"></i>
                        <span>Won: ${win.date} ${win.time ? `at ${win.time}` : ''}</span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-tag"></i>
                        <span>Code: <code>${win.claimCode}</code></span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-info-circle"></i>
                        <span>${statusConfig[status].description}</span>
                    </div>
                    ${win.shippingAddress ? `
                    <div class="detail-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Shipping to: ${win.shippingAddress}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="win-actions">
                    ${win.requiresVerification && !win.verified ? 
                        `<button class="claim-btn verify-btn" onclick="showVerificationRequired()">
                            <i class="fas fa-shield-alt"></i> Verify Account to Claim
                        </button>` 
                        : 
                        `<button class="claim-btn ${status === 'pending' ? 'primary-btn' : 'secondary-btn'}" 
                                onclick="claimPrize(${win.id})">
                            <i class="fas fa-gift"></i> ${status === 'pending' ? 'Claim Prize Now' : 'View Details'}
                        </button>`
                    }
                    ${status === 'shipped' && win.trackingNumber ? `
                        <a href="#" class="tracking-link" onclick="showTracking('${win.trackingNumber}')">
                            <i class="fas fa-truck"></i> Track Package
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Calculate and display user statistics
function calculateUserStats() {
    const userWins = getUserWins();
    const userStats = getUserStats();
    
    const totalWins = userWins.length;
    const totalValue = userWins.reduce((sum, win) => {
        const valueStr = win.value.replace(/[$,]/g, '');
        const value = parseFloat(valueStr) || 0;
        return sum + value;
    }, 0);
    
    const spinsUsed = userStats.spinsUsed || parseInt(localStorage.getItem('trustcade_spins')) || 0;
    const winRate = spinsUsed > 0 ? ((totalWins / spinsUsed) * 100).toFixed(1) : 0;
    
    // Update UI elements
    const elements = {
        totalWins: document.getElementById('totalWins'),
        totalValue: document.getElementById('totalValue'),
        spinsUsed: document.getElementById('spinsUsed'),
        winRate: document.getElementById('winRate')
    };
    
    if (elements.totalWins) {
        elements.totalWins.textContent = totalWins;
        elements.totalWins.style.fontSize = totalWins > 9 ? '2.2rem' : '2.5rem';
    }
    
    if (elements.totalValue) {
        elements.totalValue.textContent = `$${totalValue.toLocaleString()}`;
        elements.totalValue.style.color = totalValue > 1000 ? '#10B981' : '#8B5CF6';
    }
    
    if (elements.spinsUsed) {
        elements.spinsUsed.textContent = spinsUsed;
    }
    
    if (elements.winRate) {
        elements.winRate.textContent = `${winRate}%`;
        elements.winRate.style.color = winRate > 10 ? '#10B981' : winRate > 5 ? '#F59E0B' : '#EF4444';
    }
    
    // Update win date if there are wins
    if (totalWins > 0) {
        const latestWin = userWins[0]; // Already sorted newest first
        const winDateEl = document.getElementById('winDate');
        if (winDateEl) {
            winDateEl.textContent = `${latestWin.date} ${latestWin.time || ''}`;
        }
        
        // Update tracking timeline
        updateTrackingTimeline(latestWin.status || 'pending');
    }
    
    // Update user level based on wins
    updateUserLevel(totalWins, totalValue);
}

// Update user level/rank
function updateUserLevel(wins, value) {
    const levelElement = document.getElementById('userLevel');
    if (!levelElement) return;
    
    let level, color, icon;
    
    if (value > 5000) {
        level = "VIP Member"; color = "#FFD700"; icon = "fas fa-crown";
    } else if (value > 2000) {
        level = "Gold Member"; color = "#C0C0C0"; icon = "fas fa-award";
    } else if (value > 500) {
        level = "Silver Member"; color = "#CD7F32"; icon = "fas fa-medal";
    } else if (wins > 0) {
        level = "Bronze Member"; color = "#8B5CF6"; icon = "fas fa-star";
    } else {
        level = "New Member"; color = "#6B7280"; icon = "fas fa-user";
    }
    
    levelElement.innerHTML = `<i class="${icon}" style="color: ${color}"></i> ${level}`;
    levelElement.style.color = color;
}

// Claim prize function with enhanced features
function claimPrize(winId) {
    const userWins = getUserWins();
    const winIndex = userWins.findIndex(w => w.id == winId);
    
    if (winIndex === -1) {
        showNotification('Prize not found!', 'error');
        return;
    }
    
    const win = userWins[winIndex];
    const status = win.status || 'pending';
    
    if (status === 'pending') {
        // Check if user is verified
        const userData = getUserData();
        if (!userData.verified && win.requiresVerification) {
            showVerificationRequired();
            return;
        }
        
        showClaimModal(win);
    } else {
        showPrizeDetails(win);
    }
}

// Show claim modal with form
function showClaimModal(win) {
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-content claim-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-gift"></i> Claim Your Prize</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="prize-summary">
                        <div class="prize-icon">
                            <i class="fas fa-gift"></i>
                        </div>
                        <div class="prize-info">
                            <h3>${win.prize}</h3>
                            <p class="prize-value">${win.value}</p>
                            <p class="prize-code">Code: <code>${win.claimCode}</code></p>
                        </div>
                    </div>
                    
                    <form id="claimForm" class="claim-form">
                        <div class="form-group">
                            <label for="fullName"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="fullName" required placeholder="Enter your full name">
                        </div>
                        
                        <div class="form-group">
                            <label for="shippingAddress"><i class="fas fa-map-marker-alt"></i> Shipping Address</label>
                            <textarea id="shippingAddress" required placeholder="Enter your complete shipping address" rows="3"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="phoneNumber"><i class="fas fa-phone"></i> Phone Number</label>
                            <input type="tel" id="phoneNumber" required placeholder="Enter your phone number">
                        </div>
                        
                        <div class="form-group">
                            <label for="emailConfirm"><i class="fas fa-envelope"></i> Confirm Email</label>
                            <input type="email" id="emailConfirm" required placeholder="Confirm your email address">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-paper-plane"></i> Submit Claim
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('claimForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            
            // Validate email matches
            const userData = getUserData();
            const emailInput = document.getElementById('emailConfirm');
            
            if (emailInput.value !== userData.email) {
                showNotification('Email does not match your account email!', 'error');
                return;
            }
            
            // Update win status
            const userWins = getUserWins();
            const winIndex = userWins.findIndex(w => w.id == win.id);
            
            if (winIndex !== -1) {
                userWins[winIndex].status = 'verified';
                userWins[winIndex].shippingAddress = document.getElementById('shippingAddress').value;
                userWins[winIndex].fullName = document.getElementById('fullName').value;
                userWins[winIndex].phoneNumber = document.getElementById('phoneNumber').value;
                userWins[winIndex].claimedDate = new Date().toISOString();
                
                localStorage.setItem('trustcade_wins', JSON.stringify(userWins));
                
                // Show success message
                showNotification(`✅ Prize claimed successfully! We'll ship your ${win.prize} within 48 hours.`, 'success');
                
                // Close modal and refresh display
                closeModal();
                displayUserWins();
                calculateUserStats();
            }
        };
    }
    
    // Auto-fill form with user data
    const userData = getUserData();
    if (userData) {
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('emailConfirm');
        
        if (fullNameInput && userData.name) {
            fullNameInput.value = userData.name;
        }
        
        if (emailInput && userData.email) {
            emailInput.value = userData.email;
        }
    }
}

// Show prize details modal
function showPrizeDetails(win) {
    const status = win.status || 'pending';
    const category = categorizePrize(win.prize);
    const categoryInfo = prizeCategories[category] || prizeCategories.other;
    
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-content prize-details-modal">
                <div class="modal-header">
                    <h2><i class="${categoryInfo.icon}" style="color: ${categoryInfo.color}"></i> ${win.prize}</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="prize-status-banner" style="background: ${statusConfig[status].color}">
                        <i class="${statusConfig[status].icon}"></i>
                        <div>
                            <h3>${statusConfig[status].text}</h3>
                            <p>${statusConfig[status].description}</p>
                        </div>
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-card">
                            <i class="fas fa-tag"></i>
                            <h4>Value</h4>
                            <p>${win.value}</p>
                        </div>
                        <div class="detail-card">
                            <i class="fas fa-calendar"></i>
                            <h4>Date Won</h4>
                            <p>${win.date} ${win.time || ''}</p>
                        </div>
                        <div class="detail-card">
                            <i class="fas fa-barcode"></i>
                            <h4>Claim Code</h4>
                            <p><code>${win.claimCode}</code></p>
                        </div>
                        <div class="detail-card">
                            <i class="fas fa-shield-alt"></i>
                            <h4>Verification</h4>
                            <p>${win.requiresVerification ? 'Required' : 'Not Required'}</p>
                        </div>
                    </div>
                    
                    ${win.shippingAddress ? `
                    <div class="shipping-info">
                        <h3><i class="fas fa-truck"></i> Shipping Information</h3>
                        <div class="shipping-details">
                            <p><strong>Name:</strong> ${win.fullName || 'Not provided'}</p>
                            <p><strong>Address:</strong> ${win.shippingAddress}</p>
                            ${win.phoneNumber ? `<p><strong>Phone:</strong> ${win.phoneNumber}</p>` : ''}
                            ${win.trackingNumber ? `
                                <p><strong>Tracking:</strong> ${win.trackingNumber}</p>
                                <a href="#" class="track-btn" onclick="trackPackage('${win.trackingNumber}')">
                                    <i class="fas fa-external-link-alt"></i> Track Package
                                </a>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="modal-actions">
                        <button onclick="closeModal()" class="btn-primary">
                            <i class="fas fa-check"></i> Close
                        </button>
                        ${status === 'pending' ? `
                            <button onclick="claimPrize(${win.id})" class="btn-secondary">
                                <i class="fas fa-gift"></i> Claim Now
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

// Show verification required
function showVerificationRequired() {
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-content verification-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-shield-alt"></i> Account Verification Required</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="verification-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    
                    <h3>Verify with $100 Gift Card</h3>
                    <p>To claim prizes worth more than $100, you need to verify your account with a Steam or Apple gift card.</p>
                    
                    <div class="benefits-list">
                        <div class="benefit">
                            <i class="fas fa-check-circle"></i>
                            <span>Unlock all prize claims</span>
                        </div>
                        <div class="benefit">
                            <i class="fas fa-check-circle"></i>
                            <span>Join grand prize draws</span>
                        </div>
                        <div class="benefit">
                            <i class="fas fa-check-circle"></i>
                            <span>Priority shipping</span>
                        </div>
                        <div class="benefit">
                            <i class="fas fa-check-circle"></i>
                            <span>Verified badge on profile</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button onclick="closeModal()" class="btn-secondary">
                            <i class="fas fa-times"></i> Later
                        </button>
                        <button onclick="goToVerification()" class="btn-primary">
                            <i class="fas fa-shield-alt"></i> Verify Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

// Go to verification page
function goToVerification() {
    closeModal();
    window.location.href = 'register.html?verify=true';
}

// Check verification status
function checkVerificationStatus() {
    const userData = getUserData();
    const giftCardAlert = document.getElementById('giftCardAlert');
    const userWins = getUserWins();
    
    if (!giftCardAlert) return;
    
    const needsVerification = !userData.verified && userWins.some(win => win.requiresVerification && (!win.status || win.status === 'pending'));
    
    if (needsVerification) {
        giftCardAlert.style.display = 'block';
        
        // Count high-value pending prizes
        const highValuePrizes = userWins.filter(win => 
            win.requiresVerification && (!win.status || win.status === 'pending')
        ).length;
        
        if (highValuePrizes > 0) {
            const prizeText = document.querySelector('.gift-card-prompt p:nth-child(2)');
            if (prizeText) {
                prizeText.textContent = `You have ${highValuePrizes} prize${highValuePrizes > 1 ? 's' : ''} waiting for verification. Verify now to claim!`;
            }
        }
    } else {
        giftCardAlert.style.display = 'none';
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Logout function with confirmation
function logout() {
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-content logout-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-sign-out-alt"></i> Logout</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="logout-icon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    
                    <h3>Are you sure you want to logout?</h3>
                    <p>Your wins and spin history will be saved, but you'll need to login again to spin or claim prizes.</p>
                    
                    <div class="modal-actions">
                        <button onclick="closeModal()" class="btn-secondary">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button onclick="confirmLogout()" class="btn-primary">
                            <i class="fas fa-sign-out-alt"></i> Yes, Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

// Confirm logout
function confirmLogout() {
    localStorage.removeItem('trustcade_user');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Update user avatar
function updateUserAvatar() {
    const userData = getUserData();
    const avatarElement = document.querySelector('.user-avatar i');
    
    if (avatarElement && userData) {
        // Replace icon with initials if we have a name
        if (userData.avatar && userData.avatar.length === 2) {
            avatarElement.parentElement.innerHTML = `
                <div class="avatar-initials" style="background: ${getAvatarColor(userData.name)}">
                    ${userData.avatar}
                </div>
            `;
        }
    }
}

// Get color for avatar based on name
function getAvatarColor(name) {
    const colors = [
        '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444',
        '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6'
    ];
    
    if (!name) return colors[0];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = getUserData();
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = userData.name || 'User';
    }
    
    // Update user info
    const userInfoElements = {
        email: document.querySelector('.profile-header p:nth-child(2)'),
        joined: document.querySelector('.profile-header p:nth-child(3)')
    };
    
    if (userInfoElements.email && userData.email) {
        userInfoElements.email.innerHTML = `<i class="fas fa-envelope"></i> ${userData.email}`;
    }
    
    if (userInfoElements.joined) {
        const joinedDate = new Date(userData.joined).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        userInfoElements.joined.innerHTML = `<i class="fas fa-calendar"></i> Member since: ${joinedDate}`;
    }
    
    // Update avatar
    updateUserAvatar();
    
    // Setup logout button
    const logoutBtn = document.querySelector('a.btn-login');
    if (logoutBtn) {
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.href = '#';
        logoutBtn.onclick = logout;
        logoutBtn.title = 'Logout from TrustCade';
    }
    
    // Load user content
    displayUserWins();
    calculateUserStats();
    checkVerificationStatus();
    
    // Add CSS for new elements
    addProfileStyles();
});

// Add additional styles for profile page
function addProfileStyles() {
    const styles = `
        .win-card {
            position: relative;
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
        }
        
        .win-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-color: #8B5CF6;
        }
        
        .win-status {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .win-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .win-category {
            font-size: 2rem;
            opacity: 0.8;
        }
        
        .win-prize-info h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
        }
        
        .win-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #10B981;
        }
        
        .win-details {
            margin: 1.5rem 0;
        }
        
        .detail-row {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            margin-bottom: 0.8rem;
            color: #666;
            font-size: 0.9rem;
        }
        
        .detail-row i {
            width: 20px;
            color: #8B5CF6;
        }
        
        .win-actions {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }
        
        .claim-btn {
            padding: 0.8rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .primary-btn {
            background: #8B5CF6;
            color: white;
        }
        
        .primary-btn:hover {
            background: #7c3aed;
        }
        
        .secondary-btn {
            background: #f8f9fa;
            color: #333;
            border: 1px solid #e9ecef;
        }
        
        .secondary-btn:hover {
            background: #e9ecef;
        }
        
        .verify-btn {
            background: #F59E0B;
            color: white;
        }
        
        .verify-btn:hover {
            background: #D97706;
        }
        
        .tracking-link {
            text-align: center;
            color: #3B82F6;
            text-decoration: none;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .tracking-link:hover {
            text-decoration: underline;
        }
        
        .avatar-initials {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }
        
        .notification.success { background: #10B981; }
        .notification.error { background: #EF4444; }
        .notification.info { background: #3B82F6; }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Make functions available globally
window.claimPrize = claimPrize;
window.showVerificationRequired = showVerificationRequired;
window.closeModal = closeModal;
window.showPrizeDetails = showPrizeDetails;
window.logout = logout;
