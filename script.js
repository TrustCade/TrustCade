// Main JavaScript for TrustCade

// Prize segments for the wheel
const prizes = [
    { name: "iPhone 17", value: "$1299" },
    { name: "$500 Cash", value: "$500" },
    { name: "Headphones", value: "$299" },
    { name: "Try Again", value: "$0" },
    { name: "PlayStation 5", value: "$499" },
    { name: "$100 Gift Card", value: "$100" },
    { name: "Smart Watch", value: "$399" },
    { name: "MacBook Pro", value: "$1599" }
];

// Generate fake winners for homepage
function generateRecentWinners(count = 8) {
    const firstNames = ["Alex", "Jamie", "Taylor", "Morgan", "Casey", "Jordan", "Riley", "Quinn"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
    const prizeItems = ["iPhone 15", "PlayStation 5", "$1000 Cash", "Laptop", "Headphones", "Smart TV"];
    
    const winners = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const prize = prizeItems[Math.floor(Math.random() * prizeItems.length)];
        const time = `${Math.floor(Math.random() * 24)}h ago`;
        
        winners.push({
            name: `${firstName} ${lastName}`,
            prize: prize,
            time: time,
            initial: firstName[0] + lastName[0]
        });
    }
    return winners;
}

// Display recent winners on homepage
function displayRecentWinners() {
    const winnersGrid = document.getElementById('recentWinnersGrid');
    const winners = generateRecentWinners(8);
    
    winnersGrid.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <div class="winner-avatar">${winner.initial}</div>
            <h4>${winner.name}</h4>
            <p class="prize-won">Won: ${winner.prize}</p>
            <small class="win-time">${winner.time}</small>
        </div>
    `).join('');
}

// Countdown Timer
function startCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const spinButton = document.getElementById('spinButton');
    
    let nextSpinTime = localStorage.getItem('trustcade_nextSpin');
    
    if (!nextSpinTime) {
        nextSpinTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('trustcade_nextSpin', nextSpinTime);
    }
    
    function updateTimer() {
        const now = Date.now();
        const timeLeft = nextSpinTime - now;
        
        if (timeLeft <= 0) {
            spinButton.disabled = false;
            spinButton.innerHTML = '<i class="fas fa-redo"></i> SPIN NOW!';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        spinButton.disabled = true;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Spin Wheel Animation
function initializeWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw wheel segments
        const segmentAngle = (2 * Math.PI) / prizes.length;
        
        for (let i = 0; i < prizes.length; i++) {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            
            // Alternate colors
            ctx.fillStyle = i % 2 === 0 ? '#8B5CF6' : '#10B981';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = '16px Poppins';
            ctx.fillText(prizes[i].name, radius - 20, 10);
            ctx.restore();
        }
        
        // Draw center circle
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('SPIN', centerX, centerY + 8);
    }
    
    drawWheel();
    
    // Spin functionality
    document.getElementById('spinButton').addEventListener('click', function() {
        if (this.disabled) return;
        
        this.disabled = true;
        
        // Set next spin time
        const nextSpinTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('trustcade_nextSpin', nextSpinTime);
        
        // Spin animation
        let rotation = 0;
        const spins = 5 + Math.random() * 3;
        const totalRotation = spins * 2 * Math.PI;
        const segmentAngle = (2 * Math.PI) / prizes.length;
        
        function animate() {
            rotation += 0.1;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
            drawWheel();
            ctx.restore();
            
            if (rotation < totalRotation) {
                requestAnimationFrame(animate);
            } else {
                const normalizedRotation = rotation % (2 * Math.PI);
                const winningSegment = Math.floor(normalizedRotation / segmentAngle);
                const winningPrize = prizes[winningSegment];
                
                // Save the win
                saveUserWin(winningPrize.name, winningPrize.value);
                
                // Show win notification
                setTimeout(() => {
                    showWinNotification(winningPrize.name, winningPrize.value);
                    startCountdown();
                }, 500);
            }
        }
        
        animate();
    });
}

// Save user win to localStorage
function saveUserWin(prize, value) {
    let userWins = JSON.parse(localStorage.getItem('trustcade_wins')) || [];
    
    const newWin = {
        id: Date.now(),
        prize: prize,
        value: value,
        date: new Date().toISOString().split('T')[0],
        status: "pending",
        claimCode: `TC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        requiresVerification: parseInt(value.replace('$', '')) > 100
    };
    
    userWins.push(newWin);
    localStorage.setItem('trustcade_wins', JSON.stringify(userWins));
    
    return newWin;
}

// Show win notification
function showWinNotification(prize, value) {
    const notification = document.createElement('div');
    notification.className = 'win-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-trophy"></i>
            <div>
                <h4>🎉 You Won: ${prize}!</h4>
                <p>Value: ${value}</p>
                <p>Check your profile to claim</p>
                <a href="profile.html" class="view-prize-btn">View in Profile</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 10000);
}

// Leaderboard data
const leaderboardData = [
    { name: "Alex Johnson", wins: 8, value: 5850, avatar: "AJ" },
    { name: "Maria Garcia", wins: 6, value: 4200, avatar: "MG" },
    { name: "David Chen", wins: 5, value: 3500, avatar: "DC" },
    { name: "Sarah Williams", wins: 4, value: 2800, avatar: "SW" },
    { name: "Mike Thompson", wins: 3, value: 2100, avatar: "MT" }
];

// Display leaderboard
function displayLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    
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
                </div>
            </div>
            <div>
                <strong>${player.wins}</strong> wins
            </div>
            <div>
                <strong>$${player.value.toLocaleString()}</strong>
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

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    displayRecentWinners();
    startCountdown();
    initializeWheel();
    displayLeaderboard();
    
    // Check if user is logged in
    const user = localStorage.getItem('trustcade_user');
    if (user) {
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Profile';
            loginBtn.href = 'profile.html';
        }
    }
});
l// Main JavaScript for TrustCade - UPDATED VERSION

// Prize segments for the wheel
const prizes = [
    { name: "iPhone 17", value: "$1299" },
    { name: "$500 Cash", value: "$500" },
    { name: "Headphones", value: "$299" },
    { name: "Try Again", value: "$0" },
    { name: "PlayStation 5", value: "$499" },
    { name: "$100 Gift Card", value: "$100" },
    { name: "Smart Watch", value: "$399" },
    { name: "MacBook Pro", value: "$1599" }
];

// Generate fake winners for homepage
function generateRecentWinners(count = 8) {
    const firstNames = ["Alex", "Jamie", "Taylor", "Morgan", "Casey", "Jordan", "Riley", "Quinn"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
    const prizeItems = [
        { name: "iPhone 15", value: "$999" },
        { name: "PlayStation 5", value: "$499" },
        { name: "$1000 Cash", value: "$1000" },
        { name: "Laptop", value: "$899" },
        { name: "Headphones", value: "$299" },
        { name: "Smart TV", value: "$699" }
    ];
    
    const winners = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const prize = prizeItems[Math.floor(Math.random() * prizeItems.length)];
        const time = `${Math.floor(Math.random() * 24)}h ago`;
        
        winners.push({
            name: `${firstName} ${lastName}`,
            prize: prize.name,
            value: prize.value,
            time: time,
            initial: firstName[0] + lastName[0]
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
            <small class="win-time">${winner.time}</small>
        </div>
    `).join('');
}

// Countdown Timer
function startCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const spinButton = document.getElementById('spinButton');
    
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
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        spinButton.disabled = true;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Spin Wheel Animation
function initializeWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const spinButton = document.getElementById('spinButton');
    
    if (!canvas || !spinButton) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw wheel segments
        const segmentAngle = (2 * Math.PI) / prizes.length;
        
        for (let i = 0; i < prizes.length; i++) {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            
            // Alternate colors
            ctx.fillStyle = i % 2 === 0 ? '#8B5CF6' : '#10B981';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = '16px Poppins';
            ctx.fillText(prizes[i].name, radius - 20, 10);
            ctx.restore();
        }
        
        // Draw center circle
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('SPIN', centerX, centerY + 8);
    }
    
    drawWheel();
    
    // Spin functionality
    spinButton.addEventListener('click', function() {
        if (this.disabled) return;
        
        // Check if user is logged in
        const user = localStorage.getItem('trustcade_user');
        if (!user) {
            alert('Please login first to spin!');
            window.location.href = 'login.html';
            return;
        }
        
        this.disabled = true;
        
        // Update spin count
        let spinsUsed = parseInt(localStorage.getItem('trustcade_spins')) || 0;
        localStorage.setItem('trustcade_spins', spinsUsed + 1);
        
        // Set next spin time
        const nextSpinTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('trustcade_nextSpin', nextSpinTime);
        
        // Spin animation
        let rotation = 0;
        const spins = 5 + Math.random() * 3;
        const totalRotation = spins * 2 * Math.PI;
        const segmentAngle = (2 * Math.PI) / prizes.length;
        
        function animate() {
            rotation += 0.1;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
            drawWheel();
            ctx.restore();
            
            if (rotation < totalRotation) {
                requestAnimationFrame(animate);
            } else {
                const normalizedRotation = rotation % (2 * Math.PI);
                const winningSegment = Math.floor(normalizedRotation / segmentAngle);
                const winningPrize = prizes[winningSegment];
                
                // Save the win
                const newWin = saveUserWin(winningPrize.name, winningPrize.value);
                
                // Show win notification
                setTimeout(() => {
                    showWinNotification(winningPrize.name, winningPrize.value, newWin.claimCode);
                    startCountdown(); // Reset timer
                }, 500);
            }
        }
        
        animate();
    });
}

// Save user win to localStorage
function saveUserWin(prize, value) {
    let userWins = JSON.parse(localStorage.getItem('trustcade_wins')) || [];
    
    const newWin = {
        id: Date.now(),
        prize: prize,
        value: value,
        date: new Date().toLocaleDateString(),
        status: "pending",
        claimCode: `TC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        requiresVerification: parseInt(value.replace('$', '')) > 100
    };
    
    userWins.push(newWin);
    localStorage.setItem('trustcade_wins', JSON.stringify(userWins));
    
    return newWin;
}

// Show win notification
function showWinNotification(prize, value, claimCode) {
    const notification = document.createElement('div');
    notification.className = 'win-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-trophy"></i>
            <div>
                <h4>🎉 You Won: ${prize}!</h4>
                <p>Value: ${value}</p>
                <p>Claim Code: ${claimCode}</p>
                <a href="profile.html" class="view-prize-btn">View in Profile</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 10000);
}

// Leaderboard data
const leaderboardData = [
    { name: "Alex Johnson", wins: 8, value: 5850, avatar: "AJ" },
    { name: "Maria Garcia", wins: 6, value: 4200, avatar: "MG" },
    { name: "David Chen", wins: 5, value: 3500, avatar: "DC" },
    { name: "Sarah Williams", wins: 4, value: 2800, avatar: "SW" },
    { name: "Mike Thompson", wins: 3, value: 2100, avatar: "MT" }
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
                </div>
            </div>
            <div>
                <strong>${player.wins}</strong> wins
            </div>
            <div>
                <strong>$${player.value.toLocaleString()}</strong>
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

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    displayRecentWinners();
    startCountdown();
    initializeWheel();
    displayLeaderboard();
    
    // Update login button based on auth status
    updateAuthUI();
});

// Update authentication UI
function updateAuthUI() {
    const user = localStorage.getItem('trustcade_user');
    const loginBtn = document.querySelector('a.btn-login');
    
    if (!loginBtn) return;
    
    if (user) {
        const userData = JSON.parse(user);
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Profile';
        loginBtn.href = 'profile.html';
        loginBtn.classList.remove('btn-login');
        loginBtn.classList.add('btn-profile');
    }
}

// Make functions available globally
window.saveUserWin = saveUserWin;
window.showWinNotification = showWinNotification;
