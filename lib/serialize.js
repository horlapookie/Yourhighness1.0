const { jidNormalizedUser, extractMessageContent, areJidsSameUser, downloadContentFromMessage } = require('@whiskeysockets/baileys');

function serialize(conn, msg) {
    if (!msg) return msg;

    // Basic message info
    msg.conn = conn;
    msg.key = msg.key || {};
    msg.from = msg.key.remoteJid;
    msg.fromMe = msg.key.fromMe;
    msg.id = msg.key.id;
    msg.isGroup = msg.from?.endsWith('@g.us');
    msg.sender = msg.fromMe ? jidNormalizedUser(conn.user.id) : (msg.isGroup ? msg.key.participant : msg.from);

    // Message content
    const content = extractMessageContent(msg.message);
    msg.mtype = Object.keys(content || {})[0] || 'unknown';
    msg.msg = content?.[msg.mtype] || {};
    msg.body = msg.msg?.text || msg.msg?.caption || '';
    
    // Quote/reply handling
    if (msg.msg?.contextInfo?.quotedMessage) {
        msg.quoted = {
            key: {
                remoteJid: msg.from,
                fromMe: areJidsSameUser(msg.msg.contextInfo.participant || msg.sender, conn.user.id),
                id: msg.msg.contextInfo.stanzaId,
                participant: msg.msg.contextInfo.participant
            },
            message: msg.msg.contextInfo.quotedMessage,
            sender: msg.msg.contextInfo.participant,
            mtype: Object.keys(msg.msg.contextInfo.quotedMessage)[0],
            msg: msg.msg.contextInfo.quotedMessage[Object.keys(msg.msg.contextInfo.quotedMessage)[0]],
            body: msg.msg.contextInfo.quotedMessage[Object.keys(msg.msg.contextInfo.quotedMessage)[0]]?.text || 
                  msg.msg.contextInfo.quotedMessage[Object.keys(msg.msg.contextInfo.quotedMessage)[0]]?.caption || ''
        };
    }

    // Media handling
    msg.isMedia = !!(msg.msg?.url || msg.msg?.directPath);
    msg.isVideo = msg.mtype === 'videoMessage';
    msg.isImage = msg.mtype === 'imageMessage';
    msg.isAudio = msg.mtype === 'audioMessage';
    msg.isSticker = msg.mtype === 'stickerMessage';
    msg.isDocument = msg.mtype === 'documentMessage';
    msg.isViewOnce = !!(msg.msg?.viewOnce);

    // Download media function
    msg.download = async () => {
        if (!msg.isMedia) throw new Error('Not a media message');
        
        try {
            const stream = await downloadContentFromMessage(msg.msg, msg.mtype.replace('Message', ''));
            const buffer = Buffer.from([]);
            
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            return buffer;
        } catch (error) {
            throw new Error('Failed to download media: ' + error.message);
        }
    };

    // Utility functions
    msg.reply = async (text, options = {}) => {
        return conn.sendMessage(msg.from, { text, ...options }, { quoted: msg });
    };

    msg.replyWithMedia = async (media, text = '', options = {}) => {
        const mediaType = options.type || 'image';
        const mediaObj = {};
        mediaObj[mediaType] = media;
        if (text) mediaObj.caption = text;
        
        return conn.sendMessage(msg.from, { ...mediaObj, ...options }, { quoted: msg });
    };

    msg.react = async (emoji) => {
        return conn.sendMessage(msg.from, {
            react: {
                text: emoji,
                key: msg.key
            }
        });
    };

    msg.delete = async () => {
        return conn.sendMessage(msg.from, { delete: msg.key });
    };

    return msg;
}

module.exports = { serialize };
