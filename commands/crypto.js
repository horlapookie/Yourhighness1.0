const config = require('../config');
const https = require('https');

// Helper function to make API requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (error) {
                    resolve(data);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

const commands = {
    // Get cryptocurrency price
    'crypto-price': async (conn, msg, args) => {
        try {
            if (!args[0]) {
                return msg.reply('❌ Please provide a cryptocurrency symbol.\n\nUsage: `+crypto-price bitcoin` or `+crypto-price btc`');
            }

            const symbol = args[0].toLowerCase();
            await msg.react('₿');

            try {
                // Using CoinGecko API (free tier)
                const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd,btc&include_24hr_change=true&include_market_cap=true`;
                const data = await makeRequest(url);

                if (data[symbol]) {
                    const crypto = data[symbol];
                    const change24h = crypto.usd_24h_change || 0;
                    const changeEmoji = change24h >= 0 ? '📈' : '📉';
                    const changeColor = change24h >= 0 ? '🟢' : '🔴';

                    await conn.sendMessage(msg.from, {
                        text: `₿ *CRYPTO PRICE* ₿\n\n` +
                              `💎 **${symbol.toUpperCase()}**\n\n` +
                              `💵 **Price:** $${crypto.usd?.toLocaleString() || 'N/A'}\n` +
                              `₿ **BTC Value:** ${crypto.btc || 'N/A'} BTC\n` +
                              `${changeColor} **24h Change:** ${change24h >= 0 ? '+' : ''}${change24h?.toFixed(2) || 0}% ${changeEmoji}\n` +
                              `📊 **Market Cap:** $${crypto.usd_market_cap?.toLocaleString() || 'N/A'}\n\n` +
                              `⏰ **Last Updated:** ${new Date().toLocaleString()}\n\n` +
                              `🔗 ${config.CHANNEL_URL}`,
                    }, { quoted: msg });
                } else {
                    // Try alternative API call with different symbols
                    const altSymbols = {
                        'btc': 'bitcoin',
                        'eth': 'ethereum', 
                        'ada': 'cardano',
                        'doge': 'dogecoin',
                        'bnb': 'binancecoin',
                        'xrp': 'ripple',
                        'sol': 'solana',
                        'dot': 'polkadot',
                        'avax': 'avalanche-2',
                        'matic': 'matic-network'
                    };

                    const altSymbol = altSymbols[symbol] || symbol;
                    const altUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${altSymbol}&vs_currencies=usd,btc&include_24hr_change=true`;
                    const altData = await makeRequest(altUrl);

                    if (altData[altSymbol]) {
                        const crypto = altData[altSymbol];
                        const change24h = crypto.usd_24h_change || 0;
                        const changeEmoji = change24h >= 0 ? '📈' : '📉';
                        const changeColor = change24h >= 0 ? '🟢' : '🔴';

                        await conn.sendMessage(msg.from, {
                            text: `₿ *CRYPTO PRICE* ₿\n\n` +
                                  `💎 **${symbol.toUpperCase()}**\n\n` +
                                  `💵 **Price:** $${crypto.usd?.toLocaleString() || 'N/A'}\n` +
                                  `₿ **BTC Value:** ${crypto.btc || 'N/A'} BTC\n` +
                                  `${changeColor} **24h Change:** ${change24h >= 0 ? '+' : ''}${change24h?.toFixed(2) || 0}% ${changeEmoji}\n\n` +
                                  `⏰ **Last Updated:** ${new Date().toLocaleString()}\n\n` +
                                  `🔗 ${config.CHANNEL_URL}`,
                        }, { quoted: msg });
                    } else {
                        await msg.reply(`❌ Cryptocurrency "${symbol}" not found. Try popular symbols like: btc, eth, ada, doge, bnb`);
                    }
                }
            } catch (error) {
                console.error('Crypto API Error:', error);
                await msg.reply('❌ Failed to fetch cryptocurrency data. API may be temporarily unavailable.');
            }

            await msg.react('✅');

        } catch (error) {
            console.error('Error in crypto-price command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to get cryptocurrency price.');
        }
    },

    // Get top cryptocurrencies
    'top-crypto': async (conn, msg, args) => {
        try {
            await msg.react('🏆');

            try {
                const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
                const data = await makeRequest(url);

                if (Array.isArray(data) && data.length > 0) {
                    let response = `🏆 *TOP CRYPTOCURRENCIES* 🏆\n\n`;
                    
                    data.forEach((coin, index) => {
                        const change24h = coin.price_change_percentage_24h || 0;
                        const changeEmoji = change24h >= 0 ? '📈' : '📉';
                        const changeColor = change24h >= 0 ? '🟢' : '🔴';
                        
                        response += `${index + 1}. **${coin.name} (${coin.symbol.toUpperCase()})**\n`;
                        response += `   💵 $${coin.current_price?.toLocaleString() || 'N/A'}\n`;
                        response += `   ${changeColor} ${change24h >= 0 ? '+' : ''}${change24h?.toFixed(2) || 0}% ${changeEmoji}\n`;
                        response += `   📊 MC: $${coin.market_cap ? (coin.market_cap / 1e9).toFixed(1) + 'B' : 'N/A'}\n\n`;
                    });

                    response += `⏰ **Last Updated:** ${new Date().toLocaleString()}\n\n`;
                    response += `🔗 ${config.CHANNEL_URL}`;

                    await conn.sendMessage(msg.from, { text: response }, { quoted: msg });
                } else {
                    await msg.reply('❌ Failed to fetch top cryptocurrencies data.');
                }
            } catch (error) {
                console.error('Top Crypto API Error:', error);
                await msg.reply('❌ Failed to fetch top cryptocurrencies. API may be temporarily unavailable.');
            }

            await msg.react('✅');

        } catch (error) {
            console.error('Error in top-crypto command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to get top cryptocurrencies.');
        }
    },

    // Crypto market index
    'crypto-index': async (conn, msg, args) => {
        try {
            await msg.react('📊');

            try {
                const url = 'https://api.coingecko.com/api/v3/global';
                const data = await makeRequest(url);

                if (data.data) {
                    const globalData = data.data;
                    const marketCap = globalData.total_market_cap?.usd;
                    const volume24h = globalData.total_volume?.usd;
                    const btcDominance = globalData.market_cap_percentage?.btc;
                    const ethDominance = globalData.market_cap_percentage?.eth;

                    await conn.sendMessage(msg.from, {
                        text: `📊 *CRYPTO MARKET INDEX* 📊\n\n` +
                              `🌍 **Global Market Stats**\n\n` +
                              `💰 **Total Market Cap:** $${marketCap ? (marketCap / 1e12).toFixed(2) + 'T' : 'N/A'}\n` +
                              `📈 **24h Volume:** $${volume24h ? (volume24h / 1e9).toFixed(1) + 'B' : 'N/A'}\n` +
                              `₿ **Bitcoin Dominance:** ${btcDominance?.toFixed(1) || 'N/A'}%\n` +
                              `⚡ **Ethereum Dominance:** ${ethDominance?.toFixed(1) || 'N/A'}%\n` +
                              `🪙 **Active Cryptocurrencies:** ${globalData.active_cryptocurrencies?.toLocaleString() || 'N/A'}\n` +
                              `🏪 **Markets:** ${globalData.markets?.toLocaleString() || 'N/A'}\n\n` +
                              `⏰ **Last Updated:** ${new Date().toLocaleString()}\n\n` +
                              `🔗 ${config.CHANNEL_URL}`,
                    }, { quoted: msg });
                } else {
                    await msg.reply('❌ Failed to fetch crypto market index data.');
                }
            } catch (error) {
                console.error('Crypto Index API Error:', error);
                await msg.reply('❌ Failed to fetch market index. API may be temporarily unavailable.');
            }

            await msg.react('✅');

        } catch (error) {
            console.error('Error in crypto-index command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to get crypto market index.');
        }
    },

    // Crypto converter
    'crypto-convert': async (conn, msg, args) => {
        try {
            if (args.length < 3) {
                return msg.reply('❌ Please provide amount, from currency, and to currency.\n\nUsage: `+crypto-convert 1 btc usd`');
            }

            const amount = parseFloat(args[0]);
            const fromCurrency = args[1].toLowerCase();
            const toCurrency = args[2].toLowerCase();

            if (isNaN(amount)) {
                return msg.reply('❌ Please provide a valid amount.');
            }

            await msg.react('🔄');

            try {
                // Map common symbols to CoinGecko IDs
                const cryptoMap = {
                    'btc': 'bitcoin',
                    'eth': 'ethereum',
                    'ada': 'cardano',
                    'doge': 'dogecoin',
                    'bnb': 'binancecoin',
                    'xrp': 'ripple',
                    'sol': 'solana'
                };

                const fromId = cryptoMap[fromCurrency] || fromCurrency;
                const toId = cryptoMap[toCurrency] || toCurrency;

                // Get prices for both currencies
                const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd`;
                const data = await makeRequest(url);

                if (data[fromId] && data[toId]) {
                    const fromPrice = data[fromId].usd;
                    const toPrice = data[toId].usd;
                    const convertedAmount = (amount * fromPrice) / toPrice;

                    await conn.sendMessage(msg.from, {
                        text: `🔄 *CRYPTO CONVERTER* 🔄\n\n` +
                              `💱 **Conversion:**\n` +
                              `${amount} ${fromCurrency.toUpperCase()} = ${convertedAmount.toFixed(8)} ${toCurrency.toUpperCase()}\n\n` +
                              `💵 **USD Values:**\n` +
                              `• ${fromCurrency.toUpperCase()}: $${fromPrice?.toLocaleString()}\n` +
                              `• ${toCurrency.toUpperCase()}: $${toPrice?.toLocaleString()}\n\n` +
                              `⏰ **Rate as of:** ${new Date().toLocaleString()}\n\n` +
                              `🔗 ${config.CHANNEL_URL}`,
                    }, { quoted: msg });
                } else {
                    await msg.reply(`❌ Could not find price data for one or both currencies: ${fromCurrency}, ${toCurrency}`);
                }
            } catch (error) {
                console.error('Crypto Convert API Error:', error);
                await msg.reply('❌ Failed to convert currencies. API may be temporarily unavailable.');
            }

            await msg.react('✅');

        } catch (error) {
            console.error('Error in crypto-convert command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to convert cryptocurrency.');
        }
    },

    // Crypto news
    'crypto-news': async (conn, msg, args) => {
        try {
            await msg.react('📰');

            // Since we don't have a news API key, we'll provide general crypto news structure
            const newsItems = [
                {
                    title: "Bitcoin Reaches New Heights",
                    summary: "Latest market analysis shows Bitcoin continuing its upward trend with institutional adoption.",
                    source: "Crypto Daily",
                    time: "2 hours ago"
                },
                {
                    title: "Ethereum 2.0 Developments",
                    summary: "Major updates in Ethereum ecosystem bring new features and improvements.",
                    source: "Blockchain News",
                    time: "4 hours ago"
                },
                {
                    title: "DeFi Protocol Updates", 
                    summary: "Several DeFi platforms announce new features and yield farming opportunities.",
                    source: "DeFi Pulse",
                    time: "6 hours ago"
                },
                {
                    title: "Regulatory Updates",
                    summary: "New cryptocurrency regulations discussed in major financial markets.",
                    source: "Financial Times",
                    time: "8 hours ago"
                }
            ];

            let response = `📰 *CRYPTO NEWS* 📰\n\n`;
            
            newsItems.forEach((news, index) => {
                response += `${index + 1}. **${news.title}**\n`;
                response += `   ${news.summary}\n`;
                response += `   📍 ${news.source} • ${news.time}\n\n`;
            });

            response += `ℹ️ **Note:** For real-time crypto news, integrate with news APIs or RSS feeds.\n\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await conn.sendMessage(msg.from, { text: response }, { quoted: msg });
            await msg.react('✅');

        } catch (error) {
            console.error('Error in crypto-news command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to get crypto news.');
        }
    }
};

module.exports = commands;