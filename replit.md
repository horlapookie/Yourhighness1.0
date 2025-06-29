# yourhïghness - WhatsApp Multi-Device Bot

## Overview

This is a comprehensive WhatsApp Multi-Device bot built with Baileys MD, featuring 80+ commands across multiple categories. The bot supports phone number pairing, custom session management, and includes various entertainment, utility, and moderation features.

## System Architecture

### Core Technologies
- **Runtime**: Node.js 16+
- **WhatsApp API**: @whiskeysockets/baileys (v6.7.18)
- **Session Management**: Multi-file auth state with custom session support
- **Configuration**: Environment variables with dotenv
- **Logging**: Pino logger with silent mode
- **Caching**: NodeCache for message retry counters

### Application Structure
- **Modular Command System**: Commands organized by category in separate files
- **Event-Driven Architecture**: Uses Baileys event system for message handling
- **Database Layer**: JSON-based file storage for user data, games, and settings
- **Serialization Layer**: Custom message serialization for consistent data handling

## Key Components

### 1. Connection Management (`lib/connection.js`)
- Handles WhatsApp Web connection establishment
- Implements reconnection logic with retry limits
- Manages authentication state and credentials
- Supports both QR code and phone number pairing

### 2. Message Handling (`handlers/message.js`)
- Processes incoming messages through serialization
- Implements auto-features (read, typing, recording)
- Handles anti-features (view-once bypass, anti-delete)
- Routes commands to appropriate handlers

### 3. Command System (`handlers/command.js`)
- Dynamic command loading from command modules
- Permission-based command execution
- Owner-only command restrictions
- Organized command categories

### 4. Database System (`lib/database.js`)
- JSON file-based storage system
- User profile management
- Game state persistence
- Settings configuration
- Economy system data

### 5. Serialization Layer (`lib/serialize.js`)
- Normalizes message structure across different message types
- Handles quoted message parsing
- Media detection and download functionality
- User identification and group handling

## Data Flow

1. **Message Reception**: Baileys receives WhatsApp message
2. **Serialization**: Message is processed through serialize function
3. **Handler Routing**: Message handler determines if it's a command
4. **Command Execution**: Appropriate command handler is called
5. **Response Generation**: Command generates response content
6. **Message Sending**: Response is sent through connection

## External Dependencies

### Required APIs
- **OpenAI API**: For AI chat functionality (GPT integration)
- **Google API**: For search and image search features
- **Various Media APIs**: Instagram, TikTok, Twitter, YouTube for media downloads
- **Weather APIs**: For weather information commands
- **Crypto APIs**: For cryptocurrency price tracking

### Media Processing
- **FFmpeg**: Required for audio/video processing (not implemented)
- **Sharp**: Required for image processing and sticker creation (not implemented)
- **Carbon API**: For code snippet visualization (not implemented)

## Deployment Strategy

### Environment Configuration
- Bot settings configurable via environment variables
- Session management through file-based storage
- Phone number pairing with 8-digit codes
- Custom session ID support for existing sessions

### File Structure
```
├── commands/           # Command modules by category
├── handlers/          # Message and command handlers
├── lib/              # Core libraries and utilities
├── utils/            # Helper functions and API integrations
├── data/             # JSON database files
├── session/          # WhatsApp session files
└── config.js         # Main configuration file
```

### Production Considerations
- Session persistence through multi-file auth state
- Error handling and reconnection logic
- Rate limiting and message retry mechanisms
- Database backup and recovery procedures

## Changelog

- June 29, 2025. Initial setup
- June 29, 2025. Added comprehensive AI integration with Gemini API
- June 29, 2025. Implemented 10 premium commands with user management system
- June 29, 2025. Added complete anti-features system (anti-link, anti-spam, anti-tag, anti-NSFW)
- June 29, 2025. Created WhatsApp Channel management commands
- June 29, 2025. Built image editor commands (wanted, drake, clown, alert, petgif, tweet, album)
- June 29, 2025. Integrated cryptocurrency tracking with real-time prices via CoinGecko API
- June 29, 2025. Added web scraping capabilities with content analysis
- June 29, 2025. Implemented public/private bot modes
- June 29, 2025. Enhanced menu system with all command categories

## New Features Added

### AI Integration
- **Gemini 2.0 Flash**: Full AI chat, image analysis, translation, summarization
- **Web Scraping**: Extract and analyze website content with AI summaries
- **Smart Chat**: Contextual conversations with memory
- **Multi-language Translation**: Support for multiple languages

### Premium System
- **User Management**: Owner can add/remove premium users
- **10 Premium Commands**: Advanced AI, bulk operations, group management, content creation
- **Access Control**: Premium features restricted to authorized users only

### Anti-Features
- **Anti-Link**: Configurable link detection with kick/warn/delete actions
- **Anti-Spam**: Detects spam messages and flood protection
- **Anti-Tag**: Prevents mass tagging (5+ mentions)
- **Anti-NSFW**: Content filtering and protection
- **Anti-Delete**: Save and reshare deleted messages

### Channel Management
- **Newsletter Integration**: Channel info and subscription management
- **Channel Operations**: Create, update, delete channel functionality
- **Notification Control**: Mute/unmute channel notifications
- **Follow System**: Easy channel follow/unfollow commands

### Media Editor
- **Meme Generators**: Wanted posters, Drake memes, clown effects
- **Social Media**: Tweet generator, album covers
- **Interactive**: Pet GIF, alert notifications
- **Branding**: Custom watermarks and styling

### Cryptocurrency
- **Real-time Prices**: Live crypto prices via CoinGecko API
- **Market Data**: Top cryptocurrencies, market cap, 24h changes
- **Converter**: Convert between different cryptocurrencies
- **Market Index**: Global crypto market statistics
- **News**: Cryptocurrency news and updates

### Enhanced Architecture
- **Modular Commands**: 17 command categories with 200+ commands
- **Bot Modes**: Public/private mode switching
- **Advanced Error Handling**: Comprehensive error management
- **Database Integration**: Enhanced user, group, and premium management
- **Performance Optimization**: Efficient command loading and execution

## User Preferences

Preferred communication style: Simple, everyday language.
Bot Features: AI-powered, premium system, anti-features, crypto integration, web scraping.