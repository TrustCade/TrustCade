// Email notification system
class NotificationSystem {
    constructor() {
        this.notifications = [];
    }
    
    // Send win notification
    sendWinNotification(userEmail, prize, claimCode) {
        const notification = {
            type: 'win',
            to: userEmail,
            subject: `🎉 You Won ${prize} on TrustCade!`,
            body: this.generateWinEmail(prize, claimCode),
            timestamp: new Date(),
            sent: false
        };
        
        this.notifications.push(notification);
        this.saveNotification(notification);
        
        // In real app, send via email API
        console.log(`Email sent to ${userEmail}: You won ${prize}`);
        
        return notification;
    }
    
    // Generate win email HTML
    generateWinEmail(prize, claimCode) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem; text-align: center; }
                    .content { padding: 2rem; background: #f8f9fa; }
                    .prize-card { background: white; padding: 2rem; border-radius: 10px; margin: 1rem 0; }
                    .button { background: #8B5CF6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 5px; display: inline-block; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Congratulations! You Won!</h1>
                    </div>
                    <div class="content">
                        <div class="prize-card">
                            <h2>${prize}</h2>
                            <p>Claim Code: <strong>${claimCode}</strong></p>
                            <p>Login to your TrustCade account to claim your prize!</p>
                            <a href="https://trustcade.com/profile" class="button">Claim Your Prize</a>
                        </div>
                        <p>Need help? Contact support@trustcade.com</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    // Save notification to localStorage
    saveNotification(notification) {
        let notifications = JSON.parse(localStorage.getItem('trustcade_notifications')) || [];
        notifications.push(notification);
        localStorage.setItem('trustcade_notifications', JSON.stringify(notifications));
    }
    
    // Get user notifications
    getUserNotifications(email) {
        const notifications = JSON.parse(localStorage.getItem('trustcade_notifications')) || [];
        return notifications.filter(n => n.to === email);
    }
}

// Usage in your spin function
function handleWin(userEmail, prize) {
    const claimCode = `TC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Send email notification
    const notifier = new NotificationSystem();
    notifier.sendWinNotification(userEmail, prize, claimCode);
    
    // Also send in-app notification
    showInAppNotification(prize, claimCode);
}

// In-app notification
function showInAppNotification(prize, claimCode) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'in-app-notification';
    notification.innerHTML = `
        <div class="notification-icon">🎉</div>
        <div class="notification-content">
            <h4>You won ${prize}!</h4>
            <p>Claim code: ${claimCode}</p>
            <p>Check your email for details</p>
        </div>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        notification.remove();
    }, 10000);
}
// notifications.js
class EmailService {
    constructor() {
        this.apiKey = 'your_email_service_key';
    }
    
    async sendWelcome(email, name) {
        console.log(`Welcome email sent to ${email}`);
        return { success: true };
    }
    
    async sendWinNotification(email, prize, claimCode) {
        console.log(`Win notification sent to ${email}`);
        return { success: true };
    }
}
