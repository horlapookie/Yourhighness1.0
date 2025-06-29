require('dotenv').config();

module.exports = {
    // Bot Configuration
    BOT_NAME: 'yourhïghness',
    CREATOR_NAME: 'horlapookie',
    CREATOR_NUMBER: null,
    VERSION: '1.0',

    // User Configurable Settings
    OWNER_NUMBER: null,
    BOT_NUMBER: process.env.BOT_NUMBER || '',
    PREFIX: process.env.PREFIX || '/',
    SESSION_ID: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZU1QS0JoUVRwY2pQN2g1YlJxdDl0d2ZDdEgwOFlrYkx1eXJLMWRWVXlrZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUxrTHVpcUhjU0tsRlpuVGlINUsrS3pZMTdNVVZGMkplbU9mcGlTTy9VND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHRjZtTG4xM0hhTXpiaUExZ1J4ZjlqYXBxOStTMFp5YWFKUGNjSWVkaFU0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFSGE0ZEUwMnl3R2NwcDIvN2RMaXhNK0ZuamRyTS9TeWVmcHk0VjBMVUFJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNEUHhmbEhWbGFaeW50dytJS3Y3byt0VEtrSVNQaDZCOGZ2dWRjMUd1bDA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkZoRGNWN0JBdlp4elV0djdENEZFbzNZVFFua21ZQXlqZTBtVE9hN3g4R2s9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0FmVEt0ZlJjZW1iOFpiNk1CbG9IUzU4ZmNJM2hFMkExQ1phYmhzcXpWVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRE95MURpR0J1cjN4VU5KY1k1bVA5Y0dScXpXSHpTYlRzVGJtM3dCNGNBST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im5heC9jc1lTZWhTZitVUkl1R2pTMXlWdnRGUDQwWWR5UlhvV3FpWjVhaGlYRm9TWWloOVh0ZDZjNnA3anF3MU52bXZrYjYxQVZCVGR0ak9hYnpEOGhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTE2LCJhZHZTZWNyZXRLZXkiOiI2M2xkcmwwRDlkMlFGeXpCbUNzN1VtK08yc1VMNERlaGt2VisrYVZUZU1ZPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIzNDcwNDkwNDQ4OTdAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQjE1MTg1OUQ5QkMxNjQxMzc1NzAxNDhBQ0QxMDExREEifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1MTE4MjkyOX0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjM0NzA0OTA0NDg5N0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI5MzFFQzM4NDEwMTE3QjVDRkE4OTVGQjFGRUUwMUUyMSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUxMTgyOTI5fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyMzQ3MDQ5MDQ0ODk3QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjQwQURGRUZFNDQxMDY1MEIwQTUyMzcyRDgwQzNDQTRBIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NTExODI5NzN9LHsia2V5Ijp7InJlbW90ZUppZCI6IjIzNDcwNDkwNDQ4OTdAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiODc2NjE4RTRGN0ZDN0Y1MTlDQjZDNzAzREMyQkU3ODYifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1MTE4Mjk3NH1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiRkNMTThIQ1AiLCJtZSI6eyJpZCI6IjIzNDcwNDkwNDQ4OTc6MTRAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIyMTI0NzI3MDMyNjY4NDc6MTRAbGlkIiwibmFtZSI6InlvdXIgSGlnaG5lc3MifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0ozUnM2Y0NFTUhjZzhNR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IjIvNG5LYTBrU0RNcHpTYituNlBZZWhJT1VlVGY2b3NoVFEzSTdueTB5bGM9IiwiYWNjb3VudFNpZ25hdHVyZSI6Iko1eU4zbldLSjJOdFZVQUV2UGdOd1BmaGRoUnF6a0cvejdLdkcyZVpraGNNeFlBZllYWUdhaGxxQ2Z5NFBQQWRkbDc2MmRwbmtyUFFzeE15Q2kybkNBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJDVHFxMER0aUIxbmJ4NlNqd2Y4ekNDRTVaNlk4NGYzVTRLbVVUYmhSL3VWQmQycDc2QkNPcDFNNjlWRGFtVWVYOUpDZGUydG5NRGZQUjBvcWRId0xnZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIzNDcwNDkwNDQ4OTc6MTRAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZHYrSnltdEpFZ3pLYzBtL3ArajJIb1NEbEhrMytxTElVME55TzU4dE1wWCJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0JJSUFnPT0ifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzUxMTgyOTI2LCJsYXN0UHJvcEhhc2giOiIyRzRBbXUiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUtubCJ9',
    PHONE_NUMBER: process.env.PHONE_NUMBER || '',

    // Bot Settings
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS === 'true',
    AUTO_REACT: process.env.AUTO_REACT === 'true',
    AUTO_TYPING: process.env.AUTO_TYPING === 'true',
    AUTO_RECORDING: process.env.AUTO_RECORDING === 'true',
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === 'true',
    AUTO_READ: process.env.AUTO_READ === 'true',

    // Anti Features
    ANTI_VIEWONCE: process.env.ANTI_VIEWONCE === 'true',
    ANTI_DELETE: process.env.ANTI_DELETE === 'true',
    ANTI_CALL: process.env.ANTI_CALL === 'true',

    // API Keys
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',

    // Images
    PROFILE_IMAGE: 'https://files.catbox.moe/ya1lsv.jpeg',
    MENU_IMAGE: 'https://files.catbox.moe/9maq9y.jpg',

    // Channel
    CHANNEL_URL: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',

    // Command Categories
    COMMANDS: {
        VIEWONCE: ['vv', 'vv2'],
        CHESS: ['accept-ch', 'chess', 'chess-challenge', 'forfeit-chess', 'move', 'reject-ch'],
        FUN: ['brazzers', 'chat', 'chatgpt', 'fact', 'friendship', 'imagine', 'joke', 'memo', 'reaction', 'ship', 'simp', 'thug-life', 'triggered', 'tweet'],
        GAMES: ['akinator', 'answer', 'dots-and-boxes', 'dragon', 'forfeit-quiz', 'hangman', 'start-quiz', 'tictactoe'],
        GENERAL: ['card-events', 'faq', 'help', 'hi', 'info', 'inventory', 'leaderboard', 'mods', 'profile', 'rank', 'reset-icon', 'reset-bio', 'reset-username', 'rules', 'set-bio', 'set-icon', 'set-username', 'support', 'webpass', 'webuser'],
        MEDIA: ['deaudio', 'gisearch', 'instagram', 'lyrics', 'pinterest', 'play', 'spotify', 'subreddit', 'tiktok', 'twitter', 'yta', 'yts', 'ytv'],
        MODERATION: ['close', 'delete', 'demote', 'disable', 'enable', 'open', 'ping', 'promote', 'purge', 'remove', 'setprofile'],
        UTILS: ['calculator', 'carbon', 'coubs', 'crypto', 'img', 'quotly', 'react', 'retrieve', 'screenshot', 'steal', 'sticker', 'telesticker', 'track', 'translator', 'trivia', 'upload', 'urbandictionary', 'wikipedia'],
        WEEB: ['anime', 'character', 'divorce', 'foxgirl', 'haigusha', 'hg', 'kitsune', 'manga', 'marry', 'neko', 'waifu', 'wallpaper'],
        GROUP: ['add', 'kick', 'remove', 'everyone', 'tagall', 'leavegc', 'join', 'invite', 'getname', 'getdeskgc', 'getppgc', 'setppgc', 'svcontact', 'listonline', 'opengroup', 'closegroup', 'linkgc', 'resetlink', 'creategc', 'hidetag', 'promote', 'demote', 'promoteall', 'demoteall', 'kickall', 'warn'],
        OWNER: ['chatbot', 'chatbotgc', 'chatbotall', 'update', 'shutdown', 'setbio', 'mode-private', 'mode-public', 'report', 'clearchat', 'setpp', 'getpp', 'listblock', 'block', 'unblock', 'getbio', 'restart', 'antiviewonce', 'antidelete', 'anticall', 'autoviewstatus', 'autostatusreact', 'autobio', 'autoreact', 'autotyping', 'autorecording', 'alwaysonline', 'autoread', 'unavailable', 'delete', 'mode', 'sudo', 'delsudo', 'listsudo', '$', '=>', '>', 'premium', 'buypremium', 'addcase', 'delcase', 'restart', 'stop']
    },

    // Get total command count
    getTotalCommands() {
        return Object.values(this.COMMANDS).flat().length;
    },

    // Set owner number automatically
    setOwnerNumber: (number) => {
        module.exports.OWNER_NUMBER = number;
        module.exports.CREATOR_NUMBER = number;
        console.log(`📱 Owner number set to: ${number}`);
    },

    // Check if user is owner
    isOwner(jid) {
        if (!module.exports.OWNER_NUMBER) return false;
        const number = jid.split('@')[0];
        return number === module.exports.OWNER_NUMBER;
    },

    // Check if user is connected bot number
    isConnectedNumber(number, botNumber) {
        if (!botNumber) return false;
        const cleanNumber = number.replace(/[^0-9]/g, '');
        const cleanBotNumber = botNumber.replace(/[^0-9]/g, '');
        return cleanNumber === cleanBotNumber;
    },

    // Get current time formatted
    getTime() {
        return new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Get current date formatted
    getDate() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Get day name
    getDay() {
        return new Date().toLocaleDateString('en-US', { weekday: 'long' });
    }
};