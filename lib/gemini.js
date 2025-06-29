const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiAI {
    constructor() {
        this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    async generateResponse(prompt) {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            return 'I apologize, but I encountered an error while processing your request. Please try again later.';
        }
    }

    async analyzeImage(imageBuffer, prompt = "Describe this image in detail") {
        try {
            const result = await this.model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageBuffer.toString('base64'),
                        mimeType: 'image/jpeg'
                    }
                }
            ]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini Image Analysis Error:', error);
            return 'I could not analyze this image. Please try again.';
        }
    }

    async translateText(text, targetLanguage) {
        try {
            const prompt = `Translate the following text to ${targetLanguage}: "${text}"`;
            return await this.generateResponse(prompt);
        } catch (error) {
            console.error('Translation Error:', error);
            return 'Translation failed. Please try again.';
        }
    }

    async summarizeText(text) {
        try {
            const prompt = `Summarize the following text concisely: "${text}"`;
            return await this.generateResponse(prompt);
        } catch (error) {
            console.error('Summarization Error:', error);
            return 'Summarization failed. Please try again.';
        }
    }
}

module.exports = { GeminiAI };