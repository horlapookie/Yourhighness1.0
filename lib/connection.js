const { makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('../config');

class Connection {
    constructor() {
        this.conn = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async createConnection() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState('./session');
            
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
                markOnlineOnConnect: config.ALWAYS_ONLINE,
                defaultQueryTimeoutMs: 60000,
                keepAliveIntervalMs: 10000,
                retryRequestDelayMs: 5000,
                maxMsgRetryCount: 3,
                syncFullHistory: false,
                fireInitQueries: true,
                emitOwnEvents: true,
                cachedGroupMetadata: async (jid) => {
                    // Implement cached group metadata if needed
                    return null;
                }
            });

            // Set connection instance
            this.conn = conn;
            
            // Save credentials on update
            conn.ev.on('creds.update', saveCreds);
            
            return conn;
        } catch (error) {
            console.error('❌ Failed to create connection:', error);
            throw error;
        }
    }

    handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('📱 QR Code received');
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            
            console.log('🔴 Connection closed due to:', lastDisconnect?.error?.message || 'Unknown reason');
            
            if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                
                setTimeout(() => {
                    this.createConnection().catch(console.error);
                }, 5000 * this.reconnectAttempts); // Exponential backoff
            } else if (!shouldReconnect) {
                console.log('❌ Logged out from WhatsApp');
                this.reconnectAttempts = 0;
            } else {
                console.log('❌ Max reconnection attempts reached');
            }
        } else if (connection === 'open') {
            console.log('✅ Connected to WhatsApp');
            this.reconnectAttempts = 0;
        } else if (connection === 'connecting') {
            console.log('🔄 Connecting to WhatsApp...');
        }
    }

    async sendPresenceUpdate(presence, jid) {
        try {
            if (this.conn) {
                await this.conn.sendPresenceUpdate(presence, jid);
            }
        } catch (error) {
            console.error('Error updating presence:', error);
        }
    }

    async readMessages(keys) {
        try {
            if (this.conn && config.AUTO_READ) {
                await this.conn.readMessages(keys);
            }
        } catch (error) {
            console.error('Error reading messages:', error);
        }
    }

    isConnected() {
        return this.conn && this.conn.user;
    }

    getConnection() {
        return this.conn;
    }

    async close() {
        if (this.conn) {
            await this.conn.end();
            this.conn = null;
        }
    }
}

module.exports = { Connection };
