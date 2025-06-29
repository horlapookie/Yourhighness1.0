const config = require('../config');
const { GeminiAI } = require('../lib/gemini');
const { WebScraper } = require('../lib/web-scraper');
const db = require('../lib/database');
const { Simple } = require('../lib/simple');

const gemini = new GeminiAI();
const scraper = new WebScraper();

// Premium user management
function isPremiumUser(userId) {
    const premiumUsers = db.getSetting('premium_users', []);
    return premiumUsers.includes(userId) || config.isOwner(userId);
}

function addPremiumUser(userId) {
    const premiumUsers = db.getSetting('premium_users', []);
    if (!premiumUsers.includes(userId)) {
        premiumUsers.push(userId);
        db.setSetting('premium_users', premiumUsers);
        return true;
    }
    return false;
}

function removePremiumUser(userId) {
    const premiumUsers = db.getSetting('premium_users', []);
    const index = premiumUsers.indexOf(userId);
    if (index > -1) {
        premiumUsers.splice(index, 1);
        db.setSetting('premium_users', premiumUsers);
        return true;
    }
    return false;
}

const commands = {
    // Add premium user (owner only)
    addpremium: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to add to premium.\n\nUsage: `+addpremium @user`');
            }

            const added = addPremiumUser(mentioned);
            const username = mentioned.split('@')[0];

            if (added) {
                await msg.reply(
                    `👑 *PREMIUM USER ADDED* 👑\n\n` +
                    `✅ @${username} has been added to premium users!\n\n` +
                    `They can now access all premium commands.\n\n` +
                    `🔗 ${config.CHANNEL_URL}`,
                    { mentions: [mentioned] }
                );
            } else {
                await msg.reply(`ℹ️ @${username} is already a premium user.`, { mentions: [mentioned] });
            }

        } catch (error) {
            console.error('Error in addpremium command:', error);
            await msg.reply('❌ Failed to add premium user.');
        }
    },

    // Remove premium user (owner only)
    delpremium: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to remove from premium.\n\nUsage: `+delpremium @user`');
            }

            const removed = removePremiumUser(mentioned);
            const username = mentioned.split('@')[0];

            if (removed) {
                await msg.reply(
                    `👑 *PREMIUM USER REMOVED* 👑\n\n` +
                    `❌ @${username} has been removed from premium users.\n\n` +
                    `They can no longer access premium commands.\n\n` +
                    `🔗 ${config.CHANNEL_URL}`,
                    { mentions: [mentioned] }
                );
            } else {
                await msg.reply(`ℹ️ @${username} is not a premium user.`, { mentions: [mentioned] });
            }

        } catch (error) {
            console.error('Error in delpremium command:', error);
            await msg.reply('❌ Failed to remove premium user.');
        }
    },

    // List premium users (owner only)
    listpremium: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ This command is restricted to the bot owner only.');
            }

            const premiumUsers = db.getSetting('premium_users', []);
            
            let response = `👑 *PREMIUM USERS* 👑\n\n`;
            
            if (premiumUsers.length === 0) {
                response += `No premium users found.\n\n`;
            } else {
                response += `**Total Premium Users:** ${premiumUsers.length}\n\n`;
                premiumUsers.forEach((user, index) => {
                    const username = user.split('@')[0];
                    response += `${index + 1}. @${username}\n`;
                });
                response += '\n';
            }
            
            response += `🔗 ${config.CHANNEL_URL}`;
            
            await msg.reply(response, { mentions: premiumUsers });

        } catch (error) {
            console.error('Error in listpremium command:', error);
            await msg.reply('❌ Failed to list premium users.');
        }
    },

    // PREMIUM COMMAND 1: Advanced AI Chat with Context
    aiplus: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide a prompt for advanced AI.\n\nUsage: `+aiplus Create a story about space exploration`');
            }

            await msg.react('🧠');
            const prompt = `You are an advanced AI assistant. Provide a detailed, creative, and comprehensive response to: ${args.join(' ')}`;
            const response = await gemini.generateResponse(prompt);

            await conn.sendMessage(msg.from, {
                text: `🧠 *PREMIUM AI+* 🧠\n\n${response}\n\n👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in aiplus command:', error);
            await msg.reply('❌ Advanced AI service unavailable.');
        }
    },

    // PREMIUM COMMAND 2: Bulk Web Scraping
    bulkscrape: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (args.length < 2) {
                return msg.reply('❌ Please provide multiple URLs.\n\nUsage: `+bulkscrape url1 url2 url3`');
            }

            await msg.react('🕷️');
            const urls = args.filter(arg => arg.startsWith('http'));
            
            if (urls.length === 0) {
                return msg.reply('❌ No valid URLs provided.');
            }

            let response = `🕷️ *BULK SCRAPER* 🕷️\n\n`;
            
            for (let i = 0; i < Math.min(urls.length, 3); i++) {
                try {
                    const content = await scraper.scrapeWebsite(urls[i]);
                    const summary = await gemini.summarizeText(content);
                    
                    response += `${i + 1}. **${urls[i]}**\n`;
                    response += `${summary.substring(0, 200)}...\n\n`;
                } catch (error) {
                    response += `${i + 1}. **${urls[i]}**\n`;
                    response += `❌ Failed to scrape\n\n`;
                }
            }
            
            response += `👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`;

            await conn.sendMessage(msg.from, { text: response }, { quoted: msg });
            await msg.react('✅');

        } catch (error) {
            console.error('Error in bulkscrape command:', error);
            await msg.reply('❌ Bulk scraping failed.');
        }
    },

    // PREMIUM COMMAND 3: Create Group
    creategroup: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide a group name.\n\nUsage: `+creategroup My New Group`');
            }

            const groupName = args.join(' ');
            const participants = [msg.sender]; // Add creator to group

            await msg.react('👥');
            
            try {
                const groupMetadata = await conn.groupCreate(groupName, participants);
                
                await msg.reply(
                    `👥 *GROUP CREATED* 👥\n\n` +
                    `✅ **Group Name:** ${groupName}\n` +
                    `🆔 **Group ID:** ${groupMetadata.id}\n` +
                    `👤 **Creator:** ${msg.pushName || msg.sender.split('@')[0]}\n\n` +
                    `Group has been created successfully!\n\n` +
                    `👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`
                );

                await msg.react('✅');

            } catch (error) {
                await msg.reply('❌ Failed to create group. You may need to be admin or the number might not be registered.');
            }

        } catch (error) {
            console.error('Error in creategroup command:', error);
            await msg.reply('❌ Group creation failed.');
        }
    },

    // PREMIUM COMMAND 4: Delete Group
    deletegroup: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can delete groups.');
            }

            await msg.reply(
                `🗑️ *GROUP DELETION* 🗑️\n\n` +
                `⚠️ This will permanently delete the group!\n` +
                `All messages and media will be lost.\n\n` +
                `Group will be deleted in 10 seconds...\n\n` +
                `👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`
            );

            setTimeout(async () => {
                try {
                    await conn.groupUpdateSubject(msg.from, '❌ DELETED');
                    await conn.groupLeave(msg.from);
                } catch (error) {
                    console.error('Error deleting group:', error);
                }
            }, 10000);

        } catch (error) {
            console.error('Error in deletegroup command:', error);
            await msg.reply('❌ Group deletion failed.');
        }
    },

    // PREMIUM COMMAND 5: Advanced Translation
    translateplus: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide text to translate.\n\nUsage: `+translateplus [text]` or reply to a message');
            }

            let text = args.join(' ');
            if (msg.quoted && msg.quoted.body) {
                text = msg.quoted.body;
            }

            await msg.react('🌍');
            
            // Translate to multiple languages
            const languages = ['spanish', 'french', 'german', 'italian', 'portuguese'];
            let response = `🌍 *PREMIUM TRANSLATOR* 🌍\n\n`;
            response += `📝 **Original:** ${text}\n\n`;
            
            for (const lang of languages.slice(0, 3)) {
                try {
                    const translation = await gemini.translateText(text, lang);
                    response += `🔹 **${lang.toUpperCase()}:** ${translation}\n\n`;
                } catch (error) {
                    response += `🔹 **${lang.toUpperCase()}:** Translation failed\n\n`;
                }
            }
            
            response += `👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`;

            await conn.sendMessage(msg.from, { text: response }, { quoted: msg });
            await msg.react('✅');

        } catch (error) {
            console.error('Error in translateplus command:', error);
            await msg.reply('❌ Advanced translation failed.');
        }
    },

    // PREMIUM COMMAND 6: Code Generator
    codegen: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!args.length) {
                return msg.reply('❌ Please describe what code you want.\n\nUsage: `+codegen Create a Python function to sort a list`');
            }

            await msg.react('💻');
            const prompt = `Generate clean, well-commented code for: ${args.join(' ')}. Include explanation of how it works.`;
            const code = await gemini.generateResponse(prompt);

            await conn.sendMessage(msg.from, {
                text: `💻 *CODE GENERATOR* 💻\n\n${code}\n\n👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in codegen command:', error);
            await msg.reply('❌ Code generation failed.');
        }
    },

    // PREMIUM COMMAND 7: Social Media Analytics
    socialanalytics: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!args[0]) {
                return msg.reply('❌ Please provide a social media URL.\n\nUsage: `+socialanalytics https://instagram.com/post/...`');
            }

            await msg.react('📊');
            const url = args[0];
            const analytics = await scraper.scrapeSocialMedia('general', url);
            
            let response = `📊 *SOCIAL ANALYTICS* 📊\n\n`;
            response += `🔗 **URL:** ${url}\n\n`;
            
            if (analytics) {
                response += `📄 **Content Preview:**\n${analytics.content}\n\n`;
                response += `⏰ **Analyzed:** ${new Date(analytics.timestamp).toLocaleString()}\n\n`;
            } else {
                response += `❌ Could not analyze this social media content.\n\n`;
            }
            
            response += `👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`;

            await conn.sendMessage(msg.from, { text: response }, { quoted: msg });
            await msg.react('✅');

        } catch (error) {
            console.error('Error in socialanalytics command:', error);
            await msg.reply('❌ Social analytics failed.');
        }
    },

    // PREMIUM COMMAND 8: Bulk Image Analysis
    bulkimgai: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            // This would analyze multiple images in a conversation
            await msg.reply(
                `👁️ *BULK IMAGE AI* 👁️\n\n` +
                `Send me multiple images and I'll analyze them all!\n\n` +
                `📸 Forward or send images one by one\n` +
                `🤖 I'll provide detailed analysis for each\n\n` +
                `👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in bulkimgai command:', error);
            await msg.reply('❌ Bulk image analysis setup failed.');
        }
    },

    // PREMIUM COMMAND 9: Content Creator
    contentcreator: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!args.length) {
                return msg.reply('❌ Please specify content type.\n\nUsage: `+contentcreator blog post about technology`');
            }

            await msg.react('✍️');
            const prompt = `Create engaging, professional content for: ${args.join(' ')}. Make it creative, informative, and well-structured.`;
            const content = await gemini.generateResponse(prompt);

            await conn.sendMessage(msg.from, {
                text: `✍️ *CONTENT CREATOR* ✍️\n\n${content}\n\n👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in contentcreator command:', error);
            await msg.reply('❌ Content creation failed.');
        }
    },

    // PREMIUM COMMAND 10: Data Analyzer
    dataanalyzer: async (conn, msg, args) => {
        try {
            if (!isPremiumUser(msg.sender)) {
                return msg.reply('👑 This is a premium command. Contact the owner to get premium access.');
            }

            if (!args.length && !msg.quoted) {
                return msg.reply('❌ Please provide data to analyze.\n\nUsage: `+dataanalyzer [data]` or reply to a message with data');
            }

            let data = args.join(' ');
            if (msg.quoted && msg.quoted.body) {
                data = msg.quoted.body;
            }

            await msg.react('📈');
            const prompt = `Analyze this data and provide insights, patterns, trends, and recommendations: ${data}`;
            const analysis = await gemini.generateResponse(prompt);

            await conn.sendMessage(msg.from, {
                text: `📈 *DATA ANALYZER* 📈\n\n${analysis}\n\n👑 Premium Feature\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in dataanalyzer command:', error);
            await msg.reply('❌ Data analysis failed.');
        }
    }
};

module.exports = commands;