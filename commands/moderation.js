const config = require('../config');
const { Simple } = require('../lib/simple');

const commands = {
    // Close group (restrict messages to admins only)
    close: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to close the group.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can close the group.');
            }

            await simple.groupSettingUpdate(msg.from, 'announcement');
            
            await msg.reply(
                `🔒 *GROUP CLOSED* 🔒\n\n` +
                `The group has been restricted to admins only.\n` +
                `Only admins can send messages now.\n\n` +
                `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in close command:', error);
            await msg.reply('❌ Failed to close the group.');
        }
    },

    // Delete message
    delete: async (conn, msg, args) => {
        try {
            if (!msg.quoted) {
                return msg.reply('❌ Please reply to a message to delete it.');
            }

            const simple = new Simple(conn);
            
            if (msg.isGroup) {
                const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);
                if (!isUserAdmin && !config.isOwner(msg.sender)) {
                    return msg.reply('❌ Only group admins can delete messages.');
                }
            } else if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ Only the bot owner can delete messages in private chats.');
            }

            await conn.sendMessage(msg.from, { delete: msg.quoted.key });
            await msg.reply('✅ Message deleted successfully.');

        } catch (error) {
            console.error('Error in delete command:', error);
            await msg.reply('❌ Failed to delete the message.');
        }
    },

    // Demote user from admin
    demote: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to demote users.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can demote users.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || mentioned.length === 0) {
                return msg.reply('❌ Please mention users to demote.\n\nUsage: `+demote @user1 @user2`');
            }

            const demoted = [];
            const failed = [];

            for (const userJid of mentioned) {
                try {
                    const isTargetAdmin = await simple.isAdmin(msg.from, userJid);
                    if (!isTargetAdmin) {
                        failed.push(userJid.split('@')[0]);
                        continue;
                    }

                    await simple.groupDemote(msg.from, [userJid]);
                    demoted.push(userJid.split('@')[0]);
                } catch (error) {
                    failed.push(userJid.split('@')[0]);
                }
            }

            let response = `👤 *USER DEMOTION* 👤\n\n`;
            
            if (demoted.length > 0) {
                response += `✅ **Demoted:**\n`;
                demoted.forEach(user => response += `• ${user}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to demote:**\n`;
                failed.forEach(user => response += `• ${user}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response, { mentions: mentioned });

        } catch (error) {
            console.error('Error in demote command:', error);
            await msg.reply('❌ Failed to demote users.');
        }
    },

    // Disable command (owner only)
    disable: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!args[0]) {
                return msg.reply('❌ Please specify a command to disable.\n\nUsage: `+disable <command>`');
            }

            const commandName = args[0].toLowerCase();
            
            // This would integrate with a command management system
            await msg.reply(
                `🚫 *COMMAND MANAGEMENT* 🚫\n\n` +
                `Command: ${commandName}\n\n` +
                `⚠️ Command management system is under development.\n` +
                `This feature will allow enabling/disabling specific commands.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in disable command:', error);
            await msg.reply('❌ Failed to disable command.');
        }
    },

    // Enable command (owner only)
    enable: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!args[0]) {
                return msg.reply('❌ Please specify a command to enable.\n\nUsage: `+enable <command>`');
            }

            const commandName = args[0].toLowerCase();
            
            await msg.reply(
                `✅ *COMMAND MANAGEMENT* ✅\n\n` +
                `Command: ${commandName}\n\n` +
                `⚠️ Command management system is under development.\n` +
                `This feature will allow enabling/disabling specific commands.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in enable command:', error);
            await msg.reply('❌ Failed to enable command.');
        }
    },

    // Open group (allow all members to send messages)
    open: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to open the group.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can open the group.');
            }

            await simple.groupSettingUpdate(msg.from, 'not_announcement');
            
            await msg.reply(
                `🔓 *GROUP OPENED* 🔓\n\n` +
                `The group is now open for all members.\n` +
                `Everyone can send messages now.\n\n` +
                `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in open command:', error);
            await msg.reply('❌ Failed to open the group.');
        }
    },

    // Ping command
    ping: async (conn, msg, args) => {
        try {
            const startTime = Date.now();
            const pingMsg = await msg.reply('🏓 Pinging...');
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            await conn.sendMessage(msg.from, {
                text: `🏓 *PONG!* 🏓\n\n` +
                      `⚡ **Response Time:** ${responseTime}ms\n` +
                      `🔄 **Uptime:** ${hours}h ${minutes}m ${seconds}s\n` +
                      `🤖 **Bot:** ${config.BOT_NAME} v${config.VERSION}\n` +
                      `📊 **Status:** Online ✅\n\n` +
                      `_yourhïghness is running smoothly!_\n` +
                      `🔗 ${config.CHANNEL_URL}`,
                edit: pingMsg.key
            });

        } catch (error) {
            console.error('Error in ping command:', error);
            await msg.reply('❌ Failed to ping the bot.');
        }
    },

    // Promote user to admin
    promote: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to promote users.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can promote users.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || mentioned.length === 0) {
                return msg.reply('❌ Please mention users to promote.\n\nUsage: `+promote @user1 @user2`');
            }

            const promoted = [];
            const failed = [];

            for (const userJid of mentioned) {
                try {
                    const isTargetAdmin = await simple.isAdmin(msg.from, userJid);
                    if (isTargetAdmin) {
                        failed.push(userJid.split('@')[0]);
                        continue;
                    }

                    await simple.groupPromote(msg.from, [userJid]);
                    promoted.push(userJid.split('@')[0]);
                } catch (error) {
                    failed.push(userJid.split('@')[0]);
                }
            }

            let response = `👑 *USER PROMOTION* 👑\n\n`;
            
            if (promoted.length > 0) {
                response += `✅ **Promoted to Admin:**\n`;
                promoted.forEach(user => response += `• ${user}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to promote:**\n`;
                failed.forEach(user => response += `• ${user}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response, { mentions: mentioned });

        } catch (error) {
            console.error('Error in promote command:', error);
            await msg.reply('❌ Failed to promote users.');
        }
    },

    // Purge messages
    purge: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can purge messages.');
            }

            const count = parseInt(args[0]) || 5;
            if (count > 50) {
                return msg.reply('❌ Cannot purge more than 50 messages at once.');
            }

            await msg.reply(
                `🗑️ *MESSAGE PURGE* 🗑️\n\n` +
                `⚠️ Message purging is currently under development.\n` +
                `This feature will allow bulk deletion of recent messages.\n\n` +
                `Requested count: ${count} messages\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in purge command:', error);
            await msg.reply('❌ Failed to purge messages.');
        }
    },

    // Remove user from group
    remove: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to remove users.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can remove users.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || mentioned.length === 0) {
                return msg.reply('❌ Please mention users to remove.\n\nUsage: `+remove @user1 @user2`');
            }

            const removed = [];
            const failed = [];

            for (const userJid of mentioned) {
                try {
                    // Don't remove other admins
                    const isTargetAdmin = await simple.isAdmin(msg.from, userJid);
                    if (isTargetAdmin) {
                        failed.push(userJid.split('@')[0]);
                        continue;
                    }

                    await simple.groupRemove(msg.from, [userJid]);
                    removed.push(userJid.split('@')[0]);
                } catch (error) {
                    failed.push(userJid.split('@')[0]);
                }
            }

            let response = `👋 *USER REMOVAL* 👋\n\n`;
            
            if (removed.length > 0) {
                response += `✅ **Removed:**\n`;
                removed.forEach(user => response += `• ${user}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to remove:**\n`;
                failed.forEach(user => response += `• ${user}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response, { mentions: mentioned });

        } catch (error) {
            console.error('Error in remove command:', error);
            await msg.reply('❌ Failed to remove users.');
        }
    },

    // Set group profile picture
    setprofile: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!msg.quoted || !msg.quoted.isImage) {
                return msg.reply('❌ Please reply to an image to set as group profile picture.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to change the group profile picture.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can change the group profile picture.');
            }

            await msg.react('⏳');
            
            const media = await msg.quoted.download();
            await simple.updateProfilePicture(msg.from, media);
            
            await msg.reply(
                `📸 *GROUP PROFILE UPDATED* 📸\n\n` +
                `✅ Group profile picture has been updated successfully!\n\n` +
                `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

            await msg.react('✅');

        } catch (error) {
            console.error('Error in setprofile command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to set group profile picture.');
        }
    }
};

module.exports = { commands };
