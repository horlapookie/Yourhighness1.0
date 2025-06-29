const config = require('../config');
const { GeminiAI } = require('../lib/gemini');
const { WebScraper } = require('../lib/web-scraper');
const db = require('../lib/database');

const gemini = new GeminiAI();
const scraper = new WebScraper();

const commands = {
    // AI Chat
    ai: async (conn, msg, args) => {
        try {
            if (!args.length) {
                return msg.reply('❌ Please provide a question or prompt.\n\nUsage: `+ai What is artificial intelligence?`');
            }

            await msg.react('🤖');
            const query = args.join(' ');
            const response = await gemini.generateResponse(query);

            await conn.sendMessage(msg.from, {
                text: `🤖 *YOURHÏGHNESS AI* 🤖\n\n${response}\n\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in ai command:', error);
            await msg.react('❌');
            await msg.reply('❌ AI service is currently unavailable.');
        }
    },

    // Image Analysis
    imgai: async (conn, msg, args) => {
        try {
            if (!msg.quoted || !msg.quoted.isImage) {
                return msg.reply('❌ Please reply to an image for AI analysis.\n\nUsage: Reply to an image with `+imgai`');
            }

            await msg.react('👁️');
            const media = await msg.quoted.download();
            const prompt = args.length > 0 ? args.join(' ') : 'Analyze this image in detail';
            
            const analysis = await gemini.analyzeImage(media, prompt);

            await conn.sendMessage(msg.from, {
                text: `👁️ *IMAGE ANALYSIS* 👁️\n\n${analysis}\n\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in imgai command:', error);
            await msg.react('❌');
            await msg.reply('❌ Image analysis failed.');
        }
    },

    // Web Scraping
    scrape: async (conn, msg, args) => {
        try {
            if (!args[0]) {
                return msg.reply('❌ Please provide a URL to scrape.\n\nUsage: `+scrape https://example.com`');
            }

            const url = args[0];
            if (!url.startsWith('http')) {
                return msg.reply('❌ Please provide a valid URL starting with http:// or https://');
            }

            await msg.react('🕷️');
            const content = await scraper.scrapeWebsite(url);
            
            // Use AI to summarize the scraped content
            const summary = await gemini.summarizeText(content);

            await conn.sendMessage(msg.from, {
                text: `🕷️ *WEB SCRAPER* 🕷️\n\n📍 **URL:** ${url}\n\n📄 **Summary:**\n${summary}\n\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in scrape command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to scrape the website.');
        }
    },

    // News Scraping
    news: async (conn, msg, args) => {
        try {
            const topic = args.join(' ') || 'technology';
            
            await msg.react('📰');
            const newsData = await scraper.scrapeNews(topic);
            
            let response = `📰 *NEWS UPDATES* 📰\n\n`;
            response += `🏷️ **Topic:** ${topic}\n\n`;
            
            if (newsData && newsData.articles) {
                newsData.articles.forEach((article, index) => {
                    response += `${index + 1}. **${article.title}**\n`;
                    response += `   ${article.summary}\n`;
                    response += `   📍 Source: ${article.source}\n\n`;
                });
            } else {
                response += `ℹ️ No recent news found for "${topic}"\n\n`;
            }
            
            response += `🔗 ${config.CHANNEL_URL}`;

            await conn.sendMessage(msg.from, {
                text: response,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in news command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to fetch news.');
        }
    },

    // Translation
    translate: async (conn, msg, args) => {
        try {
            if (args.length < 2) {
                return msg.reply('❌ Please provide language and text.\n\nUsage: `+translate spanish Hello world`');
            }

            const language = args[0];
            const text = args.slice(1).join(' ');
            
            await msg.react('🌍');
            const translation = await gemini.translateText(text, language);

            await conn.sendMessage(msg.from, {
                text: `🌍 *TRANSLATOR* 🌍\n\n📝 **Original:** ${text}\n🔄 **Language:** ${language}\n📋 **Translation:** ${translation}\n\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in translate command:', error);
            await msg.react('❌');
            await msg.reply('❌ Translation failed.');
        }
    },

    // Summarize
    summarize: async (conn, msg, args) => {
        try {
            if (!args.length && !msg.quoted) {
                return msg.reply('❌ Please provide text to summarize or reply to a message.\n\nUsage: `+summarize [text]`');
            }

            let text = args.join(' ');
            if (!text && msg.quoted) {
                text = msg.quoted.body || msg.quoted.text || '';
            }

            if (!text) {
                return msg.reply('❌ No text found to summarize.');
            }

            await msg.react('📄');
            const summary = await gemini.summarizeText(text);

            await conn.sendMessage(msg.from, {
                text: `📄 *TEXT SUMMARY* 📄\n\n${summary}\n\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in summarize command:', error);
            await msg.react('❌');
            await msg.reply('❌ Summarization failed.');
        }
    },

    // Chat with AI (continuous conversation)
    chat: async (conn, msg, args) => {
        try {
            if (!args.length) {
                return msg.reply('❌ Please provide a message to chat.\n\nUsage: `+chat How are you today?`');
            }

            const userId = msg.sender;
            const message = args.join(' ');
            
            // Get user's chat history
            let chatHistory = db.getSetting(`chat_history_${userId}`, []);
            
            // Add user message to history
            chatHistory.push({ role: 'user', content: message });
            
            // Keep only last 10 messages for context
            if (chatHistory.length > 10) {
                chatHistory = chatHistory.slice(-10);
            }
            
            await msg.react('💬');
            
            // Create context from history
            let context = chatHistory.map(h => `${h.role}: ${h.content}`).join('\n');
            const response = await gemini.generateResponse(context);
            
            // Add AI response to history
            chatHistory.push({ role: 'assistant', content: response });
            db.setSetting(`chat_history_${userId}`, chatHistory);

            await conn.sendMessage(msg.from, {
                text: `💬 *AI CHAT* 💬\n\n${response}\n\n🔗 ${config.CHANNEL_URL}`,
            }, { quoted: msg });

            await msg.react('✅');

        } catch (error) {
            console.error('Error in chat command:', error);
            await msg.react('❌');
            await msg.reply('❌ Chat service unavailable.');
        }
    },

    // Clear chat history
    clearchat: async (conn, msg, args) => {
        try {
            const userId = msg.sender;
            db.setSetting(`chat_history_${userId}`, []);
            
            await msg.reply(`🗑️ *CHAT CLEARED* 🗑️\n\nYour AI chat history has been cleared.\n\n🔗 ${config.CHANNEL_URL}`);

        } catch (error) {
            console.error('Error in clearchat command:', error);
            await msg.reply('❌ Failed to clear chat history.');
        }
    }
};

module.exports = commands;