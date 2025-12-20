// TrustCade Spin Wheel – FINAL STABLE VERSION (Canvas Only)
// Updated with enhanced win notification

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("wheelCanvas");
    const ctx = canvas.getContext("2d");
    const spinBtn = document.getElementById("spin-button");
    const result = document.getElementById("result");
    const prizeBox = document.getElementById("prize-display");

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const prizes = [
        { text: "$1000 Amazon Gift Card", color: "#FF6B6B", weight: 5 },
        { text: "Better Luck Next Time", color: "#4ECDC4", weight: 30 },
        { text: "PS5", color: "#FFD166", weight: 10 },
        { text: "Watch", color: "#06D6A0", weight: 25 },
        { text: "iPhone 17", color: "#118AB2", weight: 1 },
        { text: "Headphones", color: "#EF476F", weight: 15 },
        { text: "Try again", color: "#073B4C", weight: 8 },
        { text: "MacBook", color: "#7209B7", weight: 6 }
    ];

    const size = 500;
    canvas.width = size;
    canvas.height = size;

    const center = size / 2;
    const radius = center - 10;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    let rotation = 0;
    let spinning = false;

    // Initialize win notification if it doesn't exist
    function initWinNotification() {
        if (!document.getElementById('winNotification')) {
            const winNotification = document.createElement('div');
            winNotification.id = 'winNotification';
            winNotification.className = 'win-notification';
            winNotification.innerHTML = `
                <div class="notification-content">
                    <h2>🎉 Congratulations! 🎉</h2>
                    <p id="winMessage">You won: <span id="prizeText">[Prize Name]</span></p>
                    <button id="claimPrizeBtn">Claim Your Prize Now</button>
                    <button id="closeNotification">Close</button>
                </div>
            `;
            document.body.appendChild(winNotification);
            
            // Add event listeners for the notification buttons
            document.getElementById('claimPrizeBtn').addEventListener('click', claimPrize);
            document.getElementById('closeNotification').addEventListener('click', closeWinNotification);
        }
    }

    function drawWheel() {
        ctx.clearRect(0, 0, size, size);

        prizes.forEach((prize, i) => {
            const angle = rotation + i * sliceAngle;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, angle, angle + sliceAngle);
            ctx.fillStyle = prize.color;
            ctx.fill();

            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = isMobile ? "bold 14px Poppins" : "bold 16px Poppins";
            ctx.fillText(prize.text, radius - 20, 5);
            ctx.restore();
        });
    }

    function weightedRandomPrize() {
        const total = prizes.reduce((s, p) => s + p.weight, 0);
        let r = Math.random() * total;

        for (let i = 0; i < prizes.length; i++) {
            if (r < prizes[i].weight) return i;
            r -= prizes[i].weight;
        }
        return 0;
    }

    function spinWheel() {
        if (spinning) return;
        spinning = true;

        spinBtn.disabled = true;
        spinBtn.innerText = "SPINNING...";

        const winningIndex = weightedRandomPrize();
        const targetAngle =
            (Math.PI * 6) +
            (prizes.length - winningIndex) * sliceAngle +
            sliceAngle / 2;

        const start = performance.now();
        const duration = 4000;

        function animate(t) {
            const progress = Math.min((t - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            rotation = ease * targetAngle;
            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                spinBtn.disabled = false;
                spinBtn.innerText = "SPIN AGAIN";
                showPrize(prizes[winningIndex]);
            }
        }

        requestAnimationFrame(animate);
    }

    function showPrize(prize) {
        // Show in result box
        result.innerHTML = `
            <div style="
                background:${prize.color};
                color:white;
                padding:20px;
                border-radius:15px;
                font-size:20px;
                font-weight:bold;
                margin-top:15px;">
                🎉 You won <br><strong>${prize.text}</strong>
            </div>
        `;

        // Show in prize box (existing functionality)
        prizeBox.innerHTML = `
            <div style="text-align:center">
                <h3>🎉 Congratulations! 🎉</h3>
                <p><strong>You won:</strong> ${prize.text}</p>
                <button onclick="alert('Prize claimed! Redirecting to claim page...'); window.location.href='profile.html';"
                    style="background:#4CAF50;color:white;border:none;padding:12px 25px;border-radius:25px;font-weight:bold;margin:10px;">
                    Claim Your Prize Now
                </button>
            </div>
        `;

        // Show the enhanced win notification
        showWinNotification(prize.text);

        // Add mobile vibration
        if (navigator.vibrate && isMobile) navigator.vibrate([120, 60, 120]);
    }

    function showWinNotification(prizeName) {
        // Initialize notification if it doesn't exist
        initWinNotification();
        
        const notification = document.getElementById('winNotification');
        const prizeText = document.getElementById('prizeText');
        
        if (notification && prizeText) {
            prizeText.textContent = prizeName;
            notification.style.display = 'flex';
            
            // Auto-hide after 30 seconds
            setTimeout(() => {
                if (notification.style.display === 'flex') {
                    closeWinNotification();
                }
            }, 30000);
        }
    }

    function closeWinNotification() {
        const notification = document.getElementById('winNotification');
        if (notification) {
            notification.style.display = 'none';
        }
    }

    function claimPrize() {
        // Get the prize name from the notification
        const prizeText = document.getElementById('prizeText');
        const prizeName = prizeText ? prizeText.textContent : 'Your Prize';
        
        // Show confirmation
        alert(`Congratulations! You've claimed: ${prizeName}\nRedirecting to claim page...`);
        
        // Close the notification
        closeWinNotification();
        
        // Redirect to profile page
        window.location.href = 'profile.html';
    }

    // Add event listeners
    spinBtn.addEventListener("click", spinWheel);
    
    // Initialize win notification on page load
    initWinNotification();
    
    // Draw initial wheel
    drawWheel();

    // Also make functions available globally for HTML onclick handlers
    window.showWinNotification = showWinNotification;
    window.closeWinNotification = closeWinNotification;
    window.claimPrize = claimPrize;
});
