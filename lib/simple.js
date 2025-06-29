const { jidNormalizedUser, areJidsSameUser } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

class Simple {
    constructor(conn) {
        this.conn = conn;
    }

    // Send message with different types
    async sendMessage(jid, content, options = {}) {
        try {
            return await this.conn.sendMessage(jid, content, options);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Send text message
    async sendText(jid, text, options = {}) {
        return this.sendMessage(jid, { text }, options);
    }

    // Send image message
    async sendImage(jid, image, caption = '', options = {}) {
        return this.sendMessage(jid, { image, caption }, options);
    }

    // Send video message
    async sendVideo(jid, video, caption = '', options = {}) {
        return this.sendMessage(jid, { video, caption }, options);
    }

    // Send audio message
    async sendAudio(jid, audio, options = {}) {
        return this.sendMessage(jid, { audio, ...options });
    }

    // Send sticker
    async sendSticker(jid, sticker, options = {}) {
        return this.sendMessage(jid, { sticker }, options);
    }

    // Send document
    async sendDocument(jid, document, filename, mimetype, caption = '', options = {}) {
        return this.sendMessage(jid, {
            document,
            fileName: filename,
            mimetype,
            caption
        }, options);
    }

    // Send location
    async sendLocation(jid, latitude, longitude, name = '', address = '', options = {}) {
        return this.sendMessage(jid, {
            location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude,
                name,
                address
            }
        }, options);
    }

    // Send contact
    async sendContact(jid, contacts, options = {}) {
        return this.sendMessage(jid, {
            contacts: {
                displayName: contacts[0]?.displayName || 'Contact',
                contacts
            }
        }, options);
    }

    // Send button message (legacy support)
    async sendButton(jid, text, buttons, footer = '', options = {}) {
        // Convert to regular message with text since buttons are deprecated
        let buttonText = `${text}\n\n`;
        buttons.forEach((btn, index) => {
            buttonText += `${index + 1}. ${btn.buttonText.displayText}\n`;
        });
        if (footer) buttonText += `\n${footer}`;
        
        return this.sendText(jid, buttonText, options);
    }

    // Send list message (legacy support)
    async sendList(jid, text, title, description, buttonText, sections, options = {}) {
        let listText = `${text}\n\n*${title}*\n${description}\n\n`;
        
        sections.forEach(section => {
            listText += `*${section.title}*\n`;
            section.rows.forEach((row, index) => {
                listText += `${index + 1}. ${row.title}`;
                if (row.description) listText += ` - ${row.description}`;
                listText += '\n';
            });
            listText += '\n';
        });
        
        return this.sendText(jid, listText, options);
    }

    // Group functions
    async groupMetadata(jid) {
        try {
            return await this.conn.groupMetadata(jid);
        } catch (error) {
            console.error('Error getting group metadata:', error);
            return null;
        }
    }

    async groupAdd(jid, participants) {
        try {
            return await this.conn.groupParticipantsUpdate(jid, participants, 'add');
        } catch (error) {
            console.error('Error adding participants:', error);
            throw error;
        }
    }

    async groupRemove(jid, participants) {
        try {
            return await this.conn.groupParticipantsUpdate(jid, participants, 'remove');
        } catch (error) {
            console.error('Error removing participants:', error);
            throw error;
        }
    }

    async groupPromote(jid, participants) {
        try {
            return await this.conn.groupParticipantsUpdate(jid, participants, 'promote');
        } catch (error) {
            console.error('Error promoting participants:', error);
            throw error;
        }
    }

    async groupDemote(jid, participants) {
        try {
            return await this.conn.groupParticipantsUpdate(jid, participants, 'demote');
        } catch (error) {
            console.error('Error demoting participants:', error);
            throw error;
        }
    }

    async groupUpdateSubject(jid, subject) {
        try {
            return await this.conn.groupUpdateSubject(jid, subject);
        } catch (error) {
            console.error('Error updating group subject:', error);
            throw error;
        }
    }

    async groupUpdateDescription(jid, description) {
        try {
            return await this.conn.groupUpdateDescription(jid, description);
        } catch (error) {
            console.error('Error updating group description:', error);
            throw error;
        }
    }

    async groupSettingUpdate(jid, setting) {
        try {
            return await this.conn.groupSettingUpdate(jid, setting);
        } catch (error) {
            console.error('Error updating group setting:', error);
            throw error;
        }
    }

    // Profile functions
    async updateProfilePicture(jid, media) {
        try {
            return await this.conn.updateProfilePicture(jid, media);
        } catch (error) {
            console.error('Error updating profile picture:', error);
            throw error;
        }
    }

    async updateProfileStatus(status) {
        try {
            return await this.conn.updateProfileStatus(status);
        } catch (error) {
            console.error('Error updating profile status:', error);
            throw error;
        }
    }

    // Utility functions
    async fetchStatus(jid) {
        try {
            return await this.conn.fetchStatus(jid);
        } catch (error) {
            console.error('Error fetching status:', error);
            return null;
        }
    }

    async getProfilePictureUrl(jid, type = 'image') {
        try {
            return await this.conn.profilePictureUrl(jid, type);
        } catch (error) {
            return null;
        }
    }

    async blockUser(jid) {
        try {
            return await this.conn.updateBlockStatus(jid, 'block');
        } catch (error) {
            console.error('Error blocking user:', error);
            throw error;
        }
    }

    async unblockUser(jid) {
        try {
            return await this.conn.updateBlockStatus(jid, 'unblock');
        } catch (error) {
            console.error('Error unblocking user:', error);
            throw error;
        }
    }

    // Message manipulation
    async deleteMessage(jid, key) {
        try {
            return await this.conn.sendMessage(jid, { delete: key });
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    async reactToMessage(jid, key, emoji) {
        try {
            return await this.conn.sendMessage(jid, {
                react: { text: emoji, key }
            });
        } catch (error) {
            console.error('Error reacting to message:', error);
            throw error;
        }
    }

    // File utilities
    async downloadMediaMessage(message) {
        try {
            const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
            const type = Object.keys(message)[0];
            const content = message[type];
            
            const stream = await downloadContentFromMessage(content, type.replace('Message', ''));
            const buffer = Buffer.from([]);
            
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            return buffer;
        } catch (error) {
            console.error('Error downloading media:', error);
            throw error;
        }
    }

    // Format phone number
    formatPhoneNumber(number) {
        let formatted = number.replace(/[^0-9]/g, '');
        if (!formatted.startsWith('1') && formatted.length === 10) {
            formatted = '1' + formatted;
        }
        return formatted + '@s.whatsapp.net';
    }

    // Check if user is admin in group
    async isAdmin(jid, userJid) {
        try {
            const metadata = await this.groupMetadata(jid);
            if (!metadata) return false;
            
            const participant = metadata.participants.find(p => areJidsSameUser(p.id, userJid));
            return participant?.admin === 'admin' || participant?.admin === 'superadmin';
        } catch (error) {
            return false;
        }
    }

    // Check if bot is admin in group
    async isBotAdmin(jid) {
        try {
            return await this.isAdmin(jid, this.conn.user.id);
        } catch (error) {
            return false;
        }
    }
}

module.exports = { Simple };
