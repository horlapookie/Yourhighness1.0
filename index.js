const { makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore, jidNormalizedUser } = require('@whiskeysockets/baileys');
const pino = require('pino');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { Connection } = require('./lib/connection');
const { serialize } = require('./lib/serialize');
const messageHandler = require('./handlers/message');

// Global cache for storing session data
global.msgRetryCounterCache = new NodeCache();

class YourHighnessBot {
constructor() {
this.conn = null;
this.connection = new Connection();
this.isConnected = false;
}

async start() {
console.log('🚀 Starting yourhïghness Bot...');

try {    
    await this.initializeBot();    
} catch (error) {    
    console.error('❌ Error starting bot:', error);    
    process.exit(1);    
}

}

async initializeBot() {
// Load session from SESSION_ID if provided
if (config.SESSION_ID) {
await this.loadSessionFromId();
}

const { state, saveCreds } = await useMultiFileAuthState('./session');    
await this.createConnection(state, saveCreds);

}

async loadSessionFromId() {
try {
console.log('🔄 Loading session from SESSION_ID...');

// Decode base64 session    
    const sessionData = JSON.parse(Buffer.from(config.SESSION_ID, 'base64').toString());    

    // Ensure session directory exists    
    if (!fs.existsSync('./session')) {    
        fs.mkdirSync('./session', { recursive: true });    
    }    

    // Write session data to creds.json    
    fs.writeFileSync('./session/creds.json', JSON.stringify(sessionData, null, 2));    

    console.log('✅ Session loaded successfully from SESSION_ID');    
} catch (error) {    
    console.error('❌ Error loading session from SESSION_ID:', error);    
    console.log('🔄 Continuing with existing session files...');    
}

}

async createConnection(state, saveCreds) {
const conn = makeWASocket({
logger: pino({ level: 'silent' }),
printQRInTerminal: false,
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
},
msgRetryCounterCache: global.msgRetryCounterCache,
generateHighQualityLinkPreview: true,
shouldSyncHistoryMessage: () => true,
markOnlineOnConnect: true
});

conn.ev.on('creds.update', saveCreds);    

conn.ev.on('connection.update', async (update) => {    
    const { connection, lastDisconnect } = update;    

    if (connection === 'open') {    
        console.log('✅ yourhïghness Bot is now online!');    
        this.isConnected = true;    

        const botNumber = conn.user.id.split(':')[0];
        console.log('✅ Connected to WhatsApp successfully!');
        console.log(`📱 Bot Number: ${conn.user.id}`);

        config.setOwnerNumber(botNumber);

        if (!fs.existsSync('./session/connection_sent.flag')) {    
            await this.sendConnectionSuccessMessage(conn);    
            await this.notifyOwner(conn);    
            fs.writeFileSync('./session/connection_sent.flag', 'true');    
        }    
    }    

    if (connection === 'close') {    
        this.isConnected = false;    
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;    

        if (shouldReconnect) {    
            console.log('🔄 Connection lost, attempting to reconnect...');    
            setTimeout(() => this.initializeBot(), 5000);    
        } else {    
            console.log('❌ Logged out from WhatsApp');    
            if (fs.existsSync('./session/connection_sent.flag')) {    
                fs.unlinkSync('./session/connection_sent.flag');    
            }    
        }    
    }    

    if (connection === 'connecting') {    
        console.log('🔄 Connecting to WhatsApp...');    
    }    
});    

this.conn = conn;    
await this.setupEventHandlers();

}

async setupEventHandlers() {
if (!this.conn) return;

// Message handler    
this.conn.ev.on('messages.upsert', async (chatUpdate) => {    
    try {    
        await messageHandler(this.conn, chatUpdate);    
    } catch (error) {    
        console.error('❌ Error handling message:', error);    
    }    
});    

// Add connection instance to global scope for commands    
global.conn = this.conn;

}

async sendConnectionSuccessMessage(conn) {
try {
const botNumber = conn.user?.id?.split(':')[0];
const botJid = `${botNumber}@s.whatsapp.net`;

// Also send to owner if different from bot number    
    const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;    

    const message = {    
        image: { url: 'https://files.catbox.moe/9maq9y.jpg' },    
        caption: `✅ *You have successfully connected to yourhïghness!*\n\n` +    
                `Use the command *${config.PREFIX}help* to see all available commands.\n\n` +    
                `📱 *Bot Information:*\n` +    
                `• Name: yourhïghness\n` +    
                `• Version: 4.7 (Latest)\n` +    
                `• Creator: horlapookie\n` +    
                `• Prefix: ${config.PREFIX}\n` +    
                `• Connected Number: ${botNumber}\n` +    
                `• Mode: Private (Only connected number can use commands)\n\n` +    
                `Use *${config.PREFIX}mode-public* to allow everyone to use commands.\n\n` +    
                `🔗 *Join our channel:*\n` +    
                `https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01`    
    };    

    await conn.sendMessage(botJid, message);    
    console.log(`📤 Connection success message sent to bot number: ${botNumber}`);    

    if (botNumber !== config.OWNER_NUMBER) {    
        await conn.sendMessage(ownerJid, message);    
        console.log('📤 Connection success message also sent to owner');    
    }    
} catch (error) {    
    console.error('❌ Error sending connection success message:', error);    
}

}

async notifyOwner(conn) {
try {
const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
await conn.sendMessage(ownerJid, {
text: `🤖 *Bot Connected Successfully!* 🤖\n\n` +
`📱 Bot Number: ${conn.user.id}\n` +
`👑 Owner Number: ${config.OWNER_NUMBER}\n` +
`⏰ Connected at: ${new Date().toLocaleString()}\n` +
`🔧 Bot Name: ${config.BOT_NAME}\n` +
`📋 Version: ${config.VERSION}\n\n` +
`_Bot is now online and ready to serve!_\n` +
`🔗 ${config.CHANNEL_URL}`
});
} catch (error) {
console.error('❌ Error notifying owner:', error);
}
}

}

const bot = new YourHighnessBot();
bot.start().catch(console.error);

// Handle process termination
process.on('SIGINT', () => {
console.log('\n👋 yourhïghness Bot is shutting down...');
process.exit(0);
});

process.on('uncaughtException', (error) => {
console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
console.error('❌ Unhandled Rejection:', error);
});

