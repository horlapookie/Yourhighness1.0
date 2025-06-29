const config = require('../config');
const { getRandomFact, getRandomJoke, getChatGPTResponse } = require('../utils/api');

const commands = {
    // Brazzers meme
    brazzers: async (conn, msg, args) => {
        try {
            if (!msg.quoted || !msg.quoted.isImage) {
                return msg.reply('❌ Please reply to an image to add the Brazzers logo.');
            }

            await msg.react('⏳');
            
            const media = await msg.quoted.download();
            // In a real implementation, you would process the image to add the Brazzers logo
            // For now, we'll just send the original image with a caption
            
            await conn.sendMessage(msg.from, {
                image: media,
                caption: `🔞 *BRAZZERS* 🔞\n\n_Created by yourhïghness_\n🔗 ${config.CHANNEL_URL}`
            }, { quoted: msg });
            
            await msg.react('✅');
            
        } catch (error) {
            console.error('Error in brazzers command:', error);
            await msg.react('❌');
            return msg.reply('❌ Failed to process the brazzers meme.');
        }
    },

    // Chat with AI
    chat: async (conn, msg, args) => {
        try {
            if (!args.length) {
                return msg.reply('❌ Please provide a message to chat.\n\nUsage: `+chat Hello, how are you?`');
            }

            const query = args.join(' ');
            await msg.react('🤖');

            const response = await getChatGPTResponse(query);
            
            await msg.reply(
                `🤖 *AI Chat Response* 🤖\n\n` +
                `💭 ${response}\n\n` +
                `_Powered by yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in chat command:', error);
            await msg.reply('❌ Failed to get AI response. The AI service might be unavailable.');
        }
    },

    // ChatGPT (alias for chat)
    chatgpt: async (conn, msg, args) => {
        await commands.chat(conn, msg, args);
    },

    // Random fact
    fact: async (conn, msg, args) => {
        try {
            await msg.react('🧠');
            
            const fact = await getRandomFact();
            
            await msg.reply(
                `🧠 *Random Fact* 🧠\n\n` +
                `💡 ${fact}\n\n` +
                `_Did you know? - yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in fact command:', error);
            await msg.reply('❌ Failed to fetch a random fact.');
        }
    },

    // Friendship meter
    friendship: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || mentioned.length < 2) {
                return msg.reply('❌ Please mention two users to check their friendship level.\n\nUsage: `+friendship @user1 @user2`');
            }

            const user1 = mentioned[0].split('@')[0];
            const user2 = mentioned[1].split('@')[0];
            const percentage = Math.floor(Math.random() * 101);
            
            let status = '';
            if (percentage < 20) status = '💔 Enemies';
            else if (percentage < 40) status = '😐 Strangers';
            else if (percentage < 60) status = '🙂 Acquaintances';
            else if (percentage < 80) status = '😊 Good Friends';
            else if (percentage < 95) status = '👫 Best Friends';
            else status = '💕 Soulmates';

            await msg.reply(
                `💫 *Friendship Meter* 💫\n\n` +
                `👥 ${user1} & ${user2}\n` +
                `📊 Friendship Level: ${percentage}%\n` +
                `💖 Status: ${status}\n\n` +
                `${'█'.repeat(Math.floor(percentage / 10))}${'░'.repeat(10 - Math.floor(percentage / 10))} ${percentage}%\n\n` +
                `_Calculated by yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: mentioned }
            );

        } catch (error) {
            console.error('Error in friendship command:', error);
            await msg.reply('❌ Failed to calculate friendship level.');
        }
    },

    // AI Image generation
    imagine: async (conn, msg, args) => {
        try {
            if (!args.length) {
                return msg.reply('❌ Please provide a description for the image.\n\nUsage: `+imagine a cat sitting on a rainbow`');
            }

            const prompt = args.join(' ');
            await msg.react('🎨');

            // This would integrate with an AI image generation API
            await msg.reply(
                `🎨 *AI Image Generation* 🎨\n\n` +
                `📝 Prompt: "${prompt}"\n\n` +
                `⚠️ AI image generation is currently unavailable. This feature requires API integration.\n\n` +
                `_Powered by yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in imagine command:', error);
            await msg.reply('❌ Failed to generate AI image.');
        }
    },

    // Random joke
    joke: async (conn, msg, args) => {
        try {
            await msg.react('😂');
            
            const joke = await getRandomJoke();
            
            await msg.reply(
                `😂 *Random Joke* 😂\n\n` +
                `${joke}\n\n` +
                `_Hope that made you laugh! - yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in joke command:', error);
            await msg.reply('❌ Failed to fetch a random joke.');
        }
    },

    // Memo game
    memo: async (conn, msg, args) => {
        try {
            const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
            const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
            
            let board = '';
            for (let i = 0; i < 16; i++) {
                board += `${i + 1}⃣ `;
                if ((i + 1) % 4 === 0) board += '\n';
            }

            await msg.reply(
                `🧩 *Memory Game* 🧩\n\n` +
                `${board}\n` +
                `🎯 Find all matching pairs!\n` +
                `📖 Use \`${config.PREFIX}memo <number>\` to flip a card\n\n` +
                `_yourhïghness Memory Challenge_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in memo command:', error);
            await msg.reply('❌ Failed to start memory game.');
        }
    },

    // Random reaction
    reaction: async (conn, msg, args) => {
        try {
            const reactions = [
                '😂', '😭', '😍', '🤔', '😤', '🙄', '😱', '🤯', 
                '😴', '🤤', '😋', '🤪', '😎', '🥳', '😇', '🤠'
            ];
            
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            
            await msg.react(randomReaction);
            
            await msg.reply(
                `${randomReaction} *Random Reaction* ${randomReaction}\n\n` +
                `Here's your random reaction: ${randomReaction}\n\n` +
                `_Express yourself! - yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in reaction command:', error);
            await msg.reply('❌ Failed to generate random reaction.');
        }
    },

    // Ship compatibility
    ship: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || mentioned.length < 2) {
                return msg.reply('❌ Please mention two users to ship them.\n\nUsage: `+ship @user1 @user2`');
            }

            const user1 = mentioned[0].split('@')[0];
            const user2 = mentioned[1].split('@')[0];
            const compatibility = Math.floor(Math.random() * 101);
            
            let shipName = user1.substring(0, Math.ceil(user1.length / 2)) + 
                          user2.substring(Math.floor(user2.length / 2));
            
            let status = '';
            if (compatibility < 20) status = '💔 Not meant to be';
            else if (compatibility < 40) status = '😐 Just friends';
            else if (compatibility < 60) status = '💕 Cute couple';
            else if (compatibility < 80) status = '❤️ Perfect match';
            else status = '💖 Soulmates forever';

            await msg.reply(
                `💕 *Ship Compatibility* 💕\n\n` +
                `👥 ${user1} ❤️ ${user2}\n` +
                `🚢 Ship Name: ${shipName}\n` +
                `📊 Compatibility: ${compatibility}%\n` +
                `💖 Status: ${status}\n\n` +
                `${'💖'.repeat(Math.floor(compatibility / 20))}${'🤍'.repeat(5 - Math.floor(compatibility / 20))}\n\n` +
                `_Love is in the air! - yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: mentioned }
            );

        } catch (error) {
            console.error('Error in ship command:', error);
            await msg.reply('❌ Failed to calculate ship compatibility.');
        }
    },

    // Simp meter
    simp: async (conn, msg, args) => {
        try {
            const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.sender;
            const username = target.split('@')[0];
            const simpLevel = Math.floor(Math.random() * 101);
            
            let status = '';
            if (simpLevel < 20) status = '😎 Chad Energy';
            else if (simpLevel < 40) status = '🙂 Normal Person';
            else if (simpLevel < 60) status = '😍 Slight Simp';
            else if (simpLevel < 80) status = '🤤 Major Simp';
            else status = '👑 Ultimate Simp Lord';

            await msg.reply(
                `👑 *Simp Meter* 👑\n\n` +
                `👤 Target: ${username}\n` +
                `📊 Simp Level: ${simpLevel}%\n` +
                `🏷️ Status: ${status}\n\n` +
                `${'💖'.repeat(Math.floor(simpLevel / 20))}${'⬜'.repeat(5 - Math.floor(simpLevel / 20))}\n\n` +
                `_Don't take it seriously! - yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [target] }
            );

        } catch (error) {
            console.error('Error in simp command:', error);
            await msg.reply('❌ Failed to calculate simp level.');
        }
    },

    // Thug life meme
    'thug-life': async (conn, msg, args) => {
        try {
            if (!msg.quoted || !msg.quoted.isImage) {
                return msg.reply('❌ Please reply to an image to add thug life effect.');
            }

            await msg.react('😎');
            
            const media = await msg.quoted.download();
            
            await conn.sendMessage(msg.from, {
                image: media,
                caption: `😎 *THUG LIFE* 😎\n\n_Deal with it! - yourhïghness_\n🔗 ${config.CHANNEL_URL}`
            }, { quoted: msg });
            
            await msg.react('✅');

        } catch (error) {
            console.error('Error in thug-life command:', error);
            await msg.react('❌');
            return msg.reply('❌ Failed to create thug life meme.');
        }
    },

    // Triggered meme
    triggered: async (conn, msg, args) => {
        try {
            if (!msg.quoted || !msg.quoted.isImage) {
                return msg.reply('❌ Please reply to an image to add triggered effect.');
            }

            await msg.react('😡');
            
            const media = await msg.quoted.download();
            
            await conn.sendMessage(msg.from, {
                image: media,
                caption: `😡 *TRIGGERED* 😡\n\n_REEEEEEEE! - yourhïghness_\n🔗 ${config.CHANNEL_URL}`
            }, { quoted: msg });
            
            await msg.react('✅');

        } catch (error) {
            console.error('Error in triggered command:', error);
            await msg.react('❌');
            return msg.reply('❌ Failed to create triggered meme.');
        }
    },

    // Tweet maker
    tweet: async (conn, msg, args) => {
        try {
            if (!args.length) {
                return msg.reply('❌ Please provide text for the tweet.\n\nUsage: `+tweet This is my fake tweet!`');
            }

            const tweetText = args.join(' ');
            const username = msg.pushName || msg.sender.split('@')[0];
            
            const tweetFormat = 
                `🐦 *Twitter* 🐦\n\n` +
                `👤 @${username}\n` +
                `💬 ${tweetText}\n\n` +
                `⏰ ${new Date().toLocaleTimeString()} · ${new Date().toLocaleDateString()}\n` +
                `💬 0  🔁 0  ❤️ 0  📤\n\n` +
                `_Fake tweet by yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(tweetFormat);

        } catch (error) {
            console.error('Error in tweet command:', error);
            await msg.reply('❌ Failed to create fake tweet.');
        }
    }
};

module.exports = { commands };
