// ================================================
// TrustCade Backend Simulation API
// ================================================
// SECURITY NOTE: This is a frontend simulation only.
// In production, this code should run on a secure backend server.
// ================================================

const TrustCadeAPI = (function() {
    'use strict';
    
    // ================================================
    // SECURITY CONFIGURATION
    // ================================================
    const SECURITY_CONFIG = {
        maxFailedAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
        passwordMinLength: 8,
        rateLimitWindow: 60 * 1000, // 1 minute
        maxRequestsPerWindow: 100
    };
    
    // ================================================
    // DATA STORAGE (In production, this would be a database)
    // ================================================
    let dataStore = {
        users: JSON.parse(localStorage.getItem('trustcade_users') || '[]'),
        winners: JSON.parse(localStorage.getItem('trustcade_winners') || '[]'),
        prizes: JSON.parse(localStorage.getItem('trustcade_prizes') || '[]'),
        spins: JSON.parse(localStorage.getItem('trustcade_spins') || '[]'),
        sessions: JSON.parse(localStorage.getItem('trustcade_sessions') || '[]'),
        failedAttempts: JSON.parse(localStorage.getItem('trustcade_failed_attempts') || '[]'),
        adminLogs: JSON.parse(localStorage.getItem('trustcade_admin_logs') || '[]'),
        giftCards: JSON.parse(localStorage.getItem('trustcade_gift_cards') || '[]')
    };
    
    // ================================================
    // INITIAL DEFAULT DATA
    // ================================================
    const DEFAULT_PRIZES = [
        { id: 1, name: "iPhone 17 Pro", value: 1299, category: "electronics", stock: 5 },
        { id: 2, name: "$500 Cash", value: 500, category: "cash", stock: 100 },
        { id: 3, name: "Premium Headphones", value: 299, category: "electronics", stock: 20 },
        { id: 4, name: "Try Again", value: 0, category: "none", stock: 9999 },
        { id: 5, name: "PlayStation 5 Pro", value: 499, category: "gaming", stock: 10 },
        { id: 6, name: "$900 Gift Card", value: 900, category: "giftcards", stock: 25 },
        { id: 7, name: "Smart Watch", value: 399, category: "electronics", stock: 15 },
        { id: 8, name: "MacBook Pro", value: 1299, category: "electronics", stock: 3 }
    ];
    
    // ================================================
    // UTILITY FUNCTIONS
    // ================================================
    const utils = {
        // Generate unique ID
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        },
        
        // Generate secure session token
        generateSessionToken() {
            const array = new Uint8Array(32);
            window.crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        },
        
        // Hash password (simulated - in production use bcrypt)
        hashPassword(password) {
            // This is a SIMULATION - in production use proper hashing
            return btoa(password + '|' + Date.now());
        },
        
        // Verify password (simulated)
        verifyPassword(hashedPassword, inputPassword) {
            // This is a SIMULATION - in production use proper verification
            try {
                const decoded = atob(hashedPassword);
                return decoded.startsWith(inputPassword + '|');
            } catch (e) {
                return false;
            }
        },
        
        // Validate email format
        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        // Validate password strength
        isStrongPassword(password) {
            if (password.length < SECURITY_CONFIG.passwordMinLength) return false;
            if (!/[A-Z]/.test(password)) return false;
            if (!/[a-z]/.test(password)) return false;
            if (!/\d/.test(password)) return false;
            if (!/[^A-Za-z0-9]/.test(password)) return false;
            return true;
        },
        
        // Sanitize input
        sanitizeInput(input) {
            if (typeof input !== 'string') return input;
            return input
                .replace(/[<>]/g, '')
                .trim()
                .substring(0, 500);
        },
        
        // Format response
        formatResponse(success, data = null, error = null) {
            return {
                success,
                timestamp: new Date().toISOString(),
                data,
                error
            };
        },
        
        // Check rate limiting
        checkRateLimit(ip) {
            const now = Date.now();
            const windowStart = now - SECURITY_CONFIG.rateLimitWindow;
            
            // Filter recent requests
            const recentRequests = dataStore.failedAttempts.filter(
                attempt => attempt.ip === ip && attempt.timestamp > windowStart
            );
            
            return recentRequests.length < SECURITY_CONFIG.maxRequestsPerWindow;
        },
        
        // Log failed attempt
        logFailedAttempt(ip, reason) {
            dataStore.failedAttempts.push({
                id: this.generateId(),
                ip,
                reason,
                timestamp: Date.now()
            });
            this.saveData();
        },
        
        // Log admin action
        logAdminAction(userId, action, details) {
            dataStore.adminLogs.push({
                id: this.generateId(),
                userId,
                action,
                details: this.sanitizeInput(details),
                timestamp: new Date().toISOString(),
                ip: '127.0.0.1' // In production, get real IP
            });
            this.saveData();
        },
        
        // Save data to localStorage
        saveData() {
            try {
                Object.keys(dataStore).forEach(key => {
                    localStorage.setItem(`trustcade_${key}`, JSON.stringify(dataStore[key]));
                });
            } catch (error) {
                console.error('Failed to save data:', error);
            }
        },
        
        // Initialize default data
        initializeDefaultData() {
            if (dataStore.prizes.length === 0) {
                dataStore.prizes = DEFAULT_PRIZES;
                this.saveData();
            }
        }
    };
    
    // ================================================
    // AUTHENTICATION API
    // ================================================
    const authAPI = {
        // User registration
        async register(userData) {
            try {
                const { email, password, name, phone, verificationMethod, giftCard } = userData;
                
                // Input validation
                if (!email || !password || !name) {
                    return utils.formatResponse(false, null, 'Missing required fields');
                }
                
                if (!utils.isValidEmail(email)) {
                    return utils.formatResponse(false, null, 'Invalid email format');
                }
                
                if (!utils.isStrongPassword(password)) {
                    return utils.formatResponse(false, null, 'Password does not meet security requirements');
                }
                
                // Check if user already exists
                const existingUser = dataStore.users.find(u => u.email === email);
                if (existingUser) {
                    return utils.formatResponse(false, null, 'User already exists');
                }
                
                // Gift card validation for verification
                let giftCardData = null;
                if (verificationMethod === 'giftcard') {
                    if (!giftCard || !giftCard.code || !giftCard.type) {
                        return utils.formatResponse(false, null, 'Gift card details required');
                    }
                    
                    // Validate gift card format
                    const codeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
                    if (!codeRegex.test(giftCard.code)) {
                        return utils.formatResponse(false, null, 'Invalid gift card code format');
                    }
                    
                    giftCardData = {
                        id: utils.generateId(),
                        type: giftCard.type,
                        code: giftCard.code,
                        pin: giftCard.pin || null,
                        verified: true,
                        verificationDate: new Date().toISOString()
                    };
                    
                    dataStore.giftCards.push(giftCardData);
                }
                
                // Create new user
                const newUser = {
                    id: utils.generateId(),
                    email: utils.sanitizeInput(email),
                    name: utils.sanitizeInput(name),
                    phone: phone ? utils.sanitizeInput(phone) : null,
                    passwordHash: utils.hashPassword(password), // In production: bcrypt.hash()
                    joined: new Date().toISOString(),
                    verified: verificationMethod === 'giftcard',
                    verificationMethod: verificationMethod || 'email',
                    giftCard: giftCardData?.id || null,
                    balance: verificationMethod === 'giftcard' ? 100 : 0,
                    spins: 1, // Initial free spin
                    totalWins: 0,
                    totalValue: 0,
                    settings: {
                        emailNotifications: true,
                        spinReminders: true,
                        prizeUpdates: true
                    },
                    security: {
                        failedAttempts: 0,
                        lastLogin: null,
                        ipHistory: []
                    }
                };
                
                dataStore.users.push(newUser);
                utils.saveData();
                
                // Remove password hash from response
                const { passwordHash, security, ...userResponse } = newUser;
                
                // Create initial session
                const session = this.createSession(newUser.id);
                
                return utils.formatResponse(true, {
                    user: userResponse,
                    session,
                    message: 'Registration successful'
                });
                
            } catch (error) {
                console.error('Registration error:', error);
                return utils.formatResponse(false, null, 'Registration failed');
            }
        },
        
        // User login
        async login(email, password, rememberMe = false) {
            try {
                // Input validation
                if (!email || !password) {
                    return utils.formatResponse(false, null, 'Email and password required');
                }
                
                if (!utils.isValidEmail(email)) {
                    return utils.formatResponse(false, null, 'Invalid email format');
                }
                
                // Find user
                const user = dataStore.users.find(u => u.email === email);
                if (!user) {
                    utils.logFailedAttempt('127.0.0.1', 'User not found');
                    return utils.formatResponse(false, null, 'Invalid credentials');
                }
                
                // Check if account is locked
                if (user.security.failedAttempts >= SECURITY_CONFIG.maxFailedAttempts) {
                    const lockoutTime = user.security.lastFailedAttempt || 0;
                    const timeSinceLockout = Date.now() - lockoutTime;
                    
                    if (timeSinceLockout < SECURITY_CONFIG.lockoutDuration) {
                        const minutesLeft = Math.ceil((SECURITY_CONFIG.lockoutDuration - timeSinceLockout) / (60 * 1000));
                        return utils.formatResponse(false, null, `Account locked. Try again in ${minutesLeft} minutes`);
                    } else {
                        // Reset lockout
                        user.security.failedAttempts = 0;
                        user.security.lastFailedAttempt = null;
                    }
                }
                
                // Verify password
                if (!utils.verifyPassword(user.passwordHash, password)) {
                    user.security.failedAttempts = (user.security.failedAttempts || 0) + 1;
                    user.security.lastFailedAttempt = Date.now();
                    utils.saveData();
                    
                    utils.logFailedAttempt('127.0.0.1', 'Invalid password');
                    
                    const attemptsLeft = SECURITY_CONFIG.maxFailedAttempts - user.security.failedAttempts;
                    const errorMsg = attemptsLeft > 0 
                        ? `Invalid credentials. ${attemptsLeft} attempts remaining`
                        : 'Account locked due to too many failed attempts';
                    
                    return utils.formatResponse(false, null, errorMsg);
                }
                
                // Successful login
                user.security.failedAttempts = 0;
                user.security.lastFailedAttempt = null;
                user.security.lastLogin = new Date().toISOString();
                user.security.ipHistory.push({
                    ip: '127.0.0.1',
                    timestamp: new Date().toISOString()
                });
                
                // Create session
                const session = this.createSession(user.id, rememberMe);
                
                // Remove sensitive data from response
                const { passwordHash, security, ...userResponse } = user;
                
                utils.saveData();
                
                return utils.formatResponse(true, {
                    user: userResponse,
                    session,
                    message: 'Login successful'
                });
                
            } catch (error) {
                console.error('Login error:', error);
                return utils.formatResponse(false, null, 'Login failed');
            }
        },
        
        // Create session
        createSession(userId, rememberMe = false) {
            const sessionToken = utils.generateSessionToken();
            const expiresAt = Date.now() + SECURITY_CONFIG.sessionDuration;
            
            const session = {
                token: sessionToken,
                userId,
                expiresAt,
                createdAt: new Date().toISOString(),
                userAgent: navigator.userAgent,
                ip: '127.0.0.1'
            };
            
            dataStore.sessions.push(session);
            utils.saveData();
            
            // Store session in localStorage/sessionStorage
            if (rememberMe) {
                localStorage.setItem('trustcade_session', JSON.stringify(session));
            } else {
                sessionStorage.setItem('trustcade_session', JSON.stringify(session));
            }
            
            return {
                token: sessionToken,
                expiresAt: new Date(expiresAt).toISOString()
            };
        },
        
        // Verify session
        async verifySession(token) {
            try {
                const session = dataStore.sessions.find(s => s.token === token);
                
                if (!session) {
                    return utils.formatResponse(false, null, 'Invalid session');
                }
                
                if (Date.now() > session.expiresAt) {
                    // Remove expired session
                    dataStore.sessions = dataStore.sessions.filter(s => s.token !== token);
                    utils.saveData();
                    return utils.formatResponse(false, null, 'Session expired');
                }
                
                const user = dataStore.users.find(u => u.id === session.userId);
                if (!user) {
                    return utils.formatResponse(false, null, 'User not found');
                }
                
                // Extend session
                session.expiresAt = Date.now() + SECURITY_CONFIG.sessionDuration;
                utils.saveData();
                
                // Remove sensitive data
                const { passwordHash, security, ...userResponse } = user;
                
                return utils.formatResponse(true, {
                    user: userResponse,
                    session
                });
                
            } catch (error) {
                console.error('Session verification error:', error);
                return utils.formatResponse(false, null, 'Session verification failed');
            }
        },
        
        // Logout
        async logout(token) {
            try {
                dataStore.sessions = dataStore.sessions.filter(s => s.token !== token);
                utils.saveData();
                
                // Clear client-side storage
                localStorage.removeItem('trustcade_session');
                sessionStorage.removeItem('trustcade_session');
                
                return utils.formatResponse(true, null, 'Logout successful');
            } catch (error) {
                return utils.formatResponse(false, null, 'Logout failed');
            }
        },
        
        // Admin login (special endpoint)
        async adminLogin(username, password) {
            try {
                // DEMO ADMIN CREDENTIALS - In production, use proper admin authentication
                const DEMO_ADMIN = {
                    username: 'demo_admin',
                    password: 'Demo@Secure123!',
                    id: 'admin_001',
                    email: 'admin@trustcade.com',
                    name: 'System Administrator',
                    role: 'admin',
                    permissions: ['all']
                };
                
                // Rate limiting check
                if (!utils.checkRateLimit('127.0.0.1')) {
                    return utils.formatResponse(false, null, 'Too many requests. Please try again later.');
                }
                
                if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
                    const session = this.createSession(DEMO_ADMIN.id, true);
                    
                    utils.logAdminAction(DEMO_ADMIN.id, 'ADMIN_LOGIN', 'Successful admin login');
                    
                    return utils.formatResponse(true, {
                        user: DEMO_ADMIN,
                        session,
                        message: 'Admin login successful'
                    });
                } else {
                    utils.logFailedAttempt('127.0.0.1', 'Failed admin login attempt');
                    utils.logAdminAction('unknown', 'ADMIN_LOGIN_FAILED', `Failed login attempt for username: ${username}`);
                    
                    return utils.formatResponse(false, null, 'Invalid admin credentials');
                }
                
            } catch (error) {
                console.error('Admin login error:', error);
                return utils.formatResponse(false, null, 'Admin login failed');
            }
        }
    };
    
    // ================================================
    // SPIN WHEEL API
    // ================================================
    const spinAPI = {
        // Get available prizes
        async getPrizes() {
            try {
                const availablePrizes = dataStore.prizes.filter(prize => prize.stock > 0);
                return utils.formatResponse(true, availablePrizes);
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch prizes');
            }
        },
        
        // Perform spin
        async performSpin(userId) {
            try {
                const user = dataStore.users.find(u => u.id === userId);
                if (!user) {
                    return utils.formatResponse(false, null, 'User not found');
                }
                
                // Check if user has spins available
                if (user.spins < 1) {
                    return utils.formatResponse(false, null, 'No spins available');
                }
                
                // Check last spin time (24-hour cooldown)
                const lastSpin = dataStore.spins
                    .filter(s => s.userId === userId)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                
                if (lastSpin) {
                    const lastSpinTime = new Date(lastSpin.timestamp);
                    const now = new Date();
                    const hoursSinceLastSpin = (now - lastSpinTime) / (1000 * 60 * 60);
                    
                    if (hoursSinceLastSpin < 24) {
                        const hoursLeft = Math.ceil(24 - hoursSinceLastSpin);
                        return utils.formatResponse(false, null, `Next spin available in ${hoursLeft} hours`);
                    }
                }
                
                // Deduct spin
                user.spins -= 1;
                
                // Select random prize (weighted)
                const availablePrizes = dataStore.prizes.filter(p => p.stock > 0);
                const weights = availablePrizes.map(p => {
                    // Adjust weights - better prizes have lower chance
                    const baseWeight = 100;
                    const valueFactor = Math.max(1, 500 / p.value);
                    return baseWeight * valueFactor;
                });
                
                const totalWeight = weights.reduce((a, b) => a + b, 0);
                let random = Math.random() * totalWeight;
                
                let selectedPrize = null;
                for (let i = 0; i < availablePrizes.length; i++) {
                    random -= weights[i];
                    if (random <= 0) {
                        selectedPrize = availablePrizes[i];
                        break;
                    }
                }
                
                // Reduce stock
                selectedPrize.stock -= 1;
                
                // Record spin
                const spinRecord = {
                    id: utils.generateId(),
                    userId,
                    prizeId: selectedPrize.id,
                    prizeName: selectedPrize.name,
                    prizeValue: selectedPrize.value,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                };
                
                dataStore.spins.push(spinRecord);
                
                // If user won something (not "Try Again")
                if (selectedPrize.value > 0) {
                    // Create winner record
                    const winnerRecord = {
                        id: utils.generateId(),
                        userId,
                        prizeId: selectedPrize.id,
                        prizeName: selectedPrize.name,
                        prizeValue: selectedPrize.value,
                        winDate: new Date().toISOString(),
                        status: 'pending_claim',
                        claimCode: `TC-${utils.generateId().substr(0, 8).toUpperCase()}`
                    };
                    
                    dataStore.winners.push(winnerRecord);
                    
                    // Update user stats
                    user.totalWins += 1;
                    user.totalValue += selectedPrize.value;
                }
                
                // Add next free spin in 24 hours
                const nextSpinTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
                
                utils.saveData();
                
                return utils.formatResponse(true, {
                    prize: selectedPrize,
                    spinRecord,
                    nextSpinTime: nextSpinTime.toISOString(),
                    message: selectedPrize.value > 0 ? 'Congratulations! You won!' : 'Better luck next time!'
                });
                
            } catch (error) {
                console.error('Spin error:', error);
                return utils.formatResponse(false, null, 'Spin failed');
            }
        },
        
        // Get user's spin history
        async getUserSpins(userId) {
            try {
                const userSpins = dataStore.spins
                    .filter(s => s.userId === userId)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                return utils.formatResponse(true, userSpins);
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch spin history');
            }
        },
        
        // Add spins to user (for purchases or referrals)
        async addSpins(userId, count, reason) {
            try {
                const user = dataStore.users.find(u => u.id === userId);
                if (!user) {
                    return utils.formatResponse(false, null, 'User not found');
                }
                
                user.spins += count;
                utils.saveData();
                
                // Log the transaction
                utils.logAdminAction(userId, 'ADD_SPINS', `${count} spins added: ${reason}`);
                
                return utils.formatResponse(true, {
                    newBalance: user.spins,
                    message: `${count} spins added successfully`
                });
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to add spins');
            }
        }
    };
    
    // ================================================
    // WINNERS & PRIZES API
    // ================================================
    const winnersAPI = {
        // Get recent winners
        async getRecentWinners(limit = 10) {
            try {
                const recentWinners = dataStore.winners
                    .sort((a, b) => new Date(b.winDate) - new Date(a.winDate))
                    .slice(0, limit)
                    .map(winner => {
                        const user = dataStore.users.find(u => u.id === winner.userId);
                        return {
                            ...winner,
                            userName: user ? user.name : 'Anonymous',
                            userInitial: user ? user.name.charAt(0) : 'A'
                        };
                    });
                
                return utils.formatResponse(true, recentWinners);
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch winners');
            }
        },
        
        // Get leaderboard
        async getLeaderboard(limit = 10) {
            try {
                // Aggregate user wins
                const userStats = {};
                
                dataStore.winners.forEach(winner => {
                    if (!userStats[winner.userId]) {
                        const user = dataStore.users.find(u => u.id === winner.userId);
                        userStats[winner.userId] = {
                            userId: winner.userId,
                            userName: user ? user.name : 'Anonymous',
                            totalWins: 0,
                            totalValue: 0,
                            lastWin: winner.winDate
                        };
                    }
                    
                    userStats[winner.userId].totalWins += 1;
                    userStats[winner.userId].totalValue += winner.prizeValue;
                    userStats[winner.userId].lastWin = winner.winDate;
                });
                
                // Convert to array and sort
                const leaderboard = Object.values(userStats)
                    .sort((a, b) => b.totalValue - a.totalValue)
                    .slice(0, limit)
                    .map((user, index) => ({
                        rank: index + 1,
                        ...user
                    }));
                
                return utils.formatResponse(true, leaderboard);
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch leaderboard');
            }
        },
        
        // Claim prize
        async claimPrize(winnerId, userId) {
            try {
                const winner = dataStore.winners.find(w => w.id === winnerId);
                if (!winner) {
                    return utils.formatResponse(false, null, 'Prize not found');
                }
                
                if (winner.userId !== userId) {
                    return utils.formatResponse(false, null, 'Not authorized to claim this prize');
                }
                
                if (winner.status !== 'pending_claim') {
                    return utils.formatResponse(false, null, 'Prize already claimed or expired');
                }
                
                // Update status
                winner.status = 'claimed';
                winner.claimDate = new Date().toISOString();
                
                utils.saveData();
                
                // Log the claim
                utils.logAdminAction(userId, 'CLAIM_PRIZE', `Claimed prize: ${winner.prizeName}`);
                
                return utils.formatResponse(true, {
                    prize: winner,
                    message: 'Prize claimed successfully! You will receive it within 7-14 business days.'
                });
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to claim prize');
            }
        }
    };
    
    // ================================================
    // USER PROFILE API
    // ================================================
    const userAPI = {
        // Get user profile
        async getProfile(userId) {
            try {
                const user = dataStore.users.find(u => u.id === userId);
                if (!user) {
                    return utils.formatResponse(false, null, 'User not found');
                }
                
                // Get user's wins
                const userWins = dataStore.winners.filter(w => w.userId === userId);
                
                // Get user's spins
                const userSpins = dataStore.spins.filter(s => s.userId === userId);
                
                // Remove sensitive data
                const { passwordHash, security, ...safeUser } = user;
                
                return utils.formatResponse(true, {
                    user: safeUser,
                    stats: {
                        totalWins: userWins.length,
                        totalValue: userWins.reduce((sum, win) => sum + win.prizeValue, 0),
                        totalSpins: userSpins.length,
                        winRate: userSpins.length > 0 ? (userWins.length / userSpins.length * 100).toFixed(1) : 0
                    },
                    recentWins: userWins.slice(0, 5),
                    recentSpins: userSpins.slice(0, 10)
                });
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch profile');
            }
        },
        
        // Update user profile
        async updateProfile(userId, updates) {
            try {
                const user = dataStore.users.find(u => u.id === userId);
                if (!user) {
                    return utils.formatResponse(false, null, 'User not found');
                }
                
                // Allowed fields to update
                const allowedUpdates = ['name', 'phone', 'settings'];
                const validUpdates = {};
                
                Object.keys(updates).forEach(key => {
                    if (allowedUpdates.includes(key)) {
                        validUpdates[key] = utils.sanitizeInput(updates[key]);
                    }
                });
                
                // Apply updates
                Object.assign(user, validUpdates);
                utils.saveData();
                
                // Log the update
                utils.logAdminAction(userId, 'UPDATE_PROFILE', `Updated profile fields: ${Object.keys(validUpdates).join(', ')}`);
                
                // Remove sensitive data from response
                const { passwordHash, security, ...safeUser } = user;
                
                return utils.formatResponse(true, {
                    user: safeUser,
                    message: 'Profile updated successfully'
                });
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to update profile');
            }
        },
        
        // Change password
        async changePassword(userId, currentPassword, newPassword) {
            try {
                const user = dataStore.users.find(u => u.id === userId);
                if (!user) {
                    return utils.formatResponse(false, null, 'User not found');
                }
                
                // Verify current password
                if (!utils.verifyPassword(user.passwordHash, currentPassword)) {
                    return utils.formatResponse(false, null, 'Current password is incorrect');
                }
                
                // Validate new password
                if (!utils.isStrongPassword(newPassword)) {
                    return utils.formatResponse(false, null, 'New password does not meet security requirements');
                }
                
                // Update password
                user.passwordHash = utils.hashPassword(newPassword);
                user.security.lastPasswordChange = new Date().toISOString();
                utils.saveData();
                
                // Log the change
                utils.logAdminAction(userId, 'CHANGE_PASSWORD', 'Password changed successfully');
                
                return utils.formatResponse(true, null, 'Password changed successfully');
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to change password');
            }
        }
    };
    
    // ================================================
    // ADMIN API
    // ================================================
    const adminAPI = {
        // Verify admin access
        async verifyAdmin(userId) {
            try {
                const user = dataStore.users.find(u => u.id === userId);
                const isAdmin = user && user.role === 'admin';
                
                if (!isAdmin) {
                    return utils.formatResponse(false, null, 'Admin access required');
                }
                
                return utils.formatResponse(true, { isAdmin: true });
            } catch (error) {
                return utils.formatResponse(false, null, 'Admin verification failed');
            }
        },
        
        // Get system statistics
        async getSystemStats() {
            try {
                const stats = {
                    totalUsers: dataStore.users.length,
                    totalWinners: dataStore.winners.length,
                    totalSpins: dataStore.spins.length,
                    totalPrizesDistributed: dataStore.winners.reduce((sum, w) => sum + w.prizeValue, 0),
                    activeSessions: dataStore.sessions.filter(s => Date.now() < s.expiresAt).length,
                    recentRegistrations: dataStore.users
                        .sort((a, b) => new Date(b.joined) - new Date(a.joined))
                        .slice(0, 5)
                        .map(u => ({
                            name: u.name,
                            email: u.email,
                            joined: u.joined,
                            verified: u.verified
                        })),
                    prizeInventory: dataStore.prizes.map(p => ({
                        name: p.name,
                        stock: p.stock,
                        value: p.value
                    }))
                };
                
                return utils.formatResponse(true, stats);
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch system stats');
            }
        },
        
        // Get admin logs
        async getAdminLogs(limit = 50) {
            try {
                const logs = dataStore.adminLogs
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, limit);
                
                return utils.formatResponse(true, logs);
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch admin logs');
            }
        },
        
        // Get user management list
        async getUsers(search = '', page = 1, limit = 20) {
            try {
                let filteredUsers = dataStore.users;
                
                // Apply search filter
                if (search) {
                    const searchLower = search.toLowerCase();
                    filteredUsers = filteredUsers.filter(u => 
                        u.name.toLowerCase().includes(searchLower) || 
                        u.email.toLowerCase().includes(searchLower)
                    );
                }
                
                // Pagination
                const total = filteredUsers.length;
                const totalPages = Math.ceil(total / limit);
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                
                const paginatedUsers = filteredUsers
                    .slice(startIndex, endIndex)
                    .map(u => {
                        const { passwordHash, security, ...safeUser } = u;
                        return safeUser;
                    });
                
                return utils.formatResponse(true, {
                    users: paginatedUsers,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages
                    }
                });
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to fetch users');
            }
        },
        
        // Manage prize inventory
        async updatePrize(prizeId, updates) {
            try {
                const prize = dataStore.prizes.find(p => p.id === prizeId);
                if (!prize) {
                    return utils.formatResponse(false, null, 'Prize not found');
                }
                
                // Apply updates
                Object.assign(prize, updates);
                utils.saveData();
                
                utils.logAdminAction('system', 'UPDATE_PRIZE', `Updated prize: ${prize.name}`);
                
                return utils.formatResponse(true, { prize }, 'Prize updated successfully');
            } catch (error) {
                return utils.formatResponse(false, null, 'Failed to update prize');
            }
        }
    };
    
    // ================================================
    // PUBLIC API ENDPOINTS
    // ================================================
    return {
        // Initialize the API
        init() {
            utils.initializeDefaultData();
            console.log('TrustCade API initialized');
        },
        
        // Authentication endpoints
        auth: {
            register: authAPI.register.bind(authAPI),
            login: authAPI.login.bind(authAPI),
            adminLogin: authAPI.adminLogin.bind(authAPI),
            verifySession: authAPI.verifySession.bind(authAPI),
            logout: authAPI.logout.bind(authAPI)
        },
        
        // Spin wheel endpoints
        spin: {
            getPrizes: spinAPI.getPrizes.bind(spinAPI),
            performSpin: spinAPI.performSpin.bind(spinAPI),
            getUserSpins: spinAPI.getUserSpins.bind(spinAPI),
            addSpins: spinAPI.addSpins.bind(spinAPI)
        },
        
        // Winners endpoints
        winners: {
            getRecentWinners: winnersAPI.getRecentWinners.bind(winnersAPI),
            getLeaderboard: winnersAPI.getLeaderboard.bind(winnersAPI),
            claimPrize: winnersAPI.claimPrize.bind(winnersAPI)
        },
        
        // User endpoints
        user: {
            getProfile: userAPI.getProfile.bind(userAPI),
            updateProfile: userAPI.updateProfile.bind(userAPI),
            changePassword: userAPI.changePassword.bind(userAPI)
        },
        
        // Admin endpoints
        admin: {
            verifyAdmin: adminAPI.verifyAdmin.bind(adminAPI),
            getSystemStats: adminAPI.getSystemStats.bind(adminAPI),
            getAdminLogs: adminAPI.getAdminLogs.bind(adminAPI),
            getUsers: adminAPI.getUsers.bind(adminAPI),
            updatePrize: adminAPI.updatePrize.bind(adminAPI)
        },
        
        // Utility methods
        utils: {
            getSecurityConfig: () => ({ ...SECURITY_CONFIG }),
            clearData: () => {
                // For testing/development only
                Object.keys(dataStore).forEach(key => {
                    localStorage.removeItem(`trustcade_${key}`);
                });
                dataStore = {
                    users: [],
                    winners: [],
                    prizes: [],
                    spins: [],
                    sessions: [],
                    failedAttempts: [],
                    adminLogs: [],
                    giftCards: []
                };
                utils.initializeDefaultData();
            }
        }
    };
})();

// Initialize the API when loaded
document.addEventListener('DOMContentLoaded', () => {
    TrustCadeAPI.init();
});

// Export for use in browser console (for debugging)
window.TrustCadeAPI = TrustCadeAPI;

// ================================================
// API USAGE EXAMPLES:
// ================================================
/*
// User Registration:
TrustCadeAPI.auth.register({
    email: "user@example.com",
    password: "SecurePass123!",
    name: "John Doe",
    phone: "1234567890",
    verificationMethod: "giftcard",
    giftCard: {
        type: "steam",
        code: "XXXX-XXXX-XXXX-XXXX",
        pin: "1234"
    }
}).then(response => {
    console.log(response);
});

// User Login:
TrustCadeAPI.auth.login("user@example.com", "SecurePass123!")
    .then(response => {
        console.log(response);
    });

// Perform Spin:
TrustCadeAPI.spin.performSpin("user_id_here")
    .then(response => {
        console.log(response);
    });

// Get Recent Winners:
TrustCadeAPI.winners.getRecentWinners(5)
    .then(response => {
        console.log(response);
    });

// Get User Profile:
TrustCadeAPI.user.getProfile("user_id_here")
    .then(response => {
        console.log(response);
    });

// Admin Login:
TrustCadeAPI.auth.adminLogin("demo_admin", "Demo@Secure123!")
    .then(response => {
        console.log(response);
    });

// Get System Stats (Admin only):
TrustCadeAPI.admin.getSystemStats()
    .then(response => {
        console.log(response);
    });
*/
