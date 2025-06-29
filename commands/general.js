const config = require('../config');
const db = require('../lib/database');

const commands = {
    // Display help menu
    help: async (conn, msg, args) => {
        try {
            const user = db.getUser(msg.sender);
            const username = msg.pushName || msg.sender.split('@')[0];
            
            const menuText = `┌ ❏ *⌜ ${config.BOT_NAME} ⌟* ❏ 
│-  ${config.CREATOR_NAME}
├❍ ᴘʀᴇғɪx: ${config.PREFIX}
├❍ ᴜsᴇʀ: ${username}
├❍ ᴠᴇʀsɪᴏɴ: ${config.VERSION} ( Latest )
├❍ ᴛɪᴍᴇ: ${config.getTime()}
├❍ ᴄᴏᴍᴍᴀɴᴅs: ${config.getTotalCommands()}
├❍ ᴛᴏᴅᴀʏ: ${config.getDay()}
├❍ ᴅᴀᴛᴇ: ${config.getDate()}
└ ❏

┌ ❏ 〤 *AI MENU* 〤
├❍ + ᴀɪ
├❍ + ɪᴍɢᴀɪ
├❍ + sᴄʀᴀᴘᴇ
├❍ + ɴᴇᴡs
├❍ + ᴛʀᴀɴsʟᴀᴛᴇ
├❍ + sᴜᴍᴍᴀʀɪᴢᴇ
├❍ + ᴄʜᴀᴛ
├❍ + ᴄʟᴇᴀʀᴄʜᴀᴛ
└ ❏

┌ ❏ 〤 *PREMIUM MENU* 〤
├❍ + ᴀɪᴘʟᴜs 👑
├❍ + ʙᴜʟᴋsᴄʀᴀᴘᴇ 👑
├❍ + ᴄʀᴇᴀᴛᴇɢʀᴏᴜᴘ 👑
├❍ + ᴅᴇʟᴇᴛᴇɢʀᴏᴜᴘ 👑
├❍ + ᴛʀᴀɴsʟᴀᴛᴇᴘʟᴜs 👑
├❍ + ᴄᴏᴅᴇɢᴇɴ 👑
├❍ + sᴏᴄɪᴀʟᴀɴᴀʟʏᴛɪᴄs 👑
├❍ + ʙᴜʟᴋɪᴍɢᴀɪ 👑
├❍ + ᴄᴏɴᴛᴇɴᴛᴄʀᴇᴀᴛᴏʀ 👑
├❍ + ᴅᴀᴛᴀᴀɴᴀʟʏᴢᴇʀ 👑
└ ❏

┌ ❏ 〤 *ANTI MENU* 〤
├❍ + ᴀɴᴛɪʟɪɴᴋ 
├❍ + ᴀɴᴛɪʟɪɴᴋ-ᴋɪᴄᴋ <ᴏɴ/ᴏғғ>
├❍ + ᴀɴᴛɪʟɪɴᴋ-ᴡᴀʀɴ <ᴏɴ/ᴏғғ>
├❍ + ᴀɴᴛɪʟɪɴᴋ-ᴅᴇʟᴇᴛᴇ <ᴏɴ/ᴏғғ>
├❍ + ᴀɴᴛɪᴅᴇʟᴇᴛᴇ <ᴏɴ/ᴏғғ>
├❍ + ᴀɴᴛɪsᴘᴀᴍ <ᴏɴ/ᴏғғ>
├❍ + ᴀɴᴛɪᴛᴀɢ <ᴏɴ/ᴏғғ>
├❍ + ᴀɴᴛɪᴛᴇᴍᴜ <ᴏɴ/ᴏғғ>
└ ❏

┌ ❏ 〤 *CHANNEL MENU* 〤
├❍ + ɢᴇᴛɴᴇᴡsʟᴇᴛᴛᴇʀ
├❍ + ᴄʀᴇᴀᴛᴇᴄʜᴀɴɴᴇʟ
├❍ + ʀᴇᴍᴏᴠᴇᴘɪᴄ
├❍ + ᴜᴘᴅᴀᴛᴇᴅᴇsᴄ
├❍ + ᴜᴘᴅᴀᴛᴇɴᴀᴍᴇ
├❍ + ᴜᴘᴅᴀᴛᴇᴘɪᴄ
├❍ + ᴍᴜᴛᴇɴᴇᴡs
├❍ + ᴜɴᴍᴜᴛᴇɴᴇᴡs
├❍ + ғᴏʟʟᴏᴡᴄʜᴀɴɴᴇʟ
├❍ + ᴜɴғᴏʟʟᴏᴡᴄʜᴀɴɴᴇʟ
├❍ + ᴅᴇʟᴇᴛᴇᴄʜᴀɴɴᴇʟ
└ ❏

┌ ❏ 〤 *EDITOR MENU* 〤
├❍ + ᴡᴀɴᴛᴇᴅ
├❍ + ᴅʀᴀᴋᴇ
├❍ + ᴄʟᴏᴡɴ
├❍ + ᴀʟᴇʀᴛ
├❍ + ᴘᴇᴛɢɪғ
├❍ + ᴛᴡᴇᴇᴛ 
├❍ + ᴀʟʙᴜᴍ
└ ❏

┌ ❏ 〤 *CRYPTO MENU* 〤
├❍ + ᴄʀʏᴘᴛᴏ-ᴘʀɪᴄᴇ
├❍ + ᴛᴏᴘ-ᴄʀʏᴘᴛᴏ
├❍ + ᴄʀʏᴘᴛᴏ-ɪɴᴅᴇx
├❍ + ᴄʀʏᴘᴛᴏ-ᴄᴏɴᴠᴇʀᴛ
├❍ + ᴄʀʏᴘᴛᴏ-ɴᴇᴡs
└ ❏

_Use ${config.PREFIX}allmenu for complete command list_

🔗 ${config.CHANNEL_URL}`;

            await conn.sendMessage(msg.from, {
                image: { url: config.MENU_IMAGE },
                caption: menuText
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in help command:', error);
            await msg.reply('❌ Failed to display help menu.');
        }
    },

    // Alias for help
    list: async (conn, msg, args) => {
        await commands.help(conn, msg, args);
    },

    // Alias for help
    menu: async (conn, msg, args) => {
        await commands.help(conn, msg, args);
    },

    // Complete menu
    allmenu: async (conn, msg, args) => {
        try {
            const user = db.getUser(msg.sender);
            const username = msg.pushName || msg.sender.split('@')[0];
            
            const allMenuText = `┌ ❏ *⌜ ${config.BOT_NAME} - ALL COMMANDS ⌟* ❏ 
│-  ${config.CREATOR_NAME}
├❍ ᴜsᴇʀ: ${username}
├❍ ᴄᴏᴍᴍᴀɴᴅs: ${config.getTotalCommands()}
└ ❏

┌ ❏ 〤 *VIEWONCE MENU* 〤
├❍ + ᴠᴠ
├❍ + ᴠᴠ2
└ ❏

┌ ❏ 〤 *CHESS MENU* 〤
├❍ + ᴀᴄᴄᴇᴘᴛ-ᴄʜ
├❍ + ᴄʜᴇss
├❍ + ᴄʜᴇss-ᴄʜᴀʟʟᴇɴɢᴇ
├❍ + ғᴏʀғᴇɪᴛ-ᴄʜᴇss
├❍ + ᴍᴏᴠᴇ
├❍ + ʀᴇᴊᴇᴄᴛ-ᴄʜ
└ ❏

┌ ❏ 〤 *FUN MENU* 〤
├❍ + ʙʀᴀᴢᴢᴇʀs
├❍ + ᴄʜᴀᴛ
├❍ + ᴄʜᴀᴛɢᴘᴛ
├❍ + ғᴀᴄᴛ
├❍ + ғʀɪᴇɴᴅsʜɪᴘ
├❍ + ɪᴍᴀɢɪɴᴇ
├❍ + ᴊᴏᴋᴇ
├❍ + ᴍᴇᴍᴏ
├❍ + ʀᴇᴀᴄᴛɪᴏɴ
├❍ + sʜɪᴘ
├❍ + sɪᴍᴘ
├❍ + ᴛʜᴜɢ-ʟɪғᴇ
├❍ + ᴛʀɪɢɢᴇʀᴇᴅ
├❍ + ᴛᴡᴇᴇᴛ
└ ❏

┌ ❏ 〤 *GAMES MENU* 〤
├❍ + ᴀᴋɪɴᴀᴛᴏʀ
├❍ + ᴀɴsᴡᴇʀ
├❍ + ᴅᴏᴛs-ᴀɴᴅ-ʙᴏxᴇs
├❍ + ᴅʀᴀɢᴏɴ
├❍ + ғᴏʀғᴇɪᴛ-ǫᴜɪᴢ
├❍ + ʜᴀɴɢᴍᴀɴ
├❍ + sᴛᴀʀᴛ-ǫᴜɪᴢ
├❍ + ᴛɪᴄᴛᴀᴄᴛᴏᴇ
└ ❏

┌ ❏ 〤 *GENERAL MENU* 〤
├❍ + ɪɴғᴏ
├❍ + ʀᴀɴᴋ
├❍ + ᴘʀᴏғɪʟᴇ
├❍ + ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ
├❍ + ɪɴᴠᴇɴᴛᴏʀʏ
└ ❏

┌ ❏ 〤 *GROUP MENU* 〤
├❍ + ᴀᴅᴅ
├❍ + ᴋɪᴄᴋ
├❍ + ʀᴇᴍᴏᴠᴇ
├❍ + ᴇᴠᴇʀʏᴏɴᴇ
├❍ + ᴛᴀɢᴀʟʟ
├❍ + ʟᴇᴀᴠᴇɢᴄ
├❍ + ᴊᴏɪɴ
├❍ + ɪɴᴠɪᴛᴇ
├❍ + ɢᴇᴛɴᴀᴍᴇ
├❍ + ɢᴇᴛᴅᴇsᴋɢᴄ
├❍ + ɢᴇᴛᴘᴘɢᴄ
├❍ + sᴇᴛᴘᴘɢᴄ
└ ❏

┌ ❏ 〤 *MEDIA MENU* 〤
├❍ + ᴘʟᴀʏ
├❍ + ᴘʟᴀʏ2
├❍ + ʏᴛᴍᴘ3
├❍ + ʏᴛᴍᴘ4
├❍ + ɪɴsᴛᴀ
├❍ + ᴛɪᴋᴛᴏᴋ
├❍ + ғᴀᴄᴇʙᴏᴏᴋ
├❍ + ɢᴏᴏɢʟᴇ
├❍ + ɪᴍᴀɢᴇ
├❍ + sᴛɪᴄᴋᴇʀ
├❍ + ᴘɪɴ
├❍ + ᴜɴᴘɪɴ
└ ❏

┌ ❏ 〤 *MODERATION MENU* 〤
├❍ + ᴘʀᴏᴍᴏᴛᴇ
├❍ + ᴅᴇᴍᴏᴛᴇ
├❍ + ʜɪᴅᴇᴛᴀɢ
├❍ + ᴅᴇʟᴇᴛᴇ
├❍ + ᴅᴇʟ
├❍ + ᴡᴀʀɴ
├❍ + ᴜɴᴡᴀʀɴ
├❍ + ᴡᴀʀɴɪɴɢs
├❍ + ᴍᴜᴛᴇ
├❍ + ᴜɴᴍᴜᴛᴇ
├❍ + ᴍᴜᴛᴇᴀʟʟ
├❍ + ᴜɴᴍᴜᴛᴇᴀʟʟ
└ ❏

┌ ❏ 〤 *UTILS MENU* 〤
├❍ + ᴄᴀʟᴄᴜʟᴀᴛᴇ
├❍ + ǫʀ
├❍ + sʜᴏʀᴛ
├❍ + ᴡᴇᴀᴛʜᴇʀ
├❍ + ᴍᴏᴠɪᴇ
├❍ + ǫᴜᴏᴛᴇ
├❍ + ᴄᴏᴜɴᴛᴅᴏᴡɴ
├❍ + ᴛɪᴍᴇʀ
├❍ + ʀᴇᴍɪɴᴅᴇʀ
├❍ + ᴘᴀssᴡᴏʀᴅ
├❍ + ᴘɪɴɢ
├❍ + sᴘᴇᴇᴅ
└ ❏

┌ ❏ 〤 *WEEB MENU* 〤
├❍ + ᴀɴɪᴍᴇ
├❍ + ᴍᴀɴɢᴀ
├❍ + ᴡᴀɪғᴜ
├❍ + ɴᴇᴋᴏ
├❍ + ᴀɴɪᴍᴇǫᴜᴏᴛᴇ
├❍ + ᴀɴɪᴍᴇɴᴇᴡs
├❍ + ᴏᴛᴀᴋᴜ
├❍ + ᴀɴɪᴍᴇғᴀᴄᴛ
└ ❏

┌ ❏ 〤 *OWNER MENU* 〤
├❍ + ᴄʜᴀᴛʙᴏᴛ <ᴏɴ/ᴏғғ>
├❍ + ᴄʜᴀᴛʙᴏᴛɢᴄ <ᴏɴ/ᴏғғ>
├❍ + ᴄʜᴀᴛʙᴏᴛᴀʟʟ <ᴏɴ/ᴏғғ>
├❍ + ᴜᴘᴅᴀᴛᴇ
├❍ + sʜᴜᴛᴅᴏᴡɴ
├❍ + sᴇᴛʙɪᴏ
├❍ + ᴍᴏᴅᴇ-ᴘʀɪᴠᴀᴛᴇ
├❍ + ᴍᴏᴅᴇ-ᴘᴜʙʟɪᴄ
├❍ + ʀᴇᴘᴏʀᴛ
├❍ + ᴄʟᴇᴀʀᴄʜᴀᴛ
├❍ + sᴇᴛᴘᴘ
├❍ + ɢᴇᴛᴘᴘ
├❍ + ʟɪsᴛʙʟᴏᴄᴋ
├❍ + ʙʟᴏᴄᴋ
├❍ + ᴜɴʙʟᴏᴄᴋ
├❍ + ɢᴇᴛʙɪᴏ
├❍ + ᴀᴅᴅᴘʀᴇᴍɪᴜᴍ
├❍ + ᴅᴇʟᴘʀᴇᴍɪᴜᴍ
├❍ + ʟɪsᴛᴘʀᴇᴍɪᴜᴍ
└ ❏

🔗 ${config.CHANNEL_URL}`;

            await conn.sendMessage(msg.from, {
                text: allMenuText
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in allmenu command:', error);
            await msg.reply('❌ Failed to display complete menu.');
        }
    },

    // Bot info
    info: async (conn, msg, args) => {
        try {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            const infoText = `📱 *BOT INFORMATION* 📱

🤖 **Bot Name:** ${config.BOT_NAME}
👨‍💻 **Creator:** ${config.CREATOR_NAME}
📞 **Creator Number:** ${config.CREATOR_NUMBER}
🔢 **Version:** ${config.VERSION}
🔗 **Prefix:** ${config.PREFIX}

⏰ **Uptime:** ${hours}h ${minutes}m ${seconds}s
📊 **Total Commands:** ${config.getTotalCommands()}
🌐 **Platform:** Node.js + Baileys MD

📋 **Features:**
• Multi-Device Support
• 80+ Commands
• Modular Architecture
• Custom Branding
• Game Integration
• Media Processing

🔗 **Channel:** ${config.CHANNEL_URL}

_Powered by yourhïghness_`;

            await conn.sendMessage(msg.from, {
                image: { url: config.PROFILE_IMAGE },
                caption: infoText
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in info command:', error);
            await msg.reply('❌ Failed to display bot information.');
        }
    },

    // Greeting command
    hi: async (conn, msg, args) => {
        try {
            const greetings = [
                `👋 Hello ${msg.pushName || 'there'}!`,
                `🌟 Hey there, ${msg.pushName || 'friend'}!`,
                `😊 Hi ${msg.pushName || 'buddy'}! How are you?`,
                `🎉 Greetings, ${msg.pushName || 'user'}!`,
                `✨ Hello and welcome, ${msg.pushName || 'mate'}!`
            ];

            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

            await msg.reply(
                `${randomGreeting}\n\n` +
                `I'm yourhïghness, your friendly WhatsApp bot! 🤖\n\n` +
                `Use \`${config.PREFIX}help\` to see all available commands.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in hi command:', error);
            await msg.reply('❌ Failed to send greeting.');
        }
    },

    // User profile
    profile: async (conn, msg, args) => {
        try {
            const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.sender;
            const user = db.getUser(target);
            const targetName = target === msg.sender ? (msg.pushName || 'You') : target.split('@')[0];

            // Calculate level from XP
            const level = Math.floor(user.xp / 100) + 1;
            const xpForNext = (level * 100) - user.xp;

            await conn.sendMessage(msg.from, {
                image: { url: config.PROFILE_IMAGE },
                caption: `👤 *USER PROFILE* 👤\n\n` +
                        `🏷️ **Name:** ${targetName}\n` +
                        `📛 **Username:** ${user.username || 'Not set'}\n` +
                        `📝 **Bio:** ${user.bio || 'No bio set'}\n` +
                        `🏆 **Rank:** ${user.rank}\n` +
                        `⭐ **Level:** ${level}\n` +
                        `✨ **XP:** ${user.xp}\n` +
                        `🎯 **XP to next level:** ${xpForNext}\n` +
                        `💰 **Coins:** ${user.coins}\n` +
                        `💍 **Married to:** ${user.married ? user.married.split('@')[0] : 'Single'}\n` +
                        `⚠️ **Warnings:** ${user.warnings}\n` +
                        `📅 **Joined:** ${new Date(user.joinDate).toLocaleDateString()}\n` +
                        `🕐 **Last seen:** ${new Date(user.lastSeen).toLocaleString()}\n\n` +
                        `🔗 ${config.CHANNEL_URL}`,
                mentions: target !== msg.sender ? [target] : []
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in profile command:', error);
            await msg.reply('❌ Failed to display user profile.');
        }
    },

    // User rank
    rank: async (conn, msg, args) => {
        try {
            const user = db.getUser(msg.sender);
            const level = Math.floor(user.xp / 100) + 1;
            const xpProgress = user.xp % 100;
            const xpForNext = 100 - xpProgress;

            // Progress bar
            const progressBar = '█'.repeat(Math.floor(xpProgress / 10)) + '░'.repeat(10 - Math.floor(xpProgress / 10));

            await msg.reply(
                `🏆 *YOUR RANK* 🏆\n\n` +
                `👤 **Player:** ${msg.pushName || msg.sender.split('@')[0]}\n` +
                `🏅 **Rank:** ${user.rank}\n` +
                `⭐ **Level:** ${level}\n` +
                `✨ **XP:** ${user.xp}\n` +
                `🎯 **Next Level:** ${xpForNext} XP needed\n\n` +
                `📊 **Progress:**\n` +
                `${progressBar} ${xpProgress}/100\n\n` +
                `💰 **Coins:** ${user.coins}\n\n` +
                `_Keep chatting to gain more XP!_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in rank command:', error);
            await msg.reply('❌ Failed to display user rank.');
        }
    },

    // Leaderboard
    leaderboard: async (conn, msg, args) => {
        try {
            const allUsers = Object.values(db.users)
                .sort((a, b) => b.xp - a.xp)
                .slice(0, 10);

            if (allUsers.length === 0) {
                return msg.reply('❌ No users found in the leaderboard.');
            }

            let leaderboardText = `🏆 *LEADERBOARD* 🏆\n\n`;
            
            allUsers.forEach((user, index) => {
                const level = Math.floor(user.xp / 100) + 1;
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                const name = user.name || user.jid.split('@')[0];
                
                leaderboardText += `${medal} **${name}**\n`;
                leaderboardText += `   Level ${level} • ${user.xp} XP • ${user.coins} coins\n\n`;
            });

            leaderboardText += `_Compete for the top spot!_\n🔗 ${config.CHANNEL_URL}`;

            await msg.reply(leaderboardText);

        } catch (error) {
            console.error('Error in leaderboard command:', error);
            await msg.reply('❌ Failed to display leaderboard.');
        }
    },

    // User inventory
    inventory: async (conn, msg, args) => {
        try {
            const user = db.getUser(msg.sender);
            
            if (!user.inventory || user.inventory.length === 0) {
                return msg.reply(
                    `🎒 *YOUR INVENTORY* 🎒\n\n` +
                    `📦 Your inventory is empty!\n\n` +
                    `_Start playing games and completing tasks to earn items._\n` +
                    `🔗 ${config.CHANNEL_URL}`
                );
            }

            let inventoryText = `🎒 *YOUR INVENTORY* 🎒\n\n`;
            
            // Group items by type
            const itemCounts = {};
            user.inventory.forEach(item => {
                itemCounts[item] = (itemCounts[item] || 0) + 1;
            });

            Object.entries(itemCounts).forEach(([item, count]) => {
                inventoryText += `📦 ${item} x${count}\n`;
            });

            inventoryText += `\n💰 **Coins:** ${user.coins}\n`;
            inventoryText += `\n_Use items with commands or trade with other users!_\n`;
            inventoryText += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(inventoryText);

        } catch (error) {
            console.error('Error in inventory command:', error);
            await msg.reply('❌ Failed to display inventory.');
        }
    },

    // Set username
    'set-username': async (conn, msg, args) => {
        try {
            if (!args.length) {
                return msg.reply('❌ Please provide a username.\n\nUsage: `+set-username JohnDoe`');
            }

            const username = args.join(' ').substring(0, 50);
            const user = db.getUser(msg.sender);
            
            user.username = username;
            db.updateUser(msg.sender, user);

            await msg.reply(
                `✅ *USERNAME UPDATED* ✅\n\n` +
                `🏷️ **New Username:** ${username}\n\n` +
                `_Your username has been successfully updated!_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in set-username command:', error);
            await msg.reply('❌ Failed to set username.');
        }
    },

    // Set bio
    'set-bio': async (conn, msg, args) => {
        try {
            if (!args.length) {
                return msg.reply('❌ Please provide a bio.\n\nUsage: `+set-bio I love coding!`');
            }

            const bio = args.join(' ').substring(0, 200);
            const user = db.getUser(msg.sender);
            
            user.bio = bio;
            db.updateUser(msg.sender, user);

            await msg.reply(
                `✅ *BIO UPDATED* ✅\n\n` +
                `📝 **New Bio:** ${bio}\n\n` +
                `_Your bio has been successfully updated!_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in set-bio command:', error);
            await msg.reply('❌ Failed to set bio.');
        }
    },

    // Reset username
    'reset-username': async (conn, msg, args) => {
        try {
            const user = db.getUser(msg.sender);
            user.username = '';
            db.updateUser(msg.sender, user);

            await msg.reply(
                `✅ *USERNAME RESET* ✅\n\n` +
                `Your username has been cleared.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in reset-username command:', error);
            await msg.reply('❌ Failed to reset username.');
        }
    },

    // Reset bio
    'reset-bio': async (conn, msg, args) => {
        try {
            const user = db.getUser(msg.sender);
            user.bio = '';
            db.updateUser(msg.sender, user);

            await msg.reply(
                `✅ *BIO RESET* ✅\n\n` +
                `Your bio has been cleared.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in reset-bio command:', error);
            await msg.reply('❌ Failed to reset bio.');
        }
    },

    // Bot rules
    rules: async (conn, msg, args) => {
        try {
            const rulesText = `📋 *BOT RULES* 📋

🚫 **Prohibited Actions:**
• No spamming commands
• No abusive language
• No sharing inappropriate content
• No attempts to hack or exploit

✅ **Guidelines:**
• Be respectful to other users
• Use commands appropriately
• Report bugs to the owner
• Have fun and enjoy the bot!

⚠️ **Violations may result in:**
• Warnings
• Temporary restrictions
• Permanent ban from bot services

📞 **Contact:** ${config.CREATOR_NUMBER}
🔗 **Channel:** ${config.CHANNEL_URL}

_Thank you for using yourhïghness responsibly!_`;

            await msg.reply(rulesText);

        } catch (error) {
            console.error('Error in rules command:', error);
            await msg.reply('❌ Failed to display rules.');
        }
    },

    // Support command
    support: async (conn, msg, args) => {
        try {
            const supportText = `🛠️ *SUPPORT & CONTACT* 🛠️

👨‍💻 **Creator:** ${config.CREATOR_NAME}
📞 **Phone Number:** ${config.CREATOR_NUMBER}

💬 **Get Help:**
• Report bugs and issues
• Request new features
• Get technical support
• Ask questions about the bot

📱 **Contact Methods:**
• WhatsApp: ${config.CREATOR_NUMBER}
• Channel: ${config.CHANNEL_URL}

⏰ **Support Hours:**
Available 24/7 for urgent issues

🤖 **Bot Information:**
• Version: ${config.VERSION}
• Platform: WhatsApp MD
• Commands: ${config.getTotalCommands()}

_We're here to help you make the most of yourhïghness!_`;

            await conn.sendMessage(msg.from, {
                image: { url: config.PROFILE_IMAGE },
                caption: supportText
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in support command:', error);
            await msg.reply('❌ Failed to display support information.');
        }
    }
};

module.exports = { commands };
