// ================================================
// TrustCade Main Application Script
// ================================================
// Integrates with TrustCadeAPI for all backend operations
// ================================================

class TrustCadeApp {
    constructor() {
        this.currentUser = null;
        this.currentSession = null;
        this.spinWheel = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    // ================================================
    // INITIALIZATION
    // ================================================
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeApp();
        });
    }
    
    async initializeApp() {
        try {
            // Check for existing session
            await this.checkSession();
            
            // Initialize UI components
            this.initUI();
            
            // Load initial data
            await this.loadInitialData();
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('TrustCade App initialized');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application');
        }
    }
    
    // ================================================
    // SESSION MANAGEMENT
    // ================================================
    async checkSession() {
        try {
            // Check localStorage first (for "remember me")
            let session = localStorage.getItem('trustcade_session');
            if (!session) {
                // Check sessionStorage
                session = sessionStorage.getItem('trustcade_session');
            }
            
            if (session) {
                const sessionData = JSON.parse(session);
                const response = await TrustCadeAPI.auth.verifySession(sessionData.token);
                
                if (response.success) {
                    this.currentSession = response.data.session;
                    this.currentUser = response.data.user;
                    this.updateUIForLoggedInUser();
                    return true;
                } else {
                    // Clear invalid session
                    localStorage.removeItem('trustcade_session');
                    sessionStorage.removeItem('trustcade_session');
                    this.currentUser = null;
                    this.currentSession = null;
                }
            }
            
            return false;
            
        } catch (error) {
            console.error('Session check error:', error);
            return false;
        }
    }
    
    async login(email, password, rememberMe = false) {
        try {
            this.showLoading('loginButton', 'Logging in...');
            
            const response = await TrustCadeAPI.auth.login(email, password, rememberMe);
            
            if (response.success) {
                this.currentUser = response.data.user;
                this.currentSession = response.data.session;
                
                // Store session based on remember me choice
                if (rememberMe) {
                    localStorage.setItem('trustcade_session', JSON.stringify(this.currentSession));
                } else {
                    sessionStorage.setItem('trustcade_session', JSON.stringify(this.currentSession));
                }
                
                this.updateUIForLoggedInUser();
                this.showSuccess('Login successful!');
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                this.showError(response.error || 'Login failed');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please try again.');
        } finally {
            this.hideLoading('loginButton', 'Login');
        }
    }
    
    async logout() {
        try {
            if (this.currentSession) {
                await TrustCadeAPI.auth.logout(this.currentSession.token);
            }
            
            // Clear client-side storage
            localStorage.removeItem('trustcade_session');
            sessionStorage.removeItem('trustcade_session');
            
            this.currentUser = null;
            this.currentSession = null;
            
            this.updateUIForLoggedOutUser();
            this.showSuccess('Logged out successfully');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Logout error:', error);
            this.showError('Logout failed');
        }
    }
    
    // ================================================
    // SPIN WHEEL FUNCTIONALITY
    // ================================================
    initSpinWheel() {
        if (!document.getElementById('wheelCanvas')) return;
        
        this.spinWheel = {
            canvas: document.getElementById('wheelCanvas'),
            ctx: null,
            prizes: [],
            isSpinning: false,
            lastSpinTime: null,
            
            init: async function() {
                this.ctx = this.canvas.getContext('2d');
                
                // Load prizes from API
                const response = await TrustCadeAPI.spin.getPrizes();
                if (response.success) {
                    this.prizes = response.data;
                    this.drawWheel();
                }
                
                // Check last spin time
                await this.checkLastSpin();
            },
            
            drawWheel: function() {
                if (!this.ctx || this.prizes.length === 0) return;
                
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const radius = Math.min(centerX, centerY) - 10;
                const sliceAngle = (2 * Math.PI) / this.prizes.length;
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Colors for slices
                const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#073B4C', '#7209B7'];
                
                // Draw each slice
                for (let i = 0; i < this.prizes.length; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle);
                    this.ctx.closePath();
                    
                    // Fill with color
                    this.ctx.fillStyle = colors[i % colors.length];
                    this.ctx.fill();
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    
                    // Draw text
                    this.ctx.save();
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(i * sliceAngle + sliceAngle / 2);
                    this.ctx.textAlign = 'right';
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 14px Arial';
                    
                    // Shorten long prize names
                    let prizeName = this.prizes[i].name;
                    if (prizeName.length > 10) {
                        prizeName = prizeName.substring(0, 8) + '..';
                    }
                    
                    this.ctx.fillText(prizeName, radius - 15, 5);
                    this.ctx.restore();
                }
                
                // Draw center circle
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
                this.ctx.fillStyle = '#2D3748';
                this.ctx.fill();
                this.ctx.strokeStyle = '#FFFFFF';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            },
            
            async checkLastSpin() {
                if (!TrustCadeApp.instance.currentUser) return;
                
                const response = await TrustCadeAPI.spin.getUserSpins(TrustCadeApp.instance.currentUser.id);
                if (response.success && response.data.length > 0) {
                    const lastSpin = response.data[0];
                    this.lastSpinTime = new Date(lastSpin.timestamp);
                    this.updateSpinButton();
                }
            },
            
            updateSpinButton() {
                const spinBtn = document.getElementById('spinButton');
                if (!spinBtn) return;
                
                if (!TrustCadeApp.instance.currentUser) {
                    spinBtn.disabled = true;
                    spinBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Spin';
                    return;
                }
                
                if (this.isSpinning) {
                    spinBtn.disabled = true;
                    spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SPINNING...';
                    return;
                }
                
                if (this.canUserSpin()) {
                    spinBtn.disabled = false;
                    spinBtn.innerHTML = '<i class="fas fa-redo"></i> SPIN NOW';
                    if (spinBtn.querySelector('.btn-subtext')) {
                        spinBtn.querySelector('.btn-subtext').textContent = 'Free spin available!';
                    }
                } else {
                    spinBtn.disabled = true;
                    const timeLeft = this.getTimeUntilNextSpin();
                    if (spinBtn.querySelector('.btn-subtext')) {
                        spinBtn.querySelector('.btn-subtext').textContent = 
                            `Next spin in ${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`;
                    }
                }
            },
            
            canUserSpin() {
                if (!this.lastSpinTime) return true;
                
                const now = new Date();
                const hoursDiff = (now - this.lastSpinTime) / (1000 * 60 * 60);
                return hoursDiff >= 24;
            },
            
            getTimeUntilNextSpin() {
                if (!this.lastSpinTime) return { hours: 0, minutes: 0, seconds: 0 };
                
                const nextSpin = new Date(this.lastSpinTime.getTime() + (24 * 60 * 60 * 1000));
                const now = new Date();
                
                if (now >= nextSpin) return { hours: 0, minutes: 0, seconds: 0 };
                
                const diff = nextSpin - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                return { hours, minutes, seconds };
            },
            
            async spin() {
                if (this.isSpinning || !this.canUserSpin() || !TrustCadeApp.instance.currentUser) {
                    return;
                }
                
                this.isSpinning = true;
                this.updateSpinButton();
                
                try {
                    const response = await TrustCadeAPI.spin.performSpin(TrustCadeApp.instance.currentUser.id);
                    
                    if (response.success) {
                        this.lastSpinTime = new Date();
                        this.animateSpin(response.data.prize);
                        this.showWinNotification(response.data.prize, response.data.spinRecord);
                        
                        // Update user stats
                        await TrustCadeApp.instance.loadUserProfile();
                        
                    } else {
                        this.showError(response.error || 'Spin failed');
                        this.isSpinning = false;
                        this.updateSpinButton();
                    }
                    
                } catch (error) {
                    console.error('Spin error:', error);
                    this.showError('Spin failed. Please try again.');
                    this.isSpinning = false;
                    this.updateSpinButton();
                }
            },
            
            animateSpin(prize) {
                if (!this.canvas) return;
                
                const spins = 5 + Math.random() * 3; // 5-8 rotations
                const prizeIndex = this.prizes.findIndex(p => p.id === prize.id);
                const totalRotation = spins * 360 + (prizeIndex * (360 / this.prizes.length));
                
                let currentRotation = 0;
                const animate = () => {
                    currentRotation += 15;
                    this.canvas.style.transform = `rotate(${currentRotation}deg)`;
                    
                    if (currentRotation < totalRotation) {
                        requestAnimationFrame(animate);
                    } else {
                        this.isSpinning = false;
                        this.updateSpinButton();
                    }
                };
                
                animate();
            },
            
            showWinNotification(prize, spinRecord) {
                const notification = document.getElementById('winNotification');
                const prizeElement = document.getElementById('wonPrize');
                const valueElement = document.getElementById('wonValue');
                
                if (!notification || !prizeElement || !valueElement) return;
                
                prizeElement.textContent = prize.name;
                valueElement.textContent = `$${prize.value}`;
                
                // Show notification
                notification.hidden = false;
                
                // Auto-hide after 10 seconds
                setTimeout(() => {
                    notification.hidden = true;
                }, 10000);
                
                // Update stats display
                TrustCadeApp.instance.updateStatsDisplay();
            },
            
            showError(message) {
                const app = TrustCadeApp.instance;
                app.showError(message);
            }
        };
        
        // Initialize the spin wheel
        this.spinWheel.init();
    }
    
    // ================================================
    // DATA LOADING
    // ================================================
    async loadInitialData() {
        try {
            // Load recent winners
            await this.loadRecentWinners();
            
            // Load leaderboard
            await this.loadLeaderboard();
            
            // Load stats
            await this.loadStats();
            
            // Load user profile if logged in
            if (this.currentUser) {
                await this.loadUserProfile();
            }
            
            // Initialize spin wheel
            this.initSpinWheel();
            
            // Start countdown timer
            this.startCountdownTimer();
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
    
    async loadRecentWinners() {
        try {
            const response = await TrustCadeAPI.winners.getRecentWinners(6);
            if (response.success) {
                this.displayRecentWinners(response.data);
            }
        } catch (error) {
            console.error('Failed to load recent winners:', error);
        }
    }
    
    async loadLeaderboard() {
        try {
            const response = await TrustCadeAPI.winners.getLeaderboard(10);
            if (response.success) {
                this.displayLeaderboard(response.data);
            }
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        }
    }
    
    async loadStats() {
        try {
            // These would come from API in production
            // For now, update with placeholder data
            this.updateStatsDisplay();
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }
    
    async loadUserProfile() {
        if (!this.currentUser) return;
        
        try {
            const response = await TrustCadeAPI.user.getProfile(this.currentUser.id);
            if (response.success) {
                this.currentUser = response.data.user;
                this.updateUserProfileDisplay(response.data);
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    }
    
    // ================================================
    // UI UPDATES
    // ================================================
    updateUIForLoggedInUser() {
        // Update header
        const loginBtn = document.getElementById('loginBtn');
        const profileLink = document.querySelector('a[href="profile.html"]');
        
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> ' + (this.currentUser?.name || 'Profile');
            loginBtn.onclick = () => window.location.href = 'profile.html';
        }
        
        if (profileLink) {
            profileLink.innerHTML = '<i class="fas fa-user"></i> ' + (this.currentUser?.name || 'My Profile');
        }
        
        // Update mobile menu
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        if (mobileLoginBtn) {
            mobileLoginBtn.innerHTML = '<i class="fas fa-user"></i> ' + (this.currentUser?.name || 'Profile');
            mobileLoginBtn.href = 'profile.html';
        }
        
        // Show user-specific content
        this.showUserContent();
    }
    
    updateUIForLoggedOutUser() {
        // Reset header
        const loginBtn = document.getElementById('loginBtn');
        const profileLink = document.querySelector('a[href="profile.html"]');
        
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.onclick = () => window.location.href = 'login.html';
        }
        
        if (profileLink) {
            profileLink.innerHTML = '<i class="fas fa-user"></i> My Prizes';
        }
        
        // Reset mobile menu
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        if (mobileLoginBtn) {
            mobileLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            mobileLoginBtn.href = 'login.html';
        }
        
        // Hide user-specific content
        this.hideUserContent();
    }
    
    showUserContent() {
        // Show content that requires login
        const userElements = document.querySelectorAll('.requires-login');
        userElements.forEach(el => {
            el.style.display = 'block';
        });
    }
    
    hideUserContent() {
        // Hide content that requires login
        const userElements = document.querySelectorAll('.requires-login');
        userElements.forEach(el => {
            el.style.display = 'none';
        });
    }
    
    displayRecentWinners(winners) {
        const container = document.getElementById('recentWinnersGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        winners.forEach(winner => {
            const card = document.createElement('div');
            card.className = 'winner-card';
            card.innerHTML = `
                <div class="winner-avatar">${winner.userInitial}</div>
                <div class="winner-info">
                    <h4>${winner.userName}</h4>
                    <p class="winner-prize">${winner.prizeName}</p>
                    <span class="winner-time">${this.formatTimeAgo(new Date(winner.winDate))}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    displayLeaderboard(leaderboard) {
        const container = document.getElementById('leaderboard');
        if (!container) return;
        
        container.innerHTML = '';
        
        leaderboard.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            let rankClass = '';
            if (index === 0) rankClass = 'gold';
            else if (index === 1) rankClass = 'silver';
            else if (index === 2) rankClass = 'bronze';
            
            item.innerHTML = `
                <span class="rank ${rankClass}">${player.rank}</span>
                <span class="player">${index === 0 ? '<i class="fas fa-crown"></i> ' : ''}${player.userName}</span>
                <span class="wins">${player.totalWins} wins</span>
                <span class="value">$${player.totalValue.toLocaleString()}</span>
                <span class="status verified">Verified</span>
            `;
            container.appendChild(item);
        });
    }
    
    updateStatsDisplay() {
        // Update live stats
        const stats = {
            totalWinners: this.currentUser?.totalWins || 5247,
            totalValue: this.currentUser?.totalValue || 892450,
            winsToday: 324,
            winRate: '1:8'
        };
        
        document.getElementById('totalWinners')?.textContent = stats.totalWinners.toLocaleString();
        document.getElementById('totalValue')?.textContent = `$${stats.totalValue.toLocaleString()}`;
        document.getElementById('winsToday')?.textContent = stats.winsToday.toLocaleString();
        document.getElementById('winRate')?.textContent = stats.winRate;
        
        // Update last updated time
        document.getElementById('lastUpdated')?.textContent = 'Just now';
    }
    
    updateUserProfileDisplay(profileData) {
        // Update profile page if we're on it
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = profileData.user.name;
            document.getElementById('userEmail').textContent = profileData.user.email;
            document.getElementById('userJoined').textContent = new Date(profileData.user.joined).toLocaleDateString();
            document.getElementById('userSpins').textContent = profileData.stats.totalSpins;
            document.getElementById('userWins').textContent = profileData.stats.totalWins;
            document.getElementById('userValue').textContent = `$${profileData.stats.totalValue.toLocaleString()}`;
            document.getElementById('userWinRate').textContent = `${profileData.stats.winRate}%`;
            
            // Update verification status
            const verifiedBadge = document.getElementById('verifiedBadge');
            if (verifiedBadge) {
                verifiedBadge.style.display = profileData.user.verified ? 'inline-block' : 'none';
            }
            
            // Display recent wins
            this.displayUserWins(profileData.recentWins);
        }
    }
    
    displayUserWins(wins) {
        const container = document.getElementById('userWinsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (wins.length === 0) {
            container.innerHTML = '<div class="no-wins">No wins yet. Start spinning!</div>';
            return;
        }
        
        wins.forEach(win => {
            const item = document.createElement('div');
            item.className = 'win-item';
            item.innerHTML = `
                <div class="win-prize">${win.prizeName}</div>
                <div class="win-value">$${win.prizeValue}</div>
                <div class="win-date">${new Date(win.winDate).toLocaleDateString()}</div>
                <div class="win-status ${win.status}">${win.status.replace('_', ' ')}</div>
            `;
            container.appendChild(item);
        });
    }
    
    // ================================================
    // TIMER & COUNTDOWN
    // ================================================
    startCountdownTimer() {
        const updateTimer = () => {
            if (!this.spinWheel) return;
            
            const timeLeft = this.spinWheel.getTimeUntilNextSpin();
            
            // Update countdown display
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            const progressEl = document.getElementById('spinProgress');
            
            if (hoursEl) hoursEl.textContent = timeLeft.hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = timeLeft.minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = timeLeft.seconds.toString().padStart(2, '0');
            
            // Update progress bar
            if (progressEl) {
                const progress = 100 - ((timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / (24 * 3600) * 100);
                progressEl.style.width = `${progress}%`;
            }
            
            // Update next spin time
            const nextSpinTimeEl = document.getElementById('nextSpinTime');
            if (nextSpinTimeEl) {
                const nextSpin = new Date(Date.now() + (timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) * 1000);
                nextSpinTimeEl.textContent = nextSpin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            
            // Update spin button text
            const timeLeftEl = document.getElementById('timeLeft');
            if (timeLeftEl) {
                timeLeftEl.textContent = `${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`;
            }
        };
        
        // Update immediately
        updateTimer();
        
        // Update every second
        setInterval(updateTimer, 1000);
    }
    
    // ================================================
    // EVENT LISTENERS
    // ================================================
    setupEventListeners() {
        // Spin button
        const spinBtn = document.getElementById('spinButton');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                if (this.spinWheel) {
                    this.spinWheel.spin();
                }
            });
        }
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email')?.value;
                const password = document.getElementById('password')?.value;
                const rememberMe = document.getElementById('remember')?.checked;
                
                if (email && password) {
                    this.login(email, password, rememberMe);
                }
            });
        }
        
        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
        
        // Logout buttons
        const logoutBtns = document.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
            
            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                });
            }
        }
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Win notification close
        const winNotificationClose = document.querySelector('.notification-close');
        if (winNotificationClose) {
            winNotificationClose.addEventListener('click', () => {
                const notification = document.getElementById('winNotification');
                if (notification) {
                    notification.hidden = true;
                }
            });
        }
        
        // Refresh buttons
        const refreshLeaderboard = document.getElementById('refreshLeaderboard');
        if (refreshLeaderboard) {
            refreshLeaderboard.addEventListener('click', () => {
                this.loadLeaderboard();
            });
        }
        
        const refreshStats = document.getElementById('refreshStats');
        if (refreshStats) {
            refreshStats.addEventListener('click', () => {
                this.loadStats();
            });
        }
    }
    
    // ================================================
    // REGISTRATION HANDLING
    // ================================================
    async handleRegistration() {
        try {
            const formData = {
                email: document.getElementById('email')?.value.trim(),
                password: document.getElementById('password')?.value,
                name: document.getElementById('fullName')?.value.trim(),
                phone: document.getElementById('phone')?.value.trim() || null,
                verificationMethod: 'email' // Default, can be changed based on user selection
            };
            
            // Get gift card data if selected
            const verificationMethod = document.querySelector('.verification-option.selected')?.dataset.verification;
            if (verificationMethod === 'giftcard') {
                formData.verificationMethod = 'giftcard';
                formData.giftCard = {
                    type: document.getElementById('giftCardType')?.value,
                    code: document.getElementById('giftCardCode')?.value.trim(),
                    pin: document.getElementById('giftCardPin')?.value.trim() || null
                };
            }
            
            // Validate
            if (!formData.email || !formData.password || !formData.name) {
                this.showError('Please fill in all required fields');
                return;
            }
            
            this.showLoading('completeRegistration', 'Registering...');
            
            const response = await TrustCadeAPI.auth.register(formData);
            
            if (response.success) {
                this.showSuccess('Registration successful!');
                
                // Auto-login
                this.currentUser = response.data.user;
                this.currentSession = response.data.session;
                
                // Store session
                localStorage.setItem('trustcade_session', JSON.stringify(this.currentSession));
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } else {
                this.showError(response.error || 'Registration failed');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('Registration failed. Please try again.');
        } finally {
            this.hideLoading('completeRegistration', 'Complete Registration');
        }
    }
    
    // ================================================
    // UI HELPER FUNCTIONS
    // ================================================
    showLoading(buttonId, loadingText = 'Loading...') {
        const button = document.getElementById(buttonId);
        if (button) {
            const originalHTML = button.innerHTML;
            button.setAttribute('data-original-html', originalHTML);
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
            button.disabled = true;
        }
    }
    
    hideLoading(buttonId, originalText = 'Submit') {
        const button = document.getElementById(buttonId);
        if (button) {
            const originalHTML = button.getAttribute('data-original-html');
            button.innerHTML = originalHTML || originalText;
            button.disabled = false;
        }
    }
    
    showError(message) {
        // Create or use existing error display
        let errorEl = document.getElementById('errorMessage');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'errorMessage';
            errorEl.className = 'error-message';
            document.body.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    }
    
    showSuccess(message) {
        // Create or use existing success display
        let successEl = document.getElementById('successMessage');
        if (!successEl) {
            successEl = document.createElement('div');
            successEl.id = 'successMessage';
            successEl.className = 'success-message';
            document.body.appendChild(successEl);
        }
        
        successEl.textContent = message;
        successEl.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successEl.style.display = 'none';
        }, 3000);
    }
    
    formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }
    
    initUI() {
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }, 500);
        }
        
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize modals
        this.initModals();
    }
    
    initTooltips() {
        // Add tooltips to elements with data-tooltip attribute
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                
                e.target._tooltip = tooltip;
            });
            
            el.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    e.target._tooltip = null;
                }
            });
        });
    }
    
    initModals() {
        // Close modal when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
        
        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    modal.classList.remove('show');
                });
            }
        });
    }
    
    // ================================================
    // HELPER FUNCTIONS FOR SPECIFIC PAGES
    // ================================================
    scrollToSpin() {
        const spinSection = document.getElementById('spin');
        if (spinSection) {
            spinSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    viewPrizeDetails(prizeId) {
        // This would open a modal with prize details
        console.log('View prize details:', prizeId);
        // In a full implementation, this would fetch and display prize details
    }
}

// ================================================
// GLOBAL APP INSTANCE
// ================================================
// Create global instance
window.trustCadeApp = new TrustCadeApp();

// Make app instance accessible from spin wheel
TrustCadeApp.instance = window.trustCadeApp;

// ================================================
// GLOBAL HELPER FUNCTIONS
// ================================================
// These are used in onclick attributes in HTML
window.scrollToSpin = function() {
    if (window.trustCadeApp) {
        window.trustCadeApp.scrollToSpin();
    }
};

window.viewPrizeDetails = function(prizeId) {
    if (window.trustCadeApp) {
        window.trustCadeApp.viewPrizeDetails(prizeId);
    }
};

// Check if user is logged in (for conditional rendering)
window.isLoggedIn = function() {
    return window.trustCadeApp && window.trustCadeApp.currentUser;
};

// Get user data
window.getCurrentUser = function() {
    return window.trustCadeApp?.currentUser || null;
};

// Format currency
window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
};

// Format date
window.formatDate = function(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// ================================================
// INITIALIZATION FOR SPECIFIC PAGES
// ================================================
// Profile page initialization
if (window.location.pathname.includes('profile.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        if (window.trustCadeApp && window.trustCadeApp.currentUser) {
            await window.trustCadeApp.loadUserProfile();
        } else {
            // Redirect to login if not logged in
            window.location.href = 'login.html';
        }
    });
}

// Winners page initialization
if (window.location.pathname.includes('winners.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        if (window.trustCadeApp) {
            await window.trustCadeApp.loadRecentWinners();
            await window.trustCadeApp.loadLeaderboard();
        }
    });
}

// Admin page initialization
if (window.location.pathname.includes('admin')) {
    document.addEventListener('DOMContentLoaded', async () => {
        // Check admin access
        if (!window.trustCadeApp?.currentUser) {
            window.location.href = 'admin-login.html';
            return;
        }
        
        // Verify admin privileges (this would be more robust in production)
        const isAdmin = window.trustCadeApp.currentUser.role === 'admin';
        if (!isAdmin) {
            window.location.href = 'index.html';
            return;
        }
    });
}

// ================================================
// ADDITIONAL STYLES FOR DYNAMIC ELEMENTS
// ================================================
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #EF4444;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: none;
        animation: slideIn 0.3s ease;
    }
    
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: none;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .tooltip {
        position: absolute;
        background: #1F2937;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
    }
    
    .tooltip:after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #1F2937;
    }
    
    .no-wins {
        text-align: center;
        padding: 40px;
        color: #6B7280;
        font-style: italic;
    }
    
    .win-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #E5E7EB;
        align-items: center;
    }
    
    .win-item:last-child {
        border-bottom: none;
    }
    
    .win-status.pending_claim {
        color: #F59E0B;
    }
    
    .win-status.claimed {
        color: #10B981;
    }
    
    .requires-login {
        display: none;
    }
`;

document.head.appendChild(dynamicStyles);
