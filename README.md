# yourhïghness - WhatsApp Multi-Device Bot

A comprehensive WhatsApp Multi-Device bot built with Baileys MD featuring 80+ commands, custom branding, and modular architecture.

## 🌟 Features

- **Multi-Device Support**: Works with WhatsApp Web Multi-Device API
- **80+ Commands**: Organized into categories (ViewOnce, Chess, Fun, Games, General, Media, Moderation, Utils, Weeb, Group, Owner)
- **Phone Number Pairing**: Pair with 8-digit codes (HORL-A912 format)
- **Custom Session Support**: Use existing session IDs
- **Modular Architecture**: Clean, organized, and easy to extend
- **Custom Branding**: Fully customizable bot identity
- **Database System**: User profiles, economy, games, and more
- **Anti Features**: View-once bypass, anti-delete, anti-call
- **Owner Commands**: Complete bot management system

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Commands](#commands)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [Support](#support)

## 🚀 Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/horlapookie/yourhighness-bot.git
   cd yourhighness-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

#### Essential Settings
```bash
OWNER_NUMBER=2349122222622    # Your phone number
PREFIX=/                      # Command prefix
PHONE_NUMBER=                 # For pairing new sessions
SESSION_ID=                   # For existing sessions
