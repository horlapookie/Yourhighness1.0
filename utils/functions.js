const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Download file from URL
 */
async function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https:') ? https : http;
        const file = fs.createWriteStream(filepath);
        
        protocol.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });
        }).on('error', (error) => {
            fs.unlink(filepath, () => {}); // Delete file on error
            reject(error);
        });
    });
}

/**
 * Convert video to audio
 */
async function convertToAudio(inputBuffer, options = {}) {
    try {
        // This would require ffmpeg integration
        // For now, return the input buffer as a placeholder
        console.log('Audio conversion requested but not implemented');
        return inputBuffer;
    } catch (error) {
        console.error('Error converting to audio:', error);
        return null;
    }
}

/**
 * Create sticker from image/video
 */
async function createSticker(mediaBuffer, options = {}) {
    try {
        const { pack = 'yourhïghness', author = 'horlapookie', type = 'image' } = options;
        
        // This would require sharp/ffmpeg for image processing
        // For now, return the media buffer with sticker metadata
        console.log('Sticker creation requested but not fully implemented');
        
        // In a real implementation, you would:
        // 1. Resize image to 512x512
        // 2. Convert to WebP format for images
        // 3. Convert to WebM for animated stickers
        // 4. Add metadata (pack name, author)
        
        return mediaBuffer;
    } catch (error) {
        console.error('Error creating sticker:', error);
        return null;
    }
}

/**
 * Take screenshot of website
 */
async function takeScreenshot(url) {
    try {
        // This would require puppeteer or similar
        console.log('Screenshot requested but not implemented');
        return null;
    } catch (error) {
        console.error('Error taking screenshot:', error);
        return null;
    }
}

/**
 * Resize image
 */
async function resizeImage(imageBuffer, width, height) {
    try {
        // This would require sharp library
        console.log('Image resize requested but not implemented');
        return imageBuffer;
    } catch (error) {
        console.error('Error resizing image:', error);
        return null;
    }
}

/**
 * Convert image format
 */
async function convertImageFormat(imageBuffer, targetFormat) {
    try {
        // This would require sharp library
        console.log('Image format conversion requested but not implemented');
        return imageBuffer;
    } catch (error) {
        console.error('Error converting image format:', error);
        return null;
    }
}

/**
 * Generate QR code
 */
async function generateQR(text, options = {}) {
    try {
        // This would require qrcode library
        console.log('QR code generation requested but not implemented');
        return null;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

/**
 * Add watermark to image
 */
async function addWatermark(imageBuffer, watermarkText, options = {}) {
    try {
        // This would require image processing library
        console.log('Watermark addition requested but not implemented');
        return imageBuffer;
    } catch (error) {
        console.error('Error adding watermark:', error);
        return null;
    }
}

/**
 * Create meme with text
 */
async function createMeme(imageBuffer, topText, bottomText) {
    try {
        // This would require image processing with text overlay
        console.log('Meme creation requested but not implemented');
        return imageBuffer;
    } catch (error) {
        console.error('Error creating meme:', error);
        return null;
    }
}

/**
 * Extract frames from video
 */
async function extractVideoFrames(videoBuffer, frameCount = 10) {
    try {
        // This would require ffmpeg
        console.log('Video frame extraction requested but not implemented');
        return [];
    } catch (error) {
        console.error('Error extracting video frames:', error);
        return [];
    }
}

/**
 * Merge images into collage
 */
async function createCollage(imageBuffers, options = {}) {
    try {
        // This would require image processing library
        console.log('Collage creation requested but not implemented');
        return null;
    } catch (error) {
        console.error('Error creating collage:', error);
        return null;
    }
}

/**
 * Apply filter to image
 */
async function applyImageFilter(imageBuffer, filterType) {
    try {
        // This would require image processing library
        console.log('Image filter application requested but not implemented');
        return imageBuffer;
    } catch (error) {
        console.error('Error applying image filter:', error);
        return null;
    }
}

/**
 * Generate random string
 */
function generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Validate URL
 */
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Sleep function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format time duration
 */
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

/**
 * Check if file is image
 */
function isImage(filename) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    return imageExtensions.includes(getFileExtension(filename));
}

/**
 * Check if file is video
 */
function isVideo(filename) {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    return videoExtensions.includes(getFileExtension(filename));
}

/**
 * Check if file is audio
 */
function isAudio(filename) {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];
    return audioExtensions.includes(getFileExtension(filename));
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

/**
 * Get random element from array
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Convert text to title case
 */
function toTitleCase(string) {
    return string.replace(/\w\S*/g, capitalizeFirst);
}

/**
 * Remove duplicates from array
 */
function removeDuplicates(array) {
    return [...new Set(array)];
}

/**
 * Check if string contains only numbers
 */
function isNumeric(string) {
    return /^\d+$/.test(string);
}

/**
 * Parse phone number
 */
function parsePhoneNumber(number) {
    const cleaned = number.replace(/[^0-9]/g, '');
    return cleaned.startsWith('1') ? cleaned : '1' + cleaned;
}

/**
 * Validate email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate hash from string
 */
function generateHash(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
}

module.exports = {
    downloadFile,
    convertToAudio,
    createSticker,
    takeScreenshot,
    resizeImage,
    convertImageFormat,
    generateQR,
    addWatermark,
    createMeme,
    extractVideoFrames,
    createCollage,
    applyImageFilter,
    generateRandomString,
    formatBytes,
    isValidURL,
    sleep,
    formatDuration,
    getFileExtension,
    isImage,
    isVideo,
    isAudio,
    sanitizeFilename,
    getRandomElement,
    shuffleArray,
    capitalizeFirst,
    toTitleCase,
    removeDuplicates,
    isNumeric,
    parsePhoneNumber,
    isValidEmail,
    generateHash
};
