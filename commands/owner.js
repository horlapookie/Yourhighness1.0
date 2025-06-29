const config = require('../config');
const db = require('../lib/database');
const { Simple } = require('../lib/simple');

const commands = {
    // Toggle chatbot in private chats
    chatbot: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+chatbot on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('chatbot_private', isEnabled);

            await msg.reply(
                `🤖 *CHATBOT PRIVATE* 🤖\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will now respond to all private messages' : 'Bot will only respond to commands in private chats'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in chatbot command:', error);
            await msg.reply('❌ Failed to toggle chatbot setting.');
        }
    },

    // Toggle chatbot in groups
    chatbotgc: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+chatbotgc on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('chatbot_groups', isEnabled);

            await msg.reply(
                `🤖 *CHATBOT GROUPS* 🤖\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will now respond to all group messages' : 'Bot will only respond to commands in groups'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in chatbotgc command:', error);
            await msg.reply('❌ Failed to toggle group chatbot setting.');
        }
    },

    // Toggle chatbot everywhere
    chatbotall: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+chatbotall on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('chatbot_private', isEnabled);
            db.setSetting('chatbot_groups', isEnabled);

            await msg.reply(
                `🤖 *CHATBOT ALL* 🤖\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will now respond to all messages everywhere' : 'Bot will only respond to commands'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in chatbotall command:', error);
            await msg.reply('❌ Failed to toggle global chatbot setting.');
        }
    },

    // Update bot
    update: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            await msg.reply(
                `🔄 *BOT UPDATE* 🔄\n\n` +
                `⚠️ Update functionality is not implemented.\n` +
                `To update the bot:\n` +
                `1. Stop the current process\n` +
                `2. Pull latest changes from repository\n` +
                `3. Install dependencies: npm install\n` +
                `4. Restart the bot\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in update command:', error);
            await msg.reply('❌ Failed to process update request.');
        }
    },

    // Shutdown bot
    shutdown: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            await msg.reply(
                `🔴 *SHUTTING DOWN* 🔴\n\n` +
                `yourhïghness is shutting down...\n` +
                `See you later! 👋\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

            setTimeout(() => {
                process.exit(0);
            }, 3000);

        } catch (error) {
            console.error('Error in shutdown command:', error);
            await msg.reply('❌ Failed to shutdown bot.');
        }
    },

    // Set bot bio/status
    setbio: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide a bio/status.\n\nUsage: `+setbio I am yourhïghness bot!`');
            }

            const bio = args.join(' ');
            const simple = new Simple(conn);
            
            await simple.updateProfileStatus(bio);
            
            await msg.reply(
                `📝 *BIO UPDATED* 📝\n\n` +
                `New Status: ${bio}\n\n` +
                `✅ Bot bio has been updated successfully!\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in setbio command:', error);
            await msg.reply('❌ Failed to update bot bio.');
        }
    },

    // Set bot to private mode
    'mode-private': async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            db.setSetting('bot_mode', 'private');
            const botNumber = conn.user?.id?.split(':')[0] || 'Unknown';

            await msg.reply(
                `🔒 *PRIVATE MODE* 🔒\n\n` +
                `Bot is now in private mode.\n` +
                `Only the connected number (${botNumber}) can use bot commands.\n\n` +
                `Use \`${config.PREFIX}mode-public\` to switch back.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in mode-private command:', error);
            await msg.reply('❌ Failed to set private mode.');
        }
    },

    // Set bot to public mode
    'mode-public': async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            db.setSetting('bot_mode', 'public');

            await msg.reply(
                `🔓 *PUBLIC MODE* 🔓\n\n` +
                `Bot is now in public mode.\n` +
                `Everyone can use bot commands.\n\n` +
                `Use \`${config.PREFIX}mode-private\` to restrict access.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in mode-public command:', error);
            await msg.reply('❌ Failed to set public mode.');
        }
    },

    // Report system
    report: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const reports = db.getSetting('reports', []);
            
            if (reports.length === 0) {
                return msg.reply('📋 No reports found.');
            }

            let reportText = `📋 *BOT REPORTS* 📋\n\n`;
            
            reports.slice(-10).forEach((report, index) => {
                reportText += `${index + 1}. **${report.type}**\n`;
                reportText += `   User: ${report.user}\n`;
                reportText += `   Time: ${new Date(report.timestamp).toLocaleString()}\n`;
                reportText += `   Details: ${report.message}\n\n`;
            });

            reportText += `🔗 ${config.CHANNEL_URL}`;
            
            await msg.reply(reportText);

        } catch (error) {
            console.error('Error in report command:', error);
            await msg.reply('❌ Failed to fetch reports.');
        }
    },

    // Clear chat
    clearchat: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            // This would clear chat history - simplified implementation
            await msg.reply(
                `🗑️ *CLEAR CHAT* 🗑️\n\n` +
                `⚠️ Chat clearing is not fully implemented.\n` +
                `This would require deleting message history.\n\n` +
                `For now, manually clear the chat if needed.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in clearchat command:', error);
            await msg.reply('❌ Failed to clear chat.');
        }
    },

    // Send message to connected bot number
    'send-to-bot': async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide a message to send.\n\nUsage: `+send-to-bot Hello from owner!`');
            }

            const botNumber = conn.user?.id?.split(':')[0];
            if (!botNumber) {
                return msg.reply('❌ Could not determine bot number.');
            }

            const botJid = `${botNumber}@s.whatsapp.net`;
            const message = args.join(' ');

            await conn.sendMessage(botJid, {
                text: `📤 *Message from Owner* 📤\n\n${message}\n\n⏰ ${new Date().toLocaleString()}`
            });

            await msg.reply(
                `✅ *MESSAGE SENT* ✅\n\n` +
                `📱 To: ${botNumber}\n` +
                `💬 Message: ${message}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in send-to-bot command:', error);
            await msg.reply('❌ Failed to send message to bot number.');
        }
    },

    // Set bot profile picture
    setpp: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!msg.quoted || !msg.quoted.isImage) {
                return msg.reply('❌ Please reply to an image to set as bot profile picture.');
            }

            await msg.react('⏳');
            
            const simple = new Simple(conn);
            const media = await msg.quoted.download();
            
            await simple.updateProfilePicture(conn.user.id, media);
            
            await msg.reply(
                `📸 *PROFILE PICTURE UPDATED* 📸\n\n` +
                `✅ Bot profile picture has been updated successfully!\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

            await msg.react('✅');

        } catch (error) {
            console.error('Error in setpp command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to set bot profile picture.');
        }
    },

    // Get bot profile picture
    getpp: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const simple = new Simple(conn);
            
            try {
                const ppUrl = await simple.getProfilePictureUrl(conn.user.id, 'image');
                
                if (!ppUrl) {
                    return msg.reply('❌ Bot doesn\'t have a profile picture.');
                }

                await conn.sendMessage(msg.from, {
                    image: { url: ppUrl },
                    caption: `📸 *BOT PROFILE PICTURE* 📸\n\n🔗 ${config.CHANNEL_URL}`
                }, { quoted: msg });

            } catch (error) {
                await msg.reply('❌ Bot doesn\'t have a profile picture or it\'s not accessible.');
            }

        } catch (error) {
            console.error('Error in getpp command:', error);
            await msg.reply('❌ Failed to get bot profile picture.');
        }
    },

    // List blocked users
    listblock: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            // This would require accessing blocked contacts
            await msg.reply(
                `🚫 *BLOCKED USERS* 🚫\n\n` +
                `⚠️ Blocked user list is not accessible.\n` +
                `This feature requires WhatsApp API access to blocked contacts.\n\n` +
                `Use \`${config.PREFIX}block @user\` to block users.\n` +
                `Use \`${config.PREFIX}unblock @user\` to unblock users.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in listblock command:', error);
            await msg.reply('❌ Failed to list blocked users.');
        }
    },

    // Block user
    block: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to block.\n\nUsage: `+block @user`');
            }

            const simple = new Simple(conn);
            await simple.blockUser(mentioned);
            
            const blockedName = mentioned.split('@')[0];
            
            await msg.reply(
                `🚫 *USER BLOCKED* 🚫\n\n` +
                `👤 User: ${blockedName}\n` +
                `✅ User has been blocked successfully!\n\n` +
                `They will no longer be able to send messages to the bot.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in block command:', error);
            await msg.reply('❌ Failed to block user.');
        }
    },

    // Unblock user
    unblock: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to unblock.\n\nUsage: `+unblock @user`');
            }

            const simple = new Simple(conn);
            await simple.unblockUser(mentioned);
            
            const unblockedName = mentioned.split('@')[0];
            
            await msg.reply(
                `✅ *USER UNBLOCKED* ✅\n\n` +
                `👤 User: ${unblockedName}\n` +
                `✅ User has been unblocked successfully!\n\n` +
                `They can now send messages to the bot again.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in unblock command:', error);
            await msg.reply('❌ Failed to unblock user.');
        }
    },

    // Get user bio
    getbio: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.sender;
            const simple = new Simple(conn);
            
            const status = await simple.fetchStatus(mentioned);
            
            if (!status) {
                return msg.reply('❌ Unable to fetch user bio or bio is not accessible.');
            }

            const username = mentioned.split('@')[0];
            
            await msg.reply(
                `📝 *USER BIO* 📝\n\n` +
                `👤 User: ${username}\n` +
                `📄 Bio: ${status.status || 'No bio set'}\n` +
                `⏰ Last updated: ${status.setAt ? new Date(status.setAt).toLocaleString() : 'Unknown'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [mentioned] }
            );

        } catch (error) {
            console.error('Error in getbio command:', error);
            await msg.reply('❌ Failed to get user bio.');
        }
    },

    // Restart bot
    restart: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            await msg.reply(
                `🔄 *RESTARTING BOT* 🔄\n\n` +
                `yourhïghness is restarting...\n` +
                `Please wait a moment.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

            setTimeout(() => {
                process.exit(1); // Exit with error code to trigger restart by process manager
            }, 3000);

        } catch (error) {
            console.error('Error in restart command:', error);
            await msg.reply('❌ Failed to restart bot.');
        }
    },

    // Toggle anti viewonce
    antiviewonce: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antiviewonce on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('anti_viewonce', isEnabled);

            await msg.reply(
                `👁️ *ANTI VIEWONCE* 👁️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'View once messages will be saved and forwarded to owner' : 'View once messages will work normally'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antiviewonce command:', error);
            await msg.reply('❌ Failed to toggle anti viewonce setting.');
        }
    },

    // Toggle anti delete
    antidelete: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+antidelete on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('anti_delete', isEnabled);

            await msg.reply(
                `🗑️ *ANTI DELETE* 🗑️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Deleted messages will be saved and can be retrieved' : 'Deleted messages will be lost normally'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in antidelete command:', error);
            await msg.reply('❌ Failed to toggle anti delete setting.');
        }
    },

    // Toggle anti call
    anticall: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+anticall on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('anti_call', isEnabled);

            await msg.reply(
                `📞 *ANTI CALL* 📞\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Incoming calls will be automatically rejected and caller blocked' : 'Calls will work normally'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in anticall command:', error);
            await msg.reply('❌ Failed to toggle anti call setting.');
        }
    },

    // Toggle auto view status
    autoviewstatus: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+autoviewstatus on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('auto_view_status', isEnabled);

            await msg.reply(
                `👀 *AUTO VIEW STATUS* 👀\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will automatically view all status updates' : 'Bot will not view status updates automatically'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in autoviewstatus command:', error);
            await msg.reply('❌ Failed to toggle auto view status setting.');
        }
    },

    // Toggle auto status react
    autostatusreact: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+autostatusreact on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('auto_status_react', isEnabled);

            await msg.reply(
                `😍 *AUTO STATUS REACT* 😍\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will automatically react to status updates' : 'Bot will not react to status updates'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in autostatusreact command:', error);
            await msg.reply('❌ Failed to toggle auto status react setting.');
        }
    },

    // Toggle auto bio
    autobio: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+autobio on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('auto_bio', isEnabled);

            await msg.reply(
                `📝 *AUTO BIO* 📝\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot bio will be updated automatically with time/stats' : 'Bot bio will remain static'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in autobio command:', error);
            await msg.reply('❌ Failed to toggle auto bio setting.');
        }
    },

    // Toggle auto react
    autoreact: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+autoreact on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('auto_react', isEnabled);

            await msg.reply(
                `😊 *AUTO REACT* 😊\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will randomly react to messages' : 'Bot will not auto react to messages'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in autoreact command:', error);
            await msg.reply('❌ Failed to toggle auto react setting.');
        }
    },

    // Toggle auto typing
    autotyping: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+autotyping on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('auto_typing', isEnabled);

            await msg.reply(
                `⌨️ *AUTO TYPING* ⌨️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will show typing indicator when processing commands' : 'Bot will not show typing indicator'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in autotyping command:', error);
            await msg.reply('❌ Failed to toggle auto typing setting.');
        }
    },

    // Toggle auto recording
    autorecording: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+autorecording on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('auto_recording', isEnabled);

            await msg.reply(
                `🎤 *AUTO RECORDING* 🎤\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will show recording indicator when processing audio' : 'Bot will not show recording indicator'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in autorecording command:', error);
            await msg.reply('❌ Failed to toggle auto recording setting.');
        }
    },

    // Toggle always online
    alwaysonline: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+alwaysonline on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('always_online', isEnabled);

            await msg.reply(
                `🌐 *ALWAYS ONLINE* 🌐\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will always appear online' : 'Bot will show real online status'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in alwaysonline command:', error);
            await msg.reply('❌ Failed to toggle always online setting.');
        }
    },

    // Toggle auto read
    autoread: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const setting = args[0]?.toLowerCase();
            if (!setting || !['on', 'off'].includes(setting)) {
                return msg.reply('❌ Please specify on or off.\n\nUsage: `+autoread on/off`');
            }

            const isEnabled = setting === 'on';
            db.setSetting('auto_read', isEnabled);

            await msg.reply(
                `👁️ *AUTO READ* 👁️\n\n` +
                `Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                `${isEnabled ? 'Bot will automatically read all messages' : 'Bot will not read messages automatically'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in autoread command:', error);
            await msg.reply('❌ Failed to toggle auto read setting.');
        }
    },

    // Set unavailable status
    unavailable: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            await conn.sendPresenceUpdate('unavailable');
            
            await msg.reply(
                `😴 *STATUS: UNAVAILABLE* 😴\n\n` +
                `Bot status has been set to unavailable.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in unavailable command:', error);
            await msg.reply('❌ Failed to set unavailable status.');
        }
    },

    // Show current mode
    mode: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mode = db.getSetting('bot_mode', 'public');
            const chatbotPrivate = db.getSetting('chatbot_private', false);
            const chatbotGroups = db.getSetting('chatbot_groups', false);
            const autoRead = db.getSetting('auto_read', false);
            const autoReact = db.getSetting('auto_react', false);
            const alwaysOnline = db.getSetting('always_online', false);

            await msg.reply(
                `⚙️ *BOT SETTINGS* ⚙️\n\n` +
                `🔐 **Mode:** ${mode === 'private' ? '🔒 Private' : '🔓 Public'}\n` +
                `🤖 **Chatbot (Private):** ${chatbotPrivate ? '✅' : '❌'}\n` +
                `🤖 **Chatbot (Groups):** ${chatbotGroups ? '✅' : '❌'}\n` +
                `👁️ **Auto Read:** ${autoRead ? '✅' : '❌'}\n` +
                `😊 **Auto React:** ${autoReact ? '✅' : '❌'}\n` +
                `🌐 **Always Online:** ${alwaysOnline ? '✅' : '❌'}\n\n` +
                `📊 **Commands Loaded:** ${config.getTotalCommands()}\n` +
                `⏰ **Uptime:** ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in mode command:', error);
            await msg.reply('❌ Failed to get bot settings.');
        }
    },

    // Add sudo user
    sudo: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to add as sudo.\n\nUsage: `+sudo @user`');
            }

            const sudoUsers = db.getSetting('sudo_users', []);
            
            if (sudoUsers.includes(mentioned)) {
                return msg.reply('❌ User is already a sudo user.');
            }

            sudoUsers.push(mentioned);
            db.setSetting('sudo_users', sudoUsers);
            
            const sudoName = mentioned.split('@')[0];
            
            await msg.reply(
                `👑 *SUDO USER ADDED* 👑\n\n` +
                `👤 User: ${sudoName}\n` +
                `✅ User has been granted sudo privileges!\n\n` +
                `They can now use owner commands.\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [mentioned] }
            );

        } catch (error) {
            console.error('Error in sudo command:', error);
            await msg.reply('❌ Failed to add sudo user.');
        }
    },

    // Remove sudo user
    delsudo: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to remove from sudo.\n\nUsage: `+delsudo @user`');
            }

            const sudoUsers = db.getSetting('sudo_users', []);
            const index = sudoUsers.indexOf(mentioned);
            
            if (index === -1) {
                return msg.reply('❌ User is not a sudo user.');
            }

            sudoUsers.splice(index, 1);
            db.setSetting('sudo_users', sudoUsers);
            
            const sudoName = mentioned.split('@')[0];
            
            await msg.reply(
                `👤 *SUDO USER REMOVED* 👤\n\n` +
                `👤 User: ${sudoName}\n` +
                `✅ Sudo privileges have been revoked!\n\n` +
                `They can no longer use owner commands.\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [mentioned] }
            );

        } catch (error) {
            console.error('Error in delsudo command:', error);
            await msg.reply('❌ Failed to remove sudo user.');
        }
    },

    // List sudo users
    listsudo: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const sudoUsers = db.getSetting('sudo_users', []);
            
            if (sudoUsers.length === 0) {
                return msg.reply('👑 No sudo users found.\n\nUse `+sudo @user` to add sudo users.');
            }

            let sudoList = `👑 *SUDO USERS* 👑\n\n`;
            
            sudoUsers.forEach((user, index) => {
                const username = user.split('@')[0];
                sudoList += `${index + 1}. ${username}\n`;
            });

            sudoList += `\n📊 **Total:** ${sudoUsers.length} sudo users\n`;
            sudoList += `🔗 ${config.CHANNEL_URL}`;
            
            await msg.reply(sudoList, { mentions: sudoUsers });

        } catch (error) {
            console.error('Error in listsudo command:', error);
            await msg.reply('❌ Failed to list sudo users.');
        }
    },

    // Execute shell command
    '$': async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide a command to execute.\n\nUsage: `+$ ls -la`');
            }

            const command = args.join(' ');
            
            // For security reasons, this is disabled in production
            await msg.reply(
                `💻 *SHELL COMMAND* 💻\n\n` +
                `Command: \`${command}\`\n\n` +
                `⚠️ Shell command execution is disabled for security reasons.\n` +
                `This feature could be dangerous in production environments.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in $ command:', error);
            await msg.reply('❌ Failed to execute shell command.');
        }
    },

    // Evaluate JavaScript
    '=>': async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide JavaScript code to evaluate.\n\nUsage: `+=> console.log("Hello")`');
            }

            const code = args.join(' ');
            
            // For security reasons, this is disabled in production
            await msg.reply(
                `⚡ *JAVASCRIPT EVAL* ⚡\n\n` +
                `Code: \`${code}\`\n\n` +
                `⚠️ JavaScript evaluation is disabled for security reasons.\n` +
                `This feature could be dangerous in production environments.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in => command:', error);
            await msg.reply('❌ Failed to evaluate JavaScript code.');
        }
    },

    // Async evaluate JavaScript
    '>': async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide async JavaScript code to evaluate.\n\nUsage: `+> await fetch("https://api.example.com")`');
            }

            const code = args.join(' ');
            
            // For security reasons, this is disabled in production
            await msg.reply(
                `⚡ *ASYNC JAVASCRIPT EVAL* ⚡\n\n` +
                `Code: \`${code}\`\n\n` +
                `⚠️ Async JavaScript evaluation is disabled for security reasons.\n` +
                `This feature could be dangerous in production environments.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in > command:', error);
            await msg.reply('❌ Failed to evaluate async JavaScript code.');
        }
    },

    // Premium user management
    premium: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to manage premium status.\n\nUsage: `+premium @user`');
            }

            const user = db.getUser(mentioned);
            user.premium = !user.premium;
            
            if (user.premium) {
                user.premiumSince = new Date().toISOString();
            } else {
                user.premiumSince = null;
            }
            
            db.updateUser(mentioned, user);
            
            const userName = mentioned.split('@')[0];
            
            await msg.reply(
                `💎 *PREMIUM STATUS* 💎\n\n` +
                `👤 User: ${userName}\n` +
                `💎 Status: ${user.premium ? '✅ Premium' : '❌ Regular'}\n` +
                `📅 Since: ${user.premiumSince ? new Date(user.premiumSince).toLocaleDateString() : 'N/A'}\n\n` +
                `${user.premium ? 'User now has access to premium features!' : 'Premium features have been revoked.'}\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [mentioned] }
            );

        } catch (error) {
            console.error('Error in premium command:', error);
            await msg.reply('❌ Failed to manage premium status.');
        }
    },

    // Buy premium info
    buypremium: async (conn, msg, args) => {
        try {
            await msg.reply(
                `💎 *BUY PREMIUM* 💎\n\n` +
                `🌟 **Premium Features:**\n` +
                `• Priority command processing\n` +
                `• Access to exclusive commands\n` +
                `• Higher rate limits\n` +
                `• Premium-only games\n` +
                `• Custom sticker packs\n` +
                `• Advanced AI features\n\n` +
                `💰 **Pricing:**\n` +
                `• Monthly: $5.99\n` +
                `• Yearly: $59.99 (save 17%)\n\n` +
                `📞 **Contact Owner:**\n` +
                `${config.CREATOR_NUMBER}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in buypremium command:', error);
            await msg.reply('❌ Failed to display premium information.');
        }
    },

    // Add case (for developers)
    addcase: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            await msg.reply(
                `📝 *ADD CASE* 📝\n\n` +
                `⚠️ Case management system is under development.\n` +
                `This feature will allow adding new command cases dynamically.\n\n` +
                `For now, add commands manually in the command files.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in addcase command:', error);
            await msg.reply('❌ Failed to add case.');
        }
    },

    // Delete case (for developers)
    delcase: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            await msg.reply(
                `🗑️ *DELETE CASE* 🗑️\n\n` +
                `⚠️ Case management system is under development.\n` +
                `This feature will allow removing command cases dynamically.\n\n` +
                `For now, remove commands manually from the command files.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in delcase command:', error);
            await msg.reply('❌ Failed to delete case.');
        }
    },

    // Stop bot
    stop: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            await msg.reply(
                `🛑 *STOPPING BOT* 🛑\n\n` +
                `yourhïghness is shutting down...\n` +
                `Goodbye! 👋\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

            setTimeout(() => {
                process.exit(0);
            }, 3000);

        } catch (error) {
            console.error('Error in stop command:', error);
            await msg.reply('❌ Failed to stop bot.');
        }
    }
};

module.exports = { commands };
