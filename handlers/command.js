const fs = require('fs');
const path = require('path');
const config = require('../config');

// Load all command modules
const commands = new Map();

function loadCommands() {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        try {
            const commandModule = require(path.join(commandsDir, file));
            
            // Register commands from module
            if (commandModule.commands) {
                for (const [name, handler] of Object.entries(commandModule.commands)) {
                    commands.set(name.toLowerCase(), handler);
                }
            }
            
            console.log(`✅ Loaded commands from ${file}`);
        } catch (error) {
            console.error(`❌ Error loading ${file}:`, error);
        }
    }
    
    console.log(`📋 Total commands loaded: ${commands.size}`);
}

async function commandHandler(conn, msg) {
    try {
        const { body, sender, from, isGroup } = msg;
        
        // Parse command
        const args = body.slice(config.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // Check if command exists
        if (!commands.has(commandName)) {
            return; // Silently ignore unknown commands
        }
        
        // Get command handler
        const commandHandler = commands.get(commandName);
        
        // Check bot mode (private/public)
        const db = require('../lib/database');
        const botMode = db.getSetting('bot_mode', 'public');
        const isOwner = config.isOwner(sender);
        
        if (botMode === 'private' && !isOwner) {
            return msg.reply('🔒 Bot is currently in private mode. Only the owner can use commands.');
        }
        
        // Check if user is owner for owner-only commands
        const ownerCommands = config.COMMANDS.OWNER;
        
        if (ownerCommands.includes(commandName) && !isOwner) {
            return msg.reply('❌ This command is restricted to the bot owner only.');
        }
        
        // Log command usage
        console.log(`🎯 Command "${commandName}" used by ${msg.pushName || sender} in ${isGroup ? 'group' : 'private'}`);
        
        // Execute command
        await commandHandler(conn, msg, args);
        
    } catch (error) {
        console.error('❌ Error executing command:', error);
        
        try {
            await msg.reply('❌ An error occurred while executing the command. Please try again later.');
        } catch (replyError) {
            console.error('❌ Error sending error message:', replyError);
        }
    }
}

// Load commands on startup
loadCommands();

module.exports = commandHandler;
