// TrustCade Spin Wheel - Mobile Optimized
document.addEventListener('DOMContentLoaded', function() {
    // Mobile detection
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Prize configuration
    const prizes = [
        { name: "$10 Amazon Gift Card", color: "#FF6B6B", probability: 5 },
        { name: "Better Luck Next Time", color: "#4ECDC4", probability: 30 },
        { name: "$5 Starbucks Card", color: "#FFD166", probability: 10 },
        { name: "Free Spin Tomorrow", color: "#06D6A0", probability: 25 },
        { name: "iPhone 15", color: "#118AB2", probability: 1 },
        { name: "TrustCade T-Shirt", color: "#EF476F", probability: 15 },
        { name: "$20 Steam Wallet", color: "#073B4C", probability: 8 },
        { name: "YouTube Premium 1 Month", color: "#7209B7", probability: 6 }
    ];
    
    // DOM Elements
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-button');
    const resultDisplay = document.getElementById('result');
    const prizeDisplay = document.getElementById('prize-display');
    const spinCountDisplay = document.getElementById('spin-count');
    const timerDisplay = document.getElementById('timer');
    
    // State variables
    let isSpinning = false;
    let spinCount = 0;
    let lastSpinTime = 0;
    const SPIN_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Initialize wheel segments
    function initializeWheel() {
        if (!wheel) {
            console.error("Wheel element not found!");
            return;
        }
        
        wheel.innerHTML = '';
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        let currentAngle = 0;
        
        prizes.forEach((prize, index) => {
            const segment = document.createElement('div');
            const angle = (prize.probability / totalProbability) * 360;
            
            segment.className = 'wheel-segment';
            segment.style.backgroundColor = prize.color;
            segment.style.transform = `rotate(${currentAngle}deg) skewY(${90 - angle}deg)`;
            segment.style.transformOrigin = '0% 0%';
            segment.innerHTML = `<span style="transform: rotate(${angle/2}deg);">${prize.name}</span>`;
            
            wheel.appendChild(segment);
            currentAngle += angle;
        });
        
        console.log("Wheel initialized with", prizes.length, "prizes");
    }
    
    // Calculate winning segment
    function getRandomPrize() {
        const total = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        let random = Math.random() * total;
        
        for (const prize of prizes) {
            if (random < prize.probability) {
                return prize;
            }
            random -= prize.probability;
        }
        
        return prizes[0]; // fallback
    }
    
    // Display prize with animation
    function showPrize(prize) {
        if (!resultDisplay || !prizeDisplay) {
            console.error("Display elements not found");
            return;
        }
        
        // Mobile-optimized display
        resultDisplay.innerHTML = `
            <div style="
                background: ${prize.color};
                color: white;
                padding: ${isMobile ? '20px' : '30px'};
                border-radius: 15px;
                text-align: center;
                margin: 15px 0;
                font-size: ${isMobile ? '18px' : '24px'};
                font-weight: bold;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                animation: prizePop 0.5s ease-out;
            ">
                🎉 YOU WON! 🎉<br>
                <span style="font-size: ${isMobile ? '22px' : '28px'}; display: block; margin: 10px 0;">
                    ${prize.name}
                </span>
            </div>
        `;
        
        prizeDisplay.innerHTML = `
            <div style="text-align: center; padding: 15px;">
                <h3 style="color: #4CAF50;">🎁 Prize Details</h3>
                <p><strong>Name:</strong> ${prize.name}</p>
                <p><strong>Status:</strong> Ready to Claim</p>
                <button onclick="claimPrize('${prize.name.replace(/'/g, "\\'")}')" 
                    style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: ${isMobile ? '12px 20px' : '15px 30px'};
                        border-radius: 25px;
                        font-size: 16px;
                        margin-top: 10px;
                        cursor: pointer;
                        width: ${isMobile ? '100%' : 'auto'};
                    ">
                    📲 CLAIM PRIZE
                </button>
            </div>
        `;
        
        // Save to localStorage (for demo)
        try {
            const wins = JSON.parse(localStorage.getItem('trustcade_wins') || '[]');
            wins.push({
                prize: prize.name,
                date: new Date().toISOString(),
                claimed: false
            });
            localStorage.setItem('trustcade_wins', JSON.stringify(wins));
        } catch (e) {
            console.log("LocalStorage not available");
        }
        
        // Haptic feedback for mobile
        if (isMobile && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
    
    // Spin wheel function
    function startSpin() {
        if (isSpinning) return;
        
        // Check cooldown
        const now = Date.now();
        const timeLeft = SPIN_COOLDOWN - (now - lastSpinTime);
        
        if (timeLeft > 0 && lastSpinTime !== 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            alert(`Next spin available in ${hours}h ${minutes}m`);
            return;
        }
        
        isSpinning = true;
        spinButton.disabled = true;
        spinButton.innerHTML = 'SPINNING...';
        
        // Wheel spin animation
        const selectedPrize = getRandomPrize();
        const prizeIndex = prizes.findIndex(p => p.name === selectedPrize.name);
        const segmentAngle = 360 / prizes.length;
        const extraSpins = 5; // Number of full spins before stopping
        const targetAngle = 3600 + (prizeIndex * segmentAngle) + Math.random() * segmentAngle;
        
        wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
        wheel.style.transform = `rotate(${targetAngle}deg)`;
        
        // Show result after spin
        setTimeout(() => {
            isSpinning = false;
            spinButton.disabled = false;
            spinButton.innerHTML = 'SPIN AGAIN';
            
            showPrize(selectedPrize);
            spinCount++;
            lastSpinTime = now;
            
            if (spinCountDisplay) {
                spinCountDisplay.textContent = spinCount;
            }
            
            // Reset wheel position (hidden)
            setTimeout(() => {
                wheel.style.transition = 'none';
                wheel.style.transform = 'rotate(0deg)';
                setTimeout(() => {
                    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
                }, 50);
            }, 1000);
            
        }, 4000);
    }
    
    // Update timer display
    function updateTimer() {
        if (!timerDisplay) return;
        
        const now = Date.now();
        const timeLeft = SPIN_COOLDOWN - (now - lastSpinTime);
        
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            timerDisplay.textContent = `Next spin: ${hours}h ${minutes}m`;
        } else {
            timerDisplay.textContent = "Ready to spin!";
        }
    }
    
    // Claim prize function (global for button onclick)
    window.claimPrize = function(prizeName) {
        alert(`🎊 Congratulations!\nYou claimed: ${prizeName}\n\nPrize will be delivered within 24 hours.`);
        
        // Update localStorage
        try {
            const wins = JSON.parse(localStorage.getItem('trustcade_wins') || '[]');
            const lastWin = wins[wins.length - 1];
            if (lastWin) {
                lastWin.claimed = true;
                localStorage.setItem('trustcade_wins', JSON.stringify(wins));
            }
        } catch (e) {
            console.log("Could not update claim status");
        }
    };
    
    // Initialize
    initializeWheel();
    
    // Event listeners with mobile touch support
    if (spinButton) {
        // Touch events for mobile
        spinButton.addEventListener('touchstart', function(e) {
            if (isMobile) e.preventDefault();
            this.style.transform = 'scale(0.95)';
        });
        
        spinButton.addEventListener('touchend', function(e) {
            if (isMobile) e.preventDefault();
            this.style.transform = 'scale(1)';
            if (!isSpinning) startSpin();
        });
        
        // Click for desktop
        spinButton.addEventListener('click', function(e) {
            if (!isMobile && !isSpinning) startSpin();
        });
    }
    
    // Load previous spin count
    try {
        spinCount = parseInt(localStorage.getItem('trustcade_spin_count')) || 0;
        lastSpinTime = parseInt(localStorage.getItem('trustcade_last_spin')) || 0;
        
        if (spinCountDisplay) {
            spinCountDisplay.textContent = spinCount;
        }
    } catch (e) {
        console.log("Could not load saved data");
    }
    
    // Update timer every minute
    updateTimer();
    setInterval(updateTimer, 60000);
    
    // Add CSS for prize animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes prizePop {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .wheel-segment {
            position: absolute;
            width: 50%;
            height: 50%;
            transform-origin: 100% 100%;
            overflow: hidden;
        }
        
        .wheel-segment span {
            position: absolute;
            left: -100%;
            width: 200%;
            text-align: center;
            top: 20px;
            transform-origin: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        
        @media (max-width: 768px) {
            .wheel-segment span {
                font-size: 10px;
                top: 15px;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log("TrustCade spin wheel loaded successfully!");
});
// DEBUG: Force show a prize for testing
setTimeout(function() {
    console.log("DEBUG: Testing prize display...");
    const testPrize = { name: "$10 Amazon Gift Card", color: "#FF6B6B" };
    
    // Try to display prize manually
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = `<div style="background:${testPrize.color};color:white;padding:20px;border-radius:10px;">
            🎉 TEST PRIZE: ${testPrize.name}
        </div>`;
        console.log("DEBUG: Prize should be visible now");
    } else {
        console.error("DEBUG: #result element not found!");
    }
}, 3000); // After 3 seconds
