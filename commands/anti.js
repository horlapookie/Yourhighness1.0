const config = require('../config');
const db = require('../lib/database');
const { Simple } = require('../lib/simple');

const commands = {
    // Anti-link system
    antilink: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-link settings.');
            }

            const groupData = db.getGroup(msg.from);
            const currentStatus = groupData.antilink || false;

            await msg.reply(
                `🔗 *ANTI-LINK STATUS* 🔗\n\n` +
                `**Current Status:** ${currentStatus ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `**Available Commands:**\n` +
                `• \`+antilink-kick on/off\` - Auto kick link senders\n` +
                `• \`+antilink-warn on/off\` - Warn link senders\n` +
                `• \`+antilink-delete on/off\` - Delete link messages\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antilink command:', error);
            await msg.reply('❌ Failed to check anti-link status.');
        }
    },

    // Anti-link with kick
    'antilink-kick': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);
            const isBotAdmin = await simple.isBotAdmin(msg.from);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-link settings.');
            }

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to kick members.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antilink-kick on/off`');
            }

            const isEnabled = setting === 'on';
            const groupData = db.getGroup(msg.from);
            groupData.antilink = isEnabled;
            groupData.antilinkAction = 'kick';
            db.updateGroup(msg.from, groupData);

            await msg.reply(
                `🔗 *ANTI-LINK KICK* 🔗\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Members who send links will be automatically kicked.' : 'Anti-link kick has been disabled.'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antilink-kick command:', error);
            await msg.reply('❌ Failed to toggle anti-link kick.');
        }
    },

    // Anti-link with warning
    'antilink-warn': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-link settings.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antilink-warn on/off`');
            }

            const isEnabled = setting === 'on';
            const groupData = db.getGroup(msg.from);
            groupData.antilink = isEnabled;
            groupData.antilinkAction = 'warn';
            db.updateGroup(msg.from, groupData);

            await msg.reply(
                `⚠️ *ANTI-LINK WARN* ⚠️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Members who send links will receive warnings.' : 'Anti-link warnings have been disabled.'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antilink-warn command:', error);
            await msg.reply('❌ Failed to toggle anti-link warnings.');
        }
    },

    // Anti-link with delete
    'antilink-delete': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-link settings.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antilink-delete on/off`');
            }

            const isEnabled = setting === 'on';
            const groupData = db.getGroup(msg.from);
            groupData.antilink = isEnabled;
            groupData.antilinkAction = 'delete';
            db.updateGroup(msg.from, groupData);

            await msg.reply(
                `🗑️ *ANTI-LINK DELETE* 🗑️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Link messages will be automatically deleted.' : 'Anti-link delete has been disabled.'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antilink-delete command:', error);
            await msg.reply('❌ Failed to toggle anti-link delete.');
        }
    },

    // Anti-delete system
    antidelete: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-delete settings.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antidelete on/off`');
            }

            const isEnabled = setting === 'on';
            const groupData = db.getGroup(msg.from);
            groupData.antidelete = isEnabled;
            db.updateGroup(msg.from, groupData);

            await msg.reply(
                `🛡️ *ANTI-DELETE* 🛡️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Deleted messages will be saved and reshared.' : 'Anti-delete has been disabled.'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antidelete command:', error);
            await msg.reply('❌ Failed to toggle anti-delete.');
        }
    },

    // Anti-spam system
    antispam: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-spam settings.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antispam on/off`');
            }

            const isEnabled = setting === 'on';
            const groupData = db.getGroup(msg.from);
            groupData.antispam = isEnabled;
            db.updateGroup(msg.from, groupData);

            await msg.reply(
                `🚫 *ANTI-SPAM* 🚫\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Spam messages will be detected and action taken.' : 'Anti-spam has been disabled.'}\n\n` +
                `**Detection Criteria:**\n` +
                `• Repeated messages (5+ identical)\n` +
                `• Excessive caps (80%+ uppercase)\n` +
                `• Flood messages (10+ in 1 minute)\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antispam command:', error);
            await msg.reply('❌ Failed to toggle anti-spam.');
        }
    },

    // Anti-tag system
    antitag: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-tag settings.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antitag on/off`');
            }

            const isEnabled = setting === 'on';
            const groupData = db.getGroup(msg.from);
            groupData.antitag = isEnabled;
            db.updateGroup(msg.from, groupData);

            await msg.reply(
                `🏷️ *ANTI-TAG* 🏷️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Mass tagging (5+ mentions) will be prevented.' : 'Anti-tag has been disabled.'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antitag command:', error);
            await msg.reply('❌ Failed to toggle anti-tag.');
        }
    },

    // Anti-NSFW system
    antitemu: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can manage anti-NSFW settings.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antitemu on/off`');
            }

            const isEnabled = setting === 'on';
            const groupData = db.getGroup(msg.from);
            groupData.antitemu = isEnabled;
            db.updateGroup(msg.from, groupData);

            await msg.reply(
                `🔞 *ANTI-NSFW* 🔞\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'NSFW content will be detected and removed.' : 'Anti-NSFW has been disabled.'}\n\n` +
                `**Protection includes:**\n` +
                `• Adult content detection\n` +
                `• Inappropriate images\n` +
                `• Explicit text filtering\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antitemu command:', error);
            await msg.reply('❌ Failed to toggle anti-NSFW.');
        }
    }
};

module.exports = commands;