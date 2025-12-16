// Create api.js for backend simulation
const API = {
    users: [],
    winners: [],
    prizes: [],
    
    login(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.users.find(u => u.email === email);
                if (user && user.password === password) {
                    resolve({ success: true, user });
                } else {
                    resolve({ success: false, error: 'Invalid credentials' });
                }
            }, 1000);
        });
    },
    
    register(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { ...userData, id: Date.now() };
                this.users.push(newUser);
                resolve({ success: true, user: newUser });
            }, 1000);
        });
    }
};
