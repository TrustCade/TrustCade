// database.js
class LocalStorageDB {
    constructor(prefix = 'trustcade_') {
        this.prefix = prefix;
    }
    
    save(key, data) {
        localStorage.setItem(this.prefix + key, JSON.stringify(data));
    }
    
    load(key) {
        const data = localStorage.getItem(this.prefix + key);
        return data ? JSON.parse(data) : null;
    }
    
    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }
                             }
