// Main JavaScript for TrustCade - COMPLETE VERSION

// Prize segments for the wheel
const prizes = [
    { name: "iPhone 17", value: "$1299", color: "#8B5CF6" },
    { name: "$500 Cash", value: "$500", color: "#10B981" },
    { name: "Headphones", value: "$299", color: "#3B82F6" },
    { name: "Try Again", value: "$0", color: "#6B7280" },
    { name: "PlayStation 5", value: "$499", color: "#EF4444" },
    { name: "$100 Gift Card", value: "$100", color: "#F59E0B" },
    { name: "Smart Watch", value: "$399", color: "#8B5CF6" },
    { name: "MacBook Pro", value: "$1599", color: "#10B981" }
];

// Generate fake winners for homepage
function generateRecentWinners(count = 8) {
    const firstNames = ["Alex", "Jamie", "Taylor", "Morgan", "Casey", "Jordan", "Riley", "Quinn", "Avery", "Blake"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const prizeItems = [
        { name: "iPhone 15 Pro", value: "$999" },
        { name: "PlayStation 5", value: "$499" },
        { name: "$1000 Cash", value: "$1000" },
        { name: "MacBook Air", value: "$999" },
        { name: "AirPods Pro", value: "$249" },
        { name: "Smart TV", value: "$699" },
        { name: "Nintendo Switch", value: "$299" },
        { name: "iPad Pro", value: "$799" }
    ];
    
    const winners = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const prize = prizeItems[Math.floor(Math.random() * prizeItems.length)];
        const timeOptions = ["Just now", "5m ago", "15m ago", "1h ago", "2h ago", "5h ago"];
        const time = timeOptions[Math.floor(Math.random() * timeOptions.length)];
        
        winners.push({
            name: `${firstName} ${lastName}`,
            prize: prize.name,
            value: prize.value,
            time: time,
            initial: firstName[0] + lastName[0],
            location: ["NY", "CA", "TX", "FL", "IL"][Math.floor(Math.random() * 5)]
        });
    }
    return winners;
}

// Display recent winners on homepage
function displayRecentWinners() {
    const winnersGrid = document.getElementById('recentWinnersGrid');
    if (!winnersGrid) return;
    
    const winners = generateRecentWinners(8);
    
    winnersGrid.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <div class="winner-avatar">${winner.initial}</div>
            <h4>${winner.name}</h4>
            <p class="prize-won">Won: ${winner.prize}</p>
            <p class="prize-value">${winner.value}</p>
            <div class="winner-info">
                <small class="win-time"><i class="far fa-clock"></i> ${winner.time}</small>
                <small class="win-location"><i class="fas fa-map-marker-alt"></i> ${winner.location}</small>
            </div>
        </div>
    `).join('');
}

// Update live statistics
function updateLiveStats() {
    const stats = {
        totalWinners: 5247 + Math.floor(Math.random() * 10),
        totalValue: 892450 + Math.floor(Math.random() * 1000),
        winsToday: 324 + Math.floor(Math.random() * 5),
        winRate: "1:8"
    };
    
    // Update DOM elements if they exist
    const elements = {
        totalWinners: document.getElementById('totalWinners'),
        totalValue: document.getElementById('totalValue'),
        winsToday: document.getElementById('winsToday'),
        winRate: document.getElementById('winRate'),
        lastUpdated: document.getElementById('lastUpdated')
    };
    
    if (elements.totalWinners) elements.totalWinners.textContent = stats.totalWinners.toLocaleString();
    if (elements.totalValue) elements.totalValue.textContent = `$${stats.totalValue.toLocaleString()}`;
    if (elements.winsToday) elements.winsToday.textContent = stats.winsToday;
    if (elements.winRate) elements.winRate.textContent = stats.winRate;
    if (elements.lastUpdated) {
        const now = new Date();
        elements.lastUpdated.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Grand prize timer
function startGrandPrizeTimer() {
    const timerElement = document.getElementById('grandPrizeTimer');
    if (!timerElement) return;
    
    // Set next grand prize draw to 8 PM today
    const now = new Date();
    const nextDraw = new Date();
    nextDraw.setHours(20, 0, 0, 0); // 8:00 PM
    
    // If it's already past 8 PM, set for tomorrow
    if (now > nextDraw) {
        nextDraw.setDate(nextDraw.getDate() + 1);
    }
    
    function updateGrandPrizeTimer() {
        const now = new Date();
        const timeLeft = nextDraw - now;
        
        if (timeLeft <= 0) {
            timerElement.textContent = "Drawing now!";
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateGrandPrizeTimer();
    setInterval(updateGrandPrizeTimer, 1000);
}

// Countdown Timer for daily spin
function startCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const spinButton = document.getElementById('spinButton');
    const timeLeftElement = document.getElementById('timeLeft');
    
    if (!hoursElement || !spinButton) return;
    
    let nextSpinTime = localStorage.getItem('trustcade_nextSpin');
    
    if (!nextSpinTime) {
        nextSpinTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('trustcade_nextSpin', nextSpinTime);
    }
    
    function updateTimer() {
        const now = Date.now();
        const timeLeft = parseInt(nextSpinTime) - now;
        
        if (timeLeft <= 0) {
            spinButton.disabled = false;
            spinButton.innerHTML = '<i class="fas fa-redo"></i> SPIN NOW!';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
            if (timeLeftElement) timeLeftElement.textContent = 'Ready!';
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        if (timeLeftElement) timeLeftElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        spinButton.disabled = true;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Enhanced Spin Wheel Animation
function initializeWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const spinButton = document.getElementById('spinButton');
    
    if (!canvas || !spinButton) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    let isSpinning = false;
    let currentRotation = 0;
    
    function drawWheel(rotation = 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw wheel segments
        const segmentAngle = (2 * Math.PI) / prizes.length;
        
        for (let i = 0; i < prizes.length; i++) {
            const startAngle = (i * segmentAngle) + rotation;
            const endAngle = ((i + 1) * segmentAngle) + rotation;
            
            // Draw segment
            ctx.fillStyle = prizes[i].color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw segment border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.stroke();
            
            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Poppins';
            ctx.fillText(prizes[i].name, radius - 25, 5);
            
            // Draw value
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '10px Poppins';
            ctx.fillText(prizes[i].value, radius - 25, 20);
            ctx.restore();
        }
        
        // Draw center circle
        const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 30);
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#EF4444');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw center text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SPIN', centerX, centerY);
        
        // Draw center border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw initial wheel
    drawWheel();
    
    // Spin functionality
    spinButton.addEventListener('click', function() {
        if (this.disabled || isSpinning) return;
        
        // Check if user is logged in
        const user = localStorage.getItem('trustcade_user');
        if (!user) {
            showLoginModal();
            return;
        }
        
        isSpinning = true;
        this.disabled = true;
        
        // Update spin count
        let spinsUsed = parseInt(localStorage.getItem('trustcade_spins')) || 0;
        localStorage.setItem('trustcade_spins', spinsUsed + 1);
        
        // Set next spin time (24 hours from now)
        const nextSpinTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('trustcade_nextSpin', nextSpinTime);
        
        // Random winning segment (weighted towards better prizes)
        const weightedPrizes = [];
        prizes.forEach((prize, index) => {
            const weight = prize.value === "$0" ? 1 : 2; // Better prizes have higher weight
            for (let i = 0; i < weight; i++) {
                weightedPrizes.push(index);
            }
        });
        
        const winningIndex = weightedPrizes[Math.floor(Math.random() * weightedPrizes.length)];
        const winningPrize = prizes[winningIndex];
        
        // Calculate spin parameters
        const spins = 5 + Math.random() * 3; // 5-8 full rotations
        const segmentAngle = (2 * Math.PI) / prizes.length;
        const targetRotation = spins * 2 * Math.PI + (winningIndex * segmentAngle) + (segmentAngle / 2);
        
        // Animation variables
        let startTime = null;
        const duration = 5000; // 5 seconds
        const easeOut = (t) => 1 - Math.pow(1 - t, 3); // Cubic ease-out
        
        function spinAnimation(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Eased progress for smooth deceleration
            const easedProgress = easeOut(progress);
            
            // Calculate current rotation
            currentRotation = easedProgress * targetRotation;
            drawWheel(currentRotation);
            
            if (progress < 1) {
                requestAnimationFrame(spinAnimation);
            } else {
                // Animation complete
                isSpinning = false;
                
                // Save the win
                const newWin = saveUserWin(winningPrize.name, winningPrize.value);
                
                // Show win notification after a short delay
                setTimeout(() => {
                    showWinNotification(winningPrize.name, winningPrize.value, newWin.claimCode);
                    startCountdown(); // Reset timer
                    
                    // Re-enable spin button after countdown reset
                    setTimeout(() => {
                        spinButton.disabled = false;
                    }, 100);
                }, 500);
            }
        }
        
        requestAnimationFrame(spinAnimation);
    });
}

// Save user win to localStorage
function saveUserWin(prize, value) {
    let userWins = JSON.parse(localStorage.getItem('trustcade_wins')) || [];
    
    const newWin = {
        id: Date.now(),
        prize: prize,
        value: value,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        status: "pending",
        claimCode: `TC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        requiresVerification: parseInt(value.replace(/\$|,/g, '')) > 100
    };
    
    userWins.push(newWin);
    localStorage.setItem('trustcade_wins', JSON.stringify(userWins));
    
    // Update user stats
    updateUserStats();
    
    return newWin;
}

// Update user statistics
function updateUserStats() {
    const userWins = JSON.parse(localStorage.getItem('trustcade_wins')) || [];
    const totalWins = userWins.length;
    const totalValue = userWins.reduce((sum, win) => {
        const value = parseInt(win.value.replace(/\$|,/g, '')) || 0;
        return sum + value;
    }, 0);
    
    // Save stats to localStorage for profile page
    localStorage.setItem('trustcade_user_stats', JSON.stringify({
        totalWins,
        totalValue,
        lastUpdated: new Date().toISOString()
    }));
}

// Show win notification using the built-in notification system
function showWinNotification(prize, value, claimCode) {
    const notification = document.getElementById('winNotification');
    if (!notification) return;
    
    // Update notification content
    document.getElementById('wonPrize').textContent = prize;
    document.getElementById('wonValue').textContent = value;
    
    // Show notification
    notification.classList.add('show');
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 10000);
    
    // Setup close button
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.onclick = () => notification.classList.remove('show');
    }
    
    // Setup claim button
    const claimBtn = notification.querySelector('.notification-btn');
    if (claimBtn) {
        claimBtn.onclick = () => {
            notification.classList.remove('show');
            window.location.href = 'profile.html';
        };
    }
}

// Leaderboard data
const leaderboardData = [
    { name: "Alex Johnson", wins: 8, value: 5850, avatar: "AJ", status: "Verified" },
    { name: "Maria Garcia", wins: 6, value: 4200, avatar: "MG", status: "Verified" },
    { name: "David Chen", wins: 5, value: 3500, avatar: "DC", status: "Verified" },
    { name: "Sarah Williams", wins: 4, value: 2800, avatar: "SW", status: "Verified" },
    { name: "Mike Thompson", wins: 3, value: 2100, avatar: "MT", status: "Pending" },
    { name: "Emma Wilson", wins: 3, value: 1950, avatar: "EW", status: "Verified" },
    { name: "James Brown", wins: 2, value: 1500, avatar: "JB", status: "Verified" },
    { name: "Lisa Taylor", wins: 2, value: 1200, avatar: "LT", status: "Verified" },
    { name: "Robert Miller", wins: 1, value: 999, avatar: "RM", status: "Pending" },
    { name: "Jennifer Davis", wins: 1, value: 899, avatar: "JD", status: "Verified" }
];

// Display leaderboard
function displayLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    if (!leaderboard) return;
    
    leaderboard.innerHTML = leaderboardData.map((player, index) => `
        <div class="leaderboard-item">
            <div>
                <div class="rank-badge ${getRankClass(index)}">
                    ${index + 1}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="winner-avatar">${player.avatar}</div>
                <div>
                    <strong>${player.name}</strong>
                    <small style="color: #666; font-size: 0.8rem;">Player</small>
                </div>
            </div>
            <div>
                <strong>${player.wins}</strong> wins
            </div>
            <div>
                <strong>$${player.value.toLocaleString()}</strong>
            </div>
            <div>
                <span class="${player.status === 'Verified' ? 'verified-badge' : 'pending-badge'}">
                    ${player.status}
                </span>
            </div>
        </div>
    `).join('');
}

function getRankClass(index) {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-other';
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('show');
            }
        });
        
        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
            });
        });
    }
    
    // Update mobile login button based on auth status
    if (mobileLoginBtn) {
        const user = localStorage.getItem('trustcade_user');
        if (user) {
            mobileLoginBtn.textContent = 'Profile';
            mobileLoginBtn.href = 'profile.html';
        }
    }
}

// Update authentication UI
function updateAuthUI() {
    const user = localStorage.getItem('trustcade_user');
    const loginBtn = document.querySelector('a.btn-login');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    
    if (user) {
        const userData = JSON.parse(user);
        
        // Update desktop login button
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Profile';
            loginBtn.href = 'profile.html';
            loginBtn.classList.remove('btn-login');
            loginBtn.classList.add('btn-profile');
            loginBtn.id = 'profileBtn';
        }
        
        // Update mobile login button
        if (mobileLoginBtn) {
            mobileLoginBtn.textContent = 'Profile';
            mobileLoginBtn.href = 'profile.html';
        }
    } else {
        // Reset to login buttons
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.href = 'login.html';
            loginBtn.classList.remove('btn-profile');
            loginBtn.classList.add('btn-login');
            loginBtn.id = 'loginBtn';
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.textContent = 'Login';
            mobileLoginBtn.href = 'login.html';
        }
    }
}

// Login modal functionality
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        
        // Close modal when clicking X
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('show');
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
        
        // Handle quick login form
        const form = modal.querySelector('#quickLoginForm');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                const password = form.querySelector('input[type="password"]').value;
                
                // Simple validation
                if (email && password) {
                    // Simulate login (in real app, this would be an API call)
                    const userData = {
                        email: email,
                        name: email.split('@')[0],
                        joined: new Date().toISOString(),
                        verified: false
                    };
                    
                    localStorage.setItem('trustcade_user', JSON.stringify(userData));
                    updateAuthUI();
                    modal.classList.remove('show');
                    alert('Login successful! You can now spin the wheel.');
                } else {
                    alert('Please enter both email and password.');
                }
            };
        }
    }
}

// Handle profile button click
function setupProfileButton() {
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            const user = localStorage.getItem('trustcade_user');
            if (!user) {
                e.preventDefault();
                showLoginModal();
            }
        });
    }
}

// Initialize newsletter form
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-input');
    if (newsletterForm) {
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        
        button.addEventListener('click', () => {
            if (input.value && input.value.includes('@')) {
                alert('Thank you for subscribing to our newsletter!');
                input.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                button.click();
            }
        });
    }
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    displayRecentWinners();
    updateLiveStats();
    startGrandPrizeTimer();
    startCountdown();
    initializeWheel();
    displayLeaderboard();
    setupMobileMenu();
    updateAuthUI();
    setupProfileButton();
    setupNewsletter();
    setupSmoothScrolling();
    
    // Update live stats every minute
    setInterval(updateLiveStats, 60000);
    
    // Log initialization
    console.log('TrustCade initialized successfully!');
});

// Make functions available globally
window.saveUserWin = saveUserWin;
window.showWinNotification = showWinNotification;
window.showLoginModal = showLoginModal;
window.updateAuthUI = updateAuthUI;
