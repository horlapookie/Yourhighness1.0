const https = require('https');
const http = require('http');

class WebScraper {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }

    async scrapeWebsite(url) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https:') ? https : http;
            
            const options = {
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                }
            };

            const req = protocol.get(url, options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve(this.extractTextContent(data));
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

    extractTextContent(html) {
        // Simple text extraction - remove HTML tags and scripts
        let text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Limit text length
        if (text.length > 2000) {
            text = text.substring(0, 2000) + '...';
        }

        return text;
    }

    async scrapeNews(topic = 'technology') {
        try {
            // Simple news scraping - in real implementation would use proper APIs
            const newsData = {
                topic,
                articles: [
                    {
                        title: `Latest ${topic} news`,
                        summary: 'News content would be scraped from authorized sources',
                        source: 'News Source',
                        url: 'https://example.com'
                    }
                ]
            };
            return newsData;
        } catch (error) {
            console.error('News scraping error:', error);
            return null;
        }
    }

    async scrapeSocialMedia(platform, url) {
        try {
            // Social media content extraction
            const content = await this.scrapeWebsite(url);
            
            return {
                platform,
                content: content.substring(0, 500),
                url,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Social media scraping error:', error);
            return null;
        }
    }
}

module.exports = { WebScraper };