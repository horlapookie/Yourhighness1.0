const config = require('../config');
const db = require('../lib/database');

const commands = {
    // Akinator game
    akinator: async (conn, msg, args) => {
        try {
            await msg.reply(
                `🧞 *AKINATOR* 🧞\n\n` +
                `Think of a character (real or fictional) and I'll try to guess it!\n\n` +
                `⚠️ Akinator integration is currently under development.\n` +
                `This feature requires external API integration.\n\n` +
                `_Coming soon in yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );
        } catch (error) {
            console.error('Error in akinator command:', error);
            await msg.reply('❌ Failed to start Akinator game.');
        }
    },

    // Answer quiz question
    answer: async (conn, msg, args) => {
        try {
            const quiz = db.getGame('quiz', msg.from);
            if (!quiz) {
                return msg.reply('❌ No active quiz found. Use `+start-quiz` to begin a quiz.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide your answer.\n\nUsage: `+answer <option>` (e.g., +answer A)');
            }

            const userAnswer = args[0].toUpperCase();
            const correctAnswer = quiz.currentQuestion.correct;

            if (userAnswer === correctAnswer) {
                quiz.score += 10;
                quiz.correct++;
                await msg.react('✅');
                await msg.reply(
                    `✅ *CORRECT!* ✅\n\n` +
                    `🎯 Score: +10 points\n` +
                    `📊 Total Score: ${quiz.score}\n` +
                    `✨ Correct Answers: ${quiz.correct}/${quiz.questionNumber}\n\n` +
                    `⏳ Next question in 3 seconds...`
                );
                
                setTimeout(async () => {
                    if (quiz.questionNumber >= 10) {
                        await commands['end-quiz'](conn, msg, []);
                    } else {
                        await commands['next-question'](conn, msg, []);
                    }
                }, 3000);
            } else {
                quiz.incorrect++;
                await msg.react('❌');
                await msg.reply(
                    `❌ *INCORRECT!* ❌\n\n` +
                    `✅ Correct Answer: ${correctAnswer}\n` +
                    `📊 Your Score: ${quiz.score}\n` +
                    `❌ Wrong Answers: ${quiz.incorrect}/${quiz.questionNumber}\n\n` +
                    `⏳ Next question in 3 seconds...`
                );
                
                setTimeout(async () => {
                    if (quiz.questionNumber >= 10) {
                        await commands['end-quiz'](conn, msg, []);
                    } else {
                        await commands['next-question'](conn, msg, []);
                    }
                }, 3000);
            }

            db.setGame('quiz', msg.from, quiz);

        } catch (error) {
            console.error('Error in answer command:', error);
            await msg.reply('❌ Failed to process your answer.');
        }
    },

    // Dots and boxes game
    'dots-and-boxes': async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Dots and Boxes can only be played in groups.');
            }

            const game = {
                board: Array(4).fill(null).map(() => Array(4).fill('·')),
                players: [msg.sender],
                currentPlayer: 0,
                scores: [0],
                lines: [],
                status: 'waiting'
            };

            db.setGame('dots-and-boxes', msg.from, game);

            await msg.reply(
                `⚫ *DOTS AND BOXES* ⚫\n\n` +
                `🎮 Game created by ${msg.pushName || msg.sender.split('@')[0]}\n\n` +
                `📋 Waiting for another player to join...\n` +
                `⚡ Use \`${config.PREFIX}join-dots\` to join the game\n\n` +
                `📖 How to play:\n` +
                `• Draw lines between dots\n` +
                `• Complete boxes to earn points\n` +
                `• Player with most boxes wins!\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in dots-and-boxes command:', error);
            await msg.reply('❌ Failed to start Dots and Boxes game.');
        }
    },

    // Dragon game (RPG style)
    dragon: async (conn, msg, args) => {
        try {
            const user = db.getUser(msg.sender);
            
            if (!user.dragon) {
                user.dragon = {
                    name: 'Baby Dragon',
                    level: 1,
                    hp: 100,
                    maxHp: 100,
                    attack: 10,
                    defense: 5,
                    exp: 0,
                    maxExp: 100,
                    lastFed: null,
                    lastTrained: null
                };
                db.updateUser(msg.sender, user);
            }

            const dragon = user.dragon;
            const hunger = dragon.lastFed ? 
                Math.floor((Date.now() - new Date(dragon.lastFed).getTime()) / (1000 * 60 * 60)) : 24;

            let status = '';
            if (hunger < 6) status = '😊 Happy';
            else if (hunger < 12) status = '😐 Content';
            else if (hunger < 18) status = '😞 Hungry';
            else status = '😵 Starving';

            await msg.reply(
                `🐉 *YOUR DRAGON* 🐉\n\n` +
                `🏷️ Name: ${dragon.name}\n` +
                `⭐ Level: ${dragon.level}\n` +
                `❤️ HP: ${dragon.hp}/${dragon.maxHp}\n` +
                `⚔️ Attack: ${dragon.attack}\n` +
                `🛡️ Defense: ${dragon.defense}\n` +
                `✨ EXP: ${dragon.exp}/${dragon.maxExp}\n` +
                `😊 Status: ${status}\n\n` +
                `📖 Commands:\n` +
                `• \`${config.PREFIX}feed-dragon\` - Feed your dragon\n` +
                `• \`${config.PREFIX}train-dragon\` - Train your dragon\n` +
                `• \`${config.PREFIX}dragon-battle\` - Battle other dragons\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in dragon command:', error);
            await msg.reply('❌ Failed to display dragon information.');
        }
    },

    // Forfeit quiz
    'forfeit-quiz': async (conn, msg, args) => {
        try {
            const quiz = db.getGame('quiz', msg.from);
            if (!quiz) {
                return msg.reply('❌ No active quiz found to forfeit.');
            }

            if (quiz.player !== msg.sender) {
                return msg.reply('❌ You are not the quiz player.');
            }

            db.deleteGame('quiz', msg.from);
            
            await msg.reply(
                `❌ *QUIZ FORFEITED* ❌\n\n` +
                `🎮 Player: ${msg.pushName || msg.sender.split('@')[0]}\n` +
                `📊 Final Score: ${quiz.score} points\n` +
                `✅ Correct: ${quiz.correct}\n` +
                `❌ Incorrect: ${quiz.incorrect}\n` +
                `❓ Questions Answered: ${quiz.questionNumber - 1}/10\n\n` +
                `_Better luck next time! - yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in forfeit-quiz command:', error);
            await msg.reply('❌ Failed to forfeit quiz.');
        }
    },

    // Hangman game
    hangman: async (conn, msg, args) => {
        try {
            const words = [
                'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'WHATSAPP', 'TELEGRAM',
                'ANDROID', 'INTERNET', 'WEBSITE', 'DATABASE', 'ALGORITHM'
            ];
            
            const word = words[Math.floor(Math.random() * words.length)];
            const guessed = Array(word.length).fill('_');
            
            const game = {
                word,
                guessed,
                wrongGuesses: [],
                attempts: 6,
                player: msg.sender,
                status: 'active'
            };

            db.setGame('hangman', msg.from, game);

            await msg.reply(
                `🎯 *HANGMAN GAME* 🎯\n\n` +
                `🎮 Player: ${msg.pushName || msg.sender.split('@')[0]}\n\n` +
                `📝 Word: ${guessed.join(' ')}\n` +
                `❌ Wrong Guesses: ${game.wrongGuesses.join(', ') || 'None'}\n` +
                `💀 Attempts Left: ${game.attempts}\n\n` +
                `📖 Use \`${config.PREFIX}guess <letter>\` to guess a letter\n` +
                `📖 Use \`${config.PREFIX}solve <word>\` to solve the word\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in hangman command:', error);
            await msg.reply('❌ Failed to start hangman game.');
        }
    },

    // Start quiz
    'start-quiz': async (conn, msg, args) => {
        try {
            const existingQuiz = db.getGame('quiz', msg.from);
            if (existingQuiz) {
                return msg.reply('❌ A quiz is already active in this chat. Finish it first or use `+forfeit-quiz`.');
            }

            const quizQuestions = [
                {
                    question: "What is the capital of France?",
                    options: { A: "London", B: "Berlin", C: "Paris", D: "Madrid" },
                    correct: "C"
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: { A: "Venus", B: "Mars", C: "Jupiter", D: "Saturn" },
                    correct: "B"
                },
                {
                    question: "What is 2 + 2?",
                    options: { A: "3", B: "4", C: "5", D: "6" },
                    correct: "B"
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: { A: "Van Gogh", B: "Picasso", C: "Da Vinci", D: "Michelangelo" },
                    correct: "C"
                },
                {
                    question: "What is the largest ocean on Earth?",
                    options: { A: "Atlantic", B: "Indian", C: "Arctic", D: "Pacific" },
                    correct: "D"
                }
            ];

            const quiz = {
                questions: quizQuestions,
                currentQuestionIndex: 0,
                questionNumber: 1,
                score: 0,
                correct: 0,
                incorrect: 0,
                player: msg.sender,
                startTime: new Date()
            };

            quiz.currentQuestion = quiz.questions[0];
            db.setGame('quiz', msg.from, quiz);

            const q = quiz.currentQuestion;
            await msg.reply(
                `🧠 *QUIZ STARTED* 🧠\n\n` +
                `🎮 Player: ${msg.pushName || msg.sender.split('@')[0]}\n` +
                `❓ Question ${quiz.questionNumber}/10\n\n` +
                `📝 ${q.question}\n\n` +
                `A) ${q.options.A}\n` +
                `B) ${q.options.B}\n` +
                `C) ${q.options.C}\n` +
                `D) ${q.options.D}\n\n` +
                `⚡ Use \`${config.PREFIX}answer <option>\` to answer\n` +
                `❌ Use \`${config.PREFIX}forfeit-quiz\` to quit\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in start-quiz command:', error);
            await msg.reply('❌ Failed to start quiz.');
        }
    },

    // Tic Tac Toe
    tictactoe: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ Tic Tac Toe can only be played in groups.');
            }

            const existingGame = db.getGame('tictactoe', msg.from);
            if (existingGame) {
                return msg.reply('❌ A Tic Tac Toe game is already active in this group.');
            }

            const game = {
                board: Array(9).fill(' '),
                players: [msg.sender],
                currentPlayer: 0,
                status: 'waiting',
                symbols: ['❌', '⭕'],
                createdAt: new Date()
            };

            db.setGame('tictactoe', msg.from, game);

            await msg.reply(
                `⭕ *TIC TAC TOE* ❌\n\n` +
                `🎮 Game created by ${msg.pushName || msg.sender.split('@')[0]}\n\n` +
                `📋 Waiting for another player to join...\n` +
                `⚡ Use \`${config.PREFIX}join-ttt\` to join the game\n\n` +
                `📖 How to play:\n` +
                `• Players take turns placing symbols\n` +
                `• Get 3 in a row to win!\n` +
                `• Use \`${config.PREFIX}place <position>\` (1-9)\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in tictactoe command:', error);
            await msg.reply('❌ Failed to start Tic Tac Toe game.');
        }
    },

    // Helper function for next quiz question
    'next-question': async (conn, msg, args) => {
        try {
            const quiz = db.getGame('quiz', msg.from);
            if (!quiz) return;

            quiz.currentQuestionIndex++;
            quiz.questionNumber++;
            
            if (quiz.currentQuestionIndex >= quiz.questions.length) {
                return commands['end-quiz'](conn, msg, []);
            }

            quiz.currentQuestion = quiz.questions[quiz.currentQuestionIndex];
            db.setGame('quiz', msg.from, quiz);

            const q = quiz.currentQuestion;
            await msg.reply(
                `🧠 *QUIZ CONTINUES* 🧠\n\n` +
                `📊 Score: ${quiz.score} points\n` +
                `❓ Question ${quiz.questionNumber}/10\n\n` +
                `📝 ${q.question}\n\n` +
                `A) ${q.options.A}\n` +
                `B) ${q.options.B}\n` +
                `C) ${q.options.C}\n` +
                `D) ${q.options.D}\n\n` +
                `⚡ Use \`${config.PREFIX}answer <option>\` to answer\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in next-question:', error);
        }
    },

    // Helper function to end quiz
    'end-quiz': async (conn, msg, args) => {
        try {
            const quiz = db.getGame('quiz', msg.from);
            if (!quiz) return;

            db.deleteGame('quiz', msg.from);
            
            let grade = '';
            const percentage = (quiz.correct / 10) * 100;
            if (percentage >= 90) grade = '🏆 Excellent!';
            else if (percentage >= 80) grade = '🥇 Great!';
            else if (percentage >= 70) grade = '🥈 Good!';
            else if (percentage >= 60) grade = '🥉 Average';
            else grade = '📚 Study More!';

            // Update user XP and coins
            const user = db.getUser(msg.sender);
            user.xp += quiz.score;
            user.coins += Math.floor(quiz.score / 2);
            db.updateUser(msg.sender, user);

            await msg.reply(
                `🎉 *QUIZ COMPLETED* 🎉\n\n` +
                `🎮 Player: ${msg.pushName || msg.sender.split('@')[0]}\n` +
                `📊 Final Score: ${quiz.score} points\n` +
                `✅ Correct: ${quiz.correct}/10\n` +
                `❌ Incorrect: ${quiz.incorrect}/10\n` +
                `📈 Accuracy: ${percentage}%\n` +
                `🏅 Grade: ${grade}\n\n` +
                `🎁 Rewards:\n` +
                `• +${quiz.score} XP\n` +
                `• +${Math.floor(quiz.score / 2)} coins\n\n` +
                `_Great job! - yourhïghness_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in end-quiz:', error);
        }
    }
};

module.exports = { commands };
