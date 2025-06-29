const config = require('../config');
const db = require('../lib/database');

// Chess game state management
class ChessGame {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.board = this.initializeBoard();
        this.moves = [];
        this.status = 'active';
        this.createdAt = new Date();
    }

    initializeBoard() {
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    getBoardDisplay() {
        let display = '```\n♟️ CHESS BOARD ♟️\n\n';
        display += '  a b c d e f g h\n';
        
        for (let i = 0; i < 8; i++) {
            display += `${8 - i} `;
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                display += this.getPieceSymbol(piece) + ' ';
            }
            display += `${8 - i}\n`;
        }
        
        display += '  a b c d e f g h\n```';
        return display;
    }

    getPieceSymbol(piece) {
        const symbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
            '.': '·'
        };
        return symbols[piece] || piece;
    }
}

const commands = {
    // Challenge someone to chess
    'chess-challenge': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Chess challenges can only be made in groups.');
            }

            if (!args[0]) {
                return msg.reply('❌ Please mention someone to challenge.\n\nUsage: `+chess-challenge @user`');
            }

            const challengerId = msg.sender;
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return msg.reply('❌ Please mention a valid user to challenge.');
            }

            if (mentioned === challengerId) {
                return msg.reply('❌ You cannot challenge yourself to chess.');
            }

            // Check if there's already an active game
            const existingGame = db.getGame('chess', msg.from);
            if (existingGame) {
                return msg.reply('❌ There is already an active chess game in this group. Please finish it first.');
            }

            // Store challenge
            db.setGame('chess_challenge', msg.from, {
                challenger: challengerId,
                challenged: mentioned,
                challengeTime: new Date(),
                messageId: msg.id
            });

            const challengerName = msg.pushName || challengerId.split('@')[0];
            const challengedName = mentioned.split('@')[0];

            await msg.reply(
                `♟️ *CHESS CHALLENGE* ♟️\n\n` +
                `👤 ${challengerName} has challenged @${challengedName} to a game of chess!\n\n` +
                `⚡ Use \`${config.PREFIX}accept-ch\` to accept the challenge\n` +
                `❌ Use \`${config.PREFIX}reject-ch\` to reject the challenge\n\n` +
                `⏰ Challenge expires in 5 minutes\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [mentioned] }
            );

            // Auto-expire challenge after 5 minutes
            setTimeout(() => {
                const challenge = db.getGame('chess_challenge', msg.from);
                if (challenge && challenge.messageId === msg.id) {
                    db.deleteGame('chess_challenge', msg.from);
                }
            }, 5 * 60 * 1000);

        } catch (error) {
            console.error('Error in chess-challenge:', error);
            await msg.reply('❌ An error occurred while creating the chess challenge.');
        }
    },

    // Accept chess challenge
    'accept-ch': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Chess challenges can only be accepted in groups.');
            }

            const challenge = db.getGame('chess_challenge', msg.from);
            if (!challenge) {
                return msg.reply('❌ No active chess challenge found in this group.');
            }

            if (challenge.challenged !== msg.sender) {
                return msg.reply('❌ You are not the one being challenged.');
            }

            // Create new chess game
            const game = new ChessGame(challenge.challenger, challenge.challenged);
            db.setGame('chess', msg.from, game);
            db.deleteGame('chess_challenge', msg.from);

            const challengerName = challenge.challenger.split('@')[0];
            const challengedName = msg.pushName || msg.sender.split('@')[0];

            await msg.reply(
                `♟️ *CHESS GAME STARTED* ♟️\n\n` +
                `🎮 ${challengerName} vs ${challengedName}\n\n` +
                `${game.getBoardDisplay()}\n\n` +
                `⚡ Current turn: @${challengerName} (White)\n\n` +
                `📖 Use \`${config.PREFIX}move <from><to>\` to make a move\n` +
                `Example: \`${config.PREFIX}move e2e4\`\n\n` +
                `❌ Use \`${config.PREFIX}forfeit-chess\` to forfeit\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [challenge.challenger, challenge.challenged] }
            );

        } catch (error) {
            console.error('Error in accept-ch:', error);
            await msg.reply('❌ An error occurred while accepting the chess challenge.');
        }
    },

    // Reject chess challenge
    'reject-ch': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Chess challenges can only be rejected in groups.');
            }

            const challenge = db.getGame('chess_challenge', msg.from);
            if (!challenge) {
                return msg.reply('❌ No active chess challenge found in this group.');
            }

            if (challenge.challenged !== msg.sender) {
                return msg.reply('❌ You are not the one being challenged.');
            }

            db.deleteGame('chess_challenge', msg.from);

            const challengerName = challenge.challenger.split('@')[0];
            const challengedName = msg.pushName || msg.sender.split('@')[0];

            await msg.reply(
                `♟️ *CHESS CHALLENGE REJECTED* ♟️\n\n` +
                `❌ ${challengedName} has rejected ${challengerName}'s chess challenge.\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in reject-ch:', error);
            await msg.reply('❌ An error occurred while rejecting the chess challenge.');
        }
    },

    // Show chess board
    chess: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Chess games can only be played in groups.');
            }

            const game = db.getGame('chess', msg.from);
            if (!game) {
                return msg.reply('❌ No active chess game found in this group.\n\nUse `+chess-challenge @user` to start a game.');
            }

            const currentPlayerName = game.currentPlayer.split('@')[0];
            const player1Name = game.player1.split('@')[0];
            const player2Name = game.player2.split('@')[0];

            await msg.reply(
                `♟️ *CHESS GAME* ♟️\n\n` +
                `🎮 ${player1Name} vs ${player2Name}\n\n` +
                `${game.getBoardDisplay()}\n\n` +
                `⚡ Current turn: @${currentPlayerName}\n` +
                `🕐 Moves played: ${game.moves.length}\n\n` +
                `📖 Use \`${config.PREFIX}move <from><to>\` to make a move\n` +
                `❌ Use \`${config.PREFIX}forfeit-chess\` to forfeit\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [game.currentPlayer] }
            );

        } catch (error) {
            console.error('Error in chess:', error);
            await msg.reply('❌ An error occurred while displaying the chess board.');
        }
    },

    // Make a chess move
    move: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Chess games can only be played in groups.');
            }

            const game = db.getGame('chess', msg.from);
            if (!game) {
                return msg.reply('❌ No active chess game found in this group.');
            }

            if (game.currentPlayer !== msg.sender) {
                return msg.reply('❌ It\'s not your turn to move.');
            }

            if (!args[0] || args[0].length !== 4) {
                return msg.reply('❌ Invalid move format.\n\nUsage: `+move <from><to>`\nExample: `+move e2e4`');
            }

            const move = args[0].toLowerCase();
            const from = move.substring(0, 2);
            const to = move.substring(2, 4);

            // Basic move validation (simplified for demo)
            if (!/^[a-h][1-8]$/.test(from) || !/^[a-h][1-8]$/.test(to)) {
                return msg.reply('❌ Invalid chess notation. Use format like e2e4, d7d5, etc.');
            }

            // Add move to history
            game.moves.push({
                from,
                to,
                player: msg.sender,
                timestamp: new Date()
            });

            // Switch players
            game.currentPlayer = game.currentPlayer === game.player1 ? game.player2 : game.player1;

            // Update game
            db.setGame('chess', msg.from, game);

            const currentPlayerName = game.currentPlayer.split('@')[0];
            const movePlayerName = msg.pushName || msg.sender.split('@')[0];

            await msg.reply(
                `♟️ *CHESS MOVE* ♟️\n\n` +
                `✅ ${movePlayerName} moved: ${from.toUpperCase()} → ${to.toUpperCase()}\n\n` +
                `${game.getBoardDisplay()}\n\n` +
                `⚡ Next turn: @${currentPlayerName}\n` +
                `🕐 Move #${game.moves.length}\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [game.currentPlayer] }
            );

        } catch (error) {
            console.error('Error in move:', error);
            await msg.reply('❌ An error occurred while making the move.');
        }
    },

    // Forfeit chess game
    'forfeit-chess': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Chess games can only be forfeited in groups.');
            }

            const game = db.getGame('chess', msg.from);
            if (!game) {
                return msg.reply('❌ No active chess game found in this group.');
            }

            if (game.player1 !== msg.sender && game.player2 !== msg.sender) {
                return msg.reply('❌ You are not a player in the current chess game.');
            }

            const forfeitPlayerName = msg.pushName || msg.sender.split('@')[0];
            const winnerJid = game.player1 === msg.sender ? game.player2 : game.player1;
            const winnerName = winnerJid.split('@')[0];

            db.deleteGame('chess', msg.from);

            await msg.reply(
                `♟️ *CHESS GAME ENDED* ♟️\n\n` +
                `❌ ${forfeitPlayerName} has forfeited the game!\n` +
                `🏆 Winner: @${winnerName}\n` +
                `🕐 Game duration: ${game.moves.length} moves\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [winnerJid] }
            );

            // Update user stats
            const winner = db.getUser(winnerJid);
            const loser = db.getUser(msg.sender);
            
            winner.xp += 50;
            winner.coins += 100;
            loser.xp += 10;
            
            db.updateUser(winnerJid, winner);
            db.updateUser(msg.sender, loser);

        } catch (error) {
            console.error('Error in forfeit-chess:', error);
            await msg.reply('❌ An error occurred while forfeiting the chess game.');
        }
    }
};

module.exports = { commands };
