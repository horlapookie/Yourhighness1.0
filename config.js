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
    SESSION_ID: process.env.SESSION_ID || '',
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