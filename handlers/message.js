const { serialize } = require('../lib/serialize'); const commandHandler = require('./command'); const config = require('../config'); const db = require('../lib/database');

async function messageHandler(conn, chatUpdate) { try { const { messages, type } = chatUpdate; if (!messages || messages.length === 0 || type !== 'notify') return;

for (const rawMsg of messages) {
        const msg = serialize(conn, rawMsg);
        if (!msg || !msg.message) continue;
        if (msg.fromMe) continue;

        const botMode = db.getSetting('bot_mode', 'private');
        const isOwner = config.isOwner(msg.sender);
        const botNumber = conn.user?.id?.split(':')[0];
        const isConnectedNumber = msg.sender.split('@')[0] === botNumber;

        if (botMode === 'private' && !isConnectedNumber && !isOwner) {
            continue;
        }

        if (msg.sender) {
            const user = db.getUser(msg.sender);
            user.lastSeen = new Date().toISOString();
            if (msg.pushName) user.name = msg.pushName;
            db.updateUser(msg.sender, user);
        }

        if (config.AUTO_READ) {
            await conn.readMessages([msg.key]);
        }

        if (config.AUTO_TYPING && !msg.isGroup) {
            await conn.sendPresenceUpdate('composing', msg.from);
            setTimeout(() => conn.sendPresenceUpdate('paused', msg.from), 2000);
        }

        if (config.AUTO_RECORDING && msg.isAudio) {
            await conn.sendPresenceUpdate('recording', msg.from);
            setTimeout(() => conn.sendPresenceUpdate('paused', msg.from), 2000);
        }

        await processAntiFeatures(conn, msg);

        if (config.ANTI_VIEWONCE && msg.isViewOnce) {
            await handleAntiViewOnce(conn, msg);
        }

        if (msg.body && msg.body.startsWith(config.PREFIX)) {
            if (botMode === 'private' && !isConnectedNumber && !isOwner) {
                await msg.reply('🔒 Bot is in private mode. Only the connected number can use commands.');
                return;
            }
            await commandHandler(conn, msg);
            return;
        }

        if (config.AUTO_REACT && Math.random() < 0.1) {
            const reactions = ['😊', '👍', '❤️', '😂', '🔥', '👏', '💯'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            await msg.react(randomReaction);
        }

        console.log(`📨 ${msg.isGroup ? 'Group' : 'Private'} message from ${msg.pushName || msg.sender}: ${msg.body.substring(0, 50)}${msg.body.length > 50 ? '...' : ''}`);
    }
} catch (error) {
    console.error('❌ Error in message handler:', error);
}

}

module.exports = messageHandler;

