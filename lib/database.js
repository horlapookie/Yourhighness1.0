const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dataDir = './data';
        this.ensureDataDir();
        
        // Initialize database files
        this.users = this.loadData('users.json', {});
        this.groups = this.loadData('groups.json', {});
        this.settings = this.loadData('settings.json', {});
        this.games = this.loadData('games.json', {});
        this.economy = this.loadData('economy.json', {});
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    loadData(filename, defaultData = {}) {
        const filePath = path.join(this.dataDir, filename);
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
        }
        return defaultData;
    }

    saveData(filename, data) {
        const filePath = path.join(this.dataDir, filename);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Error saving ${filename}:`, error);
            return false;
        }
    }

    // User management
    getUser(jid) {
        const id = jid.split('@')[0];
        if (!this.users[id]) {
            this.users[id] = {
                jid,
                name: '',
                bio: '',
                username: '',
                rank: 'Bronze',
                xp: 0,
                level: 1,
                coins: 100,
                inventory: [],
                married: null,
                warnings: 0,
                joinDate: new Date().toISOString(),
                lastSeen: new Date().toISOString()
            };
            this.saveUsers();
        }
        return this.users[id];
    }

    updateUser(jid, data) {
        const id = jid.split('@')[0];
        if (this.users[id]) {
            Object.assign(this.users[id], data);
            this.saveUsers();
            return true;
        }
        return false;
    }

    saveUsers() {
        return this.saveData('users.json', this.users);
    }

    // Group management
    getGroup(jid) {
        if (!this.groups[jid]) {
            this.groups[jid] = {
                jid,
                name: '',
                desc: '',
                settings: {
                    welcome: false,
                    goodbye: false,
                    antilink: false,
                    antispam: false,
                    chatbot: false
                },
                members: [],
                admins: [],
                joinDate: new Date().toISOString()
            };
            this.saveGroups();
        }
        return this.groups[jid];
    }

    updateGroup(jid, data) {
        if (this.groups[jid]) {
            Object.assign(this.groups[jid], data);
            this.saveGroups();
            return true;
        }
        return false;
    }

    saveGroups() {
        return this.saveData('groups.json', this.groups);
    }

    // Game management
    getGame(type, jid) {
        const key = `${type}_${jid}`;
        return this.games[key] || null;
    }

    setGame(type, jid, data) {
        const key = `${type}_${jid}`;
        this.games[key] = data;
        this.saveGames();
    }

    deleteGame(type, jid) {
        const key = `${type}_${jid}`;
        delete this.games[key];
        this.saveGames();
    }

    saveGames() {
        return this.saveData('games.json', this.games);
    }

    // Economy management
    getEconomy(jid) {
        const id = jid.split('@')[0];
        if (!this.economy[id]) {
            this.economy[id] = {
                balance: 1000,
                bank: 0,
                lastDaily: null,
                lastWeekly: null,
                lastWork: null,
                job: null,
                inventory: {},
                transactions: []
            };
            this.saveEconomy();
        }
        return this.economy[id];
    }

    updateEconomy(jid, data) {
        const id = jid.split('@')[0];
        if (this.economy[id]) {
            Object.assign(this.economy[id], data);
            this.saveEconomy();
            return true;
        }
        return false;
    }

    saveEconomy() {
        return this.saveData('economy.json', this.economy);
    }

    // Settings management
    getSetting(key, defaultValue = null) {
        return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
    }

    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        return true;
    }

    saveSettings() {
        return this.saveData('settings.json', this.settings);
    }
}

module.exports = new Database();
