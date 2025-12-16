// TrustCade - Complete JavaScript
// Version 2.0 - Optimized for Mobile

// ========== CONFIGURATION ==========
const CONFIG = {
    FREE_SPIN_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    SPIN_ANIMATION_DURATION: 5000, // 5 seconds
    WIN_RATE: 0.125, // 12.5% win rate
    MIN_PRIZE_VALUE: 0,
    MAX_PRIZE_VALUE: 1599,
    REFRESH_INTERVAL: 60000 // 1 minute
};

// ========== DATA MODELS ==========
const prizes = [
    { name: "iPhone 17", value: "$1299", color: "#8B5CF6", weight: 2 },
    { name: "$500 Cash", value: "$500", color: "#10B981", weight: 2 },
    { name: "Headphones", value: "$299", color: "#3B82F6", weight: 2 },
    { name: "Try Again", value: "$0", color: "#6B7280", weight: 1 },
    { name: "PlayStation 5", value: "$499", color: "#EF4444", weight: 2 },
    { name: "$100 Gift Card", value: "$100", color: "#F59E0B", weight: 2 },
    { name: "Smart Watch", value: "$399", color: "#8B5CF6", weight: 2 },
    { name: "MacBook Pro", value: "$1599", color: "#10B981", weight: 2 }
];

// ========== UTILITY FUNCTIONS ==========
const utils = {
    // Format numbers with commas
    formatNumber: (num) => num.toLocaleString(),
    
    // Format currency
    formatCurrency: (amount) => `$${amount.toLocaleString()}`,
    
    // Generate random ID
    generateId: () => Date.now() + Math.random().toString(36).substr(2, 9),
    
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ========== STORAGE MANAGER ==========
const storage = {
    // User data
    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem('trustcade_user'));
        } catch (e) {
            console.error('Error reading user data:', e);
            return null;
        }
    },
    
    setUser: (userData) => {
        try {
            localStorage.setItem('trustcade_user', JSON.stringify(userData));
        } catch (e) {
            console.error('Error saving user data:', e);
        }
    },
    
    // Wins data
    getWins: () => {
        try {
            return JSON.parse(localStorage.getItem('trustcade_wins')) || [];
        } catch (e) {
            console.error('Error reading wins:', e);
            return [];
        }
    },
    
    setWins: (wins) => {
        try {
            localStorage.setItem('trustcade_wins', JSON.stringify(wins));
        } catch (e) {
            console.error('Error saving wins:', e);
        }
    },
    
    // Next spin time
    getNextSpin: () => {
        const nextSpin = localStorage.getItem('trustcade_nextSpin');
        return nextSpin ? parseInt(nextSpin) : Date.now() + CONFIG.FREE_SPIN_INTERVAL;
    },
    
    setNextSpin: (time) => {
        localStorage.setItem('trustcade_nextSpin', time.toString());
    },
    
    // Spin count
    getSpinCount: () => {
        return parseInt(localStorage.getItem('trustcade_spins')) || 0;
    },
    
    incrementSpinCount: () => {
        const count = storage.getSpinCount() + 1;
        localStorage.setItem('trustcade_spins', count.toString());
        return count;
    },
    
    // Clear all data
    clearAll: () => {
        localStorage.clear();
    }
};

// ========== WHEEL MANAGEMENT ==========
const wheel = {
    canvas: null,
    ctx: null,
    isSpinning: false,
    currentRotation: 0,
    animationId: null,
    
    init: () => {
        wheel.canvas = document.getElementById('wheelCanvas');
        if (!wheel.canvas) return;
        
        wheel.ctx = wheel.canvas.getContext('2d');
        wheel.resizeCanvas();
        wheel.draw();
        
        // Handle window resize
        window.addEventListener('resize', utils.throttle(wheel.resizeCanvas, 250));
        
        // Add spin button event
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            spinButton.addEventListener('click', wheel.spin);
        }
    },
    
    resizeCanvas: () => {
        if (!wheel.canvas) return;
        
        const container = wheel.canvas.parentElement;
        if (!container) return;
        
        const size = Math.min(container.clientWidth, container.clientHeight) * 0.9;
        wheel.canvas.width = size;
        wheel.canvas.height = size;
        wheel.draw();
    },
    
    draw: (rotation = 0) => {
        if (!wheel.canvas || !wheel.ctx) return;
        
        const ctx = wheel.ctx;
        const centerX = wheel.canvas.width / 2;
        const centerY = wheel.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.9;
        
        // Clear canvas
        ctx.clearRect(0, 0, wheel.canvas.width, wheel.canvas.height);
        
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
            ctx.stroke();
            
            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            
            // Adjust font size based on canvas size
            const fontSize = Math.max(10, radius / 20);
            const valueFontSize = Math.max(8, fontSize * 0.7);
            
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = `bold ${fontSize}px Poppins`;
            ctx.fillText(prizes[i].name, radius - (radius * 0.15), 0);
            
            // Draw value
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = `${valueFontSize}px Poppins`;
            ctx.fillText(prizes[i].value, radius - (radius * 0.15), fontSize);
            ctx.restore();
        }
        
        // Draw center circle
        const centerGradient = ctx.createRadialGradient(
            centerX, centerY, 5,
            centerX, centerY, radius * 0.15
        );
        centerGradient.addColorStop(0, '#FF6B6B');
        centerGradient.addColorStop(1, '#EF4444');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw center text
        const centerFontSize = Math.max(12, radius * 0.06);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${centerFontSize}px Poppins`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SPIN', centerX, centerY);
        
        // Draw center border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
    },
    
    spin: () => {
        if (wheel.isSpinning) return;
        
        // Check authentication
        if (!auth.check()) {
            modals.showLogin();
            return;
        }
        
        // Check if spin is available
        const nextSpin = storage.getNextSpin();
        if (Date.now() < nextSpin) {
            notifications.show('Please wait for your next free spin!', 'info');
            return;
        }
        
        // Start spin animation
        wheel.isSpinning = true;
        const spinButton = document.getElementById('spinButton');
        if (spinButton) spinButton.disabled = true;
        
        // Increment spin count
        storage.incrementSpinCount();
        
        // Set next spin time
        storage.setNextSpin(Date.now() + CONFIG.FREE_SPIN_INTERVAL);
        
        // Determine winning prize
        const winningPrize = wheel.selectWinningPrize();
        
        // Calculate animation parameters
        const spins = 5 + Math.random() * 3;
        const segmentAngle = (2 * Math.PI) / prizes.length;
        const targetRotation = spins * 2 * Math.PI + 
            (prizes.indexOf(winningPrize) * segmentAngle) + 
            (segmentAngle / 2);
        
        // Animate spin
        wheel.animateSpin(targetRotation, winningPrize);
        
        // Update countdown timer
        countdown.update();
    },
    
    selectWinningPrize: () => {
        // Create weighted array
        const weightedPrizes = [];
        prizes.forEach((prize, index) => {
            for (let i = 0; i < prize.weight; i++) {
                weightedPrizes.push(index);
            }
        });
        
        const winningIndex = weightedPrizes[Math.floor(Math.random() * weightedPrizes.length)];
        return prizes[winningIndex];
    },
    
    animateSpin: (targetRotation, winningPrize) => {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / CONFIG.SPIN_ANIMATION_DURATION, 1);
            
            // Cubic ease-out for smooth deceleration
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            // Update rotation
            wheel.currentRotation = easedProgress * targetRotation;
            wheel.draw(wheel.currentRotation);
            
            if (progress < 1) {
                wheel.animationId = requestAnimationFrame(animate);
            } else {
                // Animation complete
                wheel.isSpinning = false;
                
                // Save win and show notification
                setTimeout(() => {
                    const winData = wins.addWin(winningPrize);
                    notifications.showWin(winningPrize.name, winningPrize.value, winData.claimCode);
                    
                    // Re-enable spin button
                    const spinButton = document.getElementById('spinButton');
                    if (spinButton) spinButton.disabled = true; // Will be re-enabled by countdown
                }, 500);
            }
        };
        
        wheel.animationId = requestAnimationFrame(animate);
    },
    
    stopAnimation: () => {
        if (wheel.animationId) {
            cancelAnimationFrame(wheel.animationId);
            wheel.isSpinning = false;
        }
    }
};

// ========== COUNTDOWN TIMER ==========
const countdown = {
    elements: {},
    
    init: () => {
        countdown.elements = {
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            spinButton: document.getElementById('spinButton'),
            timeLeft: document.getElementById('timeLeft'),
            nextSpinTime: document.getElementById('nextSpinTime'),
            spinProgress: document.getElementById('spinProgress')
        };
        
        countdown.update();
        setInterval(countdown.update, 1000);
    },
    
    update: () => {
        const now = Date.now();
        const nextSpin = storage.getNextSpin();
        const timeLeft = nextSpin - now;
        
        if (timeLeft <= 0) {
            countdown.setReadyState();
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update time display
        if (countdown.elements.hours) {
            countdown.elements.hours.textContent = hours.toString().padStart(2, '0');
        }
        if (countdown.elements.minutes) {
            countdown.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        }
        if (countdown.elements.seconds) {
            countdown.elements.seconds.textContent = seconds.toString().padStart(2, '0');
        }
        if (countdown.elements.timeLeft) {
            countdown.elements.timeLeft.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update progress bar
        const progressPercent = 100 - ((timeLeft / CONFIG.FREE_SPIN_INTERVAL) * 100);
        if (countdown.elements.spinProgress) {
            countdown.elements.spinProgress.style.width = `${progressPercent}%`;
        }
        
        // Update next spin time
        if (countdown.elements.nextSpinTime) {
            const nextDate = new Date(nextSpin);
            countdown.elements.nextSpinTime.textContent = 
                nextDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Disable spin button
        if (countdown.elements.spinButton) {
            countdown.elements.spinButton.disabled = true;
            countdown.elements.spinButton.innerHTML = `
                <i class="fas fa-redo"></i> SPIN NOW
                <span class="btn-subtext">Free spin available in <span id="timeLeft">${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span></span>
            `;
        }
    },
    
    setReadyState: () => {
        if (countdown.elements.spinButton) {
            countdown.elements.spinButton.disabled = false;
            countdown.elements.spinButton.innerHTML = `
                <i class="fas fa-redo"></i> SPIN NOW!
                <span class="btn-subtext">Free spin available!</span>
            `;
        }
        
        if (countdown.elements.hours) countdown.elements.hours.textContent = '00';
        if (countdown.elements.minutes) countdown.elements.minutes.textContent = '00';
        if (countdown.elements.seconds) countdown.elements.seconds.textContent = '00';
        if (countdown.elements.timeLeft) countdown.elements.timeLeft.textContent = 'Ready!';
        if (countdown.elements.spinProgress) countdown.elements.spinProgress.style.width = '100%';
    }
};

// ========== WINS MANAGEMENT ==========
const wins = {
    addWin: (prize) => {
        const userWins = storage.getWins();
        
        const newWin = {
            id: utils.generateId(),
            prize: prize.name,
            value: prize.value,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            time: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            timestamp: Date.now(),
            status: "pending",
            claimCode: `TC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            requiresVerification: parseInt(prize.value.replace(/\$|,/g, '')) > 100
        };
        
        userWins.push(newWin);
        storage.setWins(userWins);
        stats.update();
        
        return newWin;
    },
    
    getRecentWins: (limit = 8) => {
        const userWins = storage.getWins();
        return userWins
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    },
    
    getTotalValue: () => {
        const userWins = storage.getWins();
        return userWins.reduce((total, win) => {
            const value = parseInt(win.value.replace(/\$|,/g, '')) || 0;
            return total + value;
        }, 0);
    },
    
    getWinCount: () => {
        return storage.getWins().length;
    }
};

// ========== STATISTICS ==========
const stats = {
    init: () => {
        stats.update();
        setInterval(stats.update, CONFIG.REFRESH_INTERVAL);
    },
    
    update: () => {
        // Update user stats
        const userWins = storage.getWins();
        const totalWins = userWins.length;
        const totalValue = wins.getTotalValue();
        
        // Save stats
        localStorage.setItem('trustcade_user_stats', JSON.stringify({
            totalWins,
            totalValue,
            lastUpdated: new Date().toISOString()
        }));
        
        // Update live stats display
        stats.updateLiveStats();
    },
    
    updateLiveStats: () => {
        const elements = {
            totalWinners: document.getElementById('totalWinners'),
            totalValue: document.getElementById('totalValue'),
            winsToday: document.getElementById('winsToday'),
            winRate: document.getElementById('winRate'),
            lastUpdated: document.getElementById('lastUpdated'),
            leaderboardUpdate: document.getElementById('leaderboardUpdate')
        };
        
        // Generate realistic live stats
        const baseStats = {
            totalWinners: 5247,
            totalValue: 892450,
            winsToday: 324
        };
        
        // Add some randomness to make it look live
        const now = new Date();
        const hourMultiplier = now.getHours() / 24; // More activity during daytime
        const randomFactor = 1 + (Math.random() * 0.2 - 0.1); // ±10% random
        
        const liveStats = {
            totalWinners: Math.floor(baseStats.totalWinners * (1 + hourMultiplier * 0.1) * randomFactor),
            totalValue: Math.floor(baseStats.totalValue * (1 + hourMultiplier * 0.15) * randomFactor),
            winsToday: Math.floor(baseStats.winsToday * (1 + hourMultiplier * 0.2) * randomFactor),
            winRate: "1:8"
        };
        
        // Update DOM
        if (elements.totalWinners) {
            elements.totalWinners.textContent = utils.formatNumber(liveStats.totalWinners);
        }
        if (elements.totalValue) {
            elements.totalValue.textContent = utils.formatCurrency(liveStats.totalValue);
        }
        if (elements.winsToday) {
            elements.winsToday.textContent = liveStats.winsToday;
        }
        if (elements.winRate) {
            elements.winRate.textContent = liveStats.winRate;
        }
        if (elements.lastUpdated) {
            elements.lastUpdated.textContent = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
        }
        if (elements.leaderboardUpdate) {
            elements.leaderboardUpdate.textContent = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
            });
        }
    },
    
    // Grand prize timer
    initGrandPrizeTimer: () => {
        const timerElement = document.getElementById('grandPrizeTimer');
        if (!timerElement) return;
        
        // Set next draw to 8 PM
        const now = new Date();
        const nextDraw = new Date();
        nextDraw.setHours(20, 0, 0, 0);
        
        if (now > nextDraw) {
            nextDraw.setDate(nextDraw.getDate() + 1);
        }
        
        const updateTimer = () => {
            const now = new Date();
            const timeLeft = nextDraw - now;
            
            if (timeLeft <= 0) {
                timerElement.textContent = "Drawing now!";
                return;
            }
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }
};

// ========== AUTHENTICATION ==========
const auth = {
    check: () => {
        return !!storage.getUser();
    },
    
    login: (email, password) => {
        // In a real app, this would be an API call
        if (email && password) {
            const userData = {
                email: email,
                name: email.split('@')[0],
                joined: new Date().toISOString(),
                verified: false,
                id: utils.generateId()
            };
            
            storage.setUser(userData);
            auth.updateUI();
            return { success: true, user: userData };
        }
        return { success: false, error: 'Please enter both email and password.' };
    },
    
    logout: () => {
        storage.setUser(null);
        auth.updateUI();
    },
    
    updateUI: () => {
        const user = storage.getUser();
        const loginBtn = document.getElementById('loginBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        const profileBtn = document.getElementById('profileBtn');
        
        if (user) {
            // User is logged in
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-user"></i> Profile';
                loginBtn.href = 'profile.html';
                loginBtn.id = 'profileBtn';
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.innerHTML = '<i class="fas fa-user"></i> Profile';
                mobileLoginBtn.href = 'profile.html';
            }
        } else {
            // User is logged out
            if (profileBtn) {
                profileBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                profileBtn.href = 'login.html';
                profileBtn.id = 'loginBtn';
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                mobileLoginBtn.href = 'login.html';
            }
        }
    }
};

// ========== NOTIFICATIONS ==========
const notifications = {
    show: (message, type = 'info') => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    },
    
    showWin: (prize, value, claimCode) => {
        const notification = document.getElementById('winNotification');
        if (!notification) return;
        
        // Update content
        const wonPrizeElement = notification.querySelector('#wonPrize');
        const wonValueElement = notification.querySelector('#wonValue');
        
        if (wonPrizeElement) wonPrizeElement.textContent = prize;
        if (wonValueElement) wonValueElement.textContent = value;
        
        // Show notification
        notification.classList.add('show');
        
        // Auto hide
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
                if (auth.check()) {
                    window.location.href = 'profile.html';
                } else {
                    modals.showLogin();
                }
            };
        }
        
        // Log win for debugging
        console.log(`🎉 User won: ${prize} (${value}) - Claim Code: ${claimCode}`);
    }
};

// ========== MODALS ==========
const modals = {
    showLogin: () => {
        const modal = document.getElementById('loginModal');
        if (!modal) {
            // Fallback: redirect to login page
            window.location.href = 'login.html';
            return;
        }
        
        modal.classList.add('show');
        
        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('show');
        }
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
        
        // Handle form submission
        const form = modal.querySelector('#quickLoginForm');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                const password = form.querySelector('input[type="password"]').value;
                
                const result = auth.login(email, password);
                if (result.success) {
                    modal.classList.remove('show');
                    notifications.show('Login successful! You can now spin the wheel.', 'success');
                } else {
                    notifications.show(result.error, 'error');
                }
            };
        }
        
        // Social login buttons
        const socialButtons = modal.querySelectorAll('.login-option-btn');
        socialButtons.forEach(button => {
            button.addEventListener('click', () => {
                notifications.show('Social login would be implemented in a production app.', 'info');
            });
        });
    }
};

// ========== MOBILE MENU ==========
const mobileMenu = {
    init: () => {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const menu = document.getElementById('mobileMenu');
        const closeBtn = document.getElementById('mobileMenuClose');
        
        if (!menuBtn || !menu) return;
        
        // Open menu
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close menu
        const closeMenu = () => {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close when clicking links (optional delay)
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 300); // Small delay for better UX
            });
        });
    }
};

// ========== UI COMPONENTS ==========
const ui = {
    initRecentWinners: () => {
        const winnersGrid = document.getElementById('recentWinnersGrid');
        if (!winnersGrid) return;
        
        const winners = [
            { name: "LuckyStar23", prize: "iPhone 17 Pro", value: "$1,299", time: "2 minutes ago", initial: "LS" },
            { name: "MikeWins", prize: "$500 Cash", value: "$500", time: "15 minutes ago", initial: "MW" },
            { name: "SarahG", prize: "PS5 Pro", value: "$499", time: "1 hour ago", initial: "SG" },
            { name: "JohnDoe", prize: "MacBook Pro", value: "$1,599", time: "3 hours ago", initial: "JD" },
            { name: "PrizeHunter", prize: "AirPods Pro", value: "$249", time: "5 hours ago", initial: "PH" },
            { name: "WinMaster", prize: "$100 Gift Card", value: "$100", time: "8 hours ago", initial: "WM" },
            { name: "GamerGirl", prize: "Nintendo Switch", value: "$299", time: "1 day ago", initial: "GG" },
            { name: "SpinKing", prize: "Smart Watch", value: "$399", time: "1 day ago", initial: "SK" }
        ];
        
        winnersGrid.innerHTML = winners.map(winner => `
            <div class="winner-card">
                <div class="winner-avatar">${winner.initial}</div>
                <div class="winner-info">
                    <h4>${winner.name}</h4>
                    <p class="winner-prize">${winner.prize}</p>
                    <span class="winner-time"><i class="far fa-clock"></i> ${winner.time}</span>
                </div>
            </div>
        `).join('');
    },
    
    initLeaderboard: () => {
        const leaderboard = document.getElementById('leaderboard');
        if (!leaderboard) return;
        
        const leaderboardData = [
            { rank: 1, name: "LuckyStar23", wins: 47, value: 12450, avatar: "LS", status: "verified" },
            { rank: 2, name: "PrizeHunter", wins: 32, value: 8760, avatar: "PH", status: "verified" },
            { rank: 3, name: "WinMaster", wins: 28, value: 7230, avatar: "WM", status: "verified" },
            { rank: 4, name: "SarahG", wins: 25, value: 6450, avatar: "SG", status: "verified" },
            { rank: 5, name: "MikeWins", wins: 22, value: 5890, avatar: "MW", status: "pending" }
        ];
        
        leaderboard.innerHTML = leaderboardData.map(player => `
            <div class="leaderboard-item" role="listitem">
                <span class="rank ${player.rank <= 3 ? ['gold', 'silver', 'bronze'][player.rank - 1] : ''}">
                    ${player.rank}
                </span>
                <span class="player">
                    <i class="fas fa-${player.rank === 1 ? 'crown' : 'user'}"></i> ${player.name}
                </span>
                <span class="wins">${player.wins} wins</span>
                <span class="value">$${utils.formatNumber(player.value)}</span>
                <span class="status ${player.status}">${player.status}</span>
            </div>
        `).join('');
    },
    
    initNewsletter: () => {
        const newsletterForm = document.querySelector('.newsletter-input');
        if (!newsletterForm) return;
        
        const input = newsletterForm.querySelector('input[type="email"]');
        const button = newsletterForm.querySelector('button');
        
        const handleSubmit = () => {
            const email = input.value.trim();
            
            if (!email || !email.includes('@')) {
                notifications.show('Please enter a valid email address.', 'error');
                return;
            }
            
            // In a real app, this would be an API call
            notifications.show('Thank you for subscribing to our newsletter!', 'success');
            input.value = '';
            
            // Log subscription
            const subscriptions = JSON.parse(localStorage.getItem('trustcade_newsletter') || '[]');
            subscriptions.push({ email, date: new Date().toISOString() });
            localStorage.setItem('trustcade_newsletter', JSON.stringify(subscriptions));
        };
        
        button.addEventListener('click', handleSubmit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        });
    },
    
    initSmoothScrolling: () => {
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
    },
    
    initBackToTop: () => {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };
        
        window.addEventListener('scroll', utils.throttle(toggleVisibility, 100));
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    initRefreshButtons: () => {
        // Leaderboard refresh
        const refreshLeaderboardBtn = document.getElementById('refreshLeaderboard');
        if (refreshLeaderboardBtn) {
            refreshLeaderboardBtn.addEventListener('click', () => {
                ui.initLeaderboard();
                notifications.show('Leaderboard refreshed!', 'success');
            });
        }
        
        // Stats refresh
        const refreshStatsBtn = document.getElementById('refreshStats');
        if (refreshStatsBtn) {
            refreshStatsBtn.addEventListener('click', () => {
                stats.updateLiveStats();
                notifications.show('Statistics updated!', 'success');
            });
        }
    }
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen (if present)
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 500);
    }
    
    // Initialize all components
    wheel.init();
    countdown.init();
    stats.init();
    stats.initGrandPrizeTimer();
    mobileMenu.init();
    auth.updateUI();
    ui.initRecentWinners();
    ui.initLeaderboard();
    ui.initNewsletter();
    ui.initSmoothScrolling();
    ui.initBackToTop();
    ui.initRefreshButtons();
    
    // Setup login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            if (auth.check()) {
                // Already logged in, go to profile
                window.location.href = 'profile.html';
            } else {
                // Not logged in, show modal or go to login page
                if (window.location.pathname.includes('index.html') || 
                    window.location.pathname === '/') {
                    e.preventDefault();
                    modals.showLogin();
                }
                // Otherwise, default link behavior to login.html
            }
        });
    }
    
    // Setup profile button (if created by auth.updateUI)
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            if (!auth.check()) {
                e.preventDefault();
                modals.showLogin();
            }
        });
    }
    
    // Check online status
    window.addEventListener('online', () => {
        notifications.show('You are back online!', 'success');
    });
    
    window.addEventListener('offline', () => {
        notifications.show('You are offline. Some features may not work.', 'error');
    });
    
    // Log initialization
    console.log('TrustCade initialized successfully!');
    console.log('Features loaded:', {
        wheel: !!wheel.canvas,
        countdown: !!countdown.elements.spinButton,
        auth: auth.check(),
        wins: wins.getWinCount()
    });
});

// ========== GLOBAL EXPORTS ==========
// Make key functions available globally
window.TrustCade = {
    wheel,
    auth,
    wins,
    stats,
    notifications,
    utils
};

// Development helper: Reset all data
window.resetTrustCadeData = () => {
    if (confirm('Are you sure you want to reset all TrustCade data?')) {
        storage.clearAll();
        location.reload();
    }
};

// Development helper: Add test win
window.addTestWin = (prizeName = 'iPhone 17') => {
    const prize = prizes.find(p => p.name.includes(prizeName)) || prizes[0];
    const winData = wins.addWin(prize);
    notifications.showWin(prize.name, prize.value, winData.claimCode);
    return winData;
};
