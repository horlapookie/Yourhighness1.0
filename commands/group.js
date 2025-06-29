const config = require('../config');
const { Simple } = require('../lib/simple');
const db = require('../lib/database');

const commands = {
    // Add members to group
    add: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide phone numbers to add.\n\nUsage: `+add 1234567890 0987654321`');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to add members.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can add members.');
            }

            const numbers = args.map(num => {
                const cleaned = num.replace(/[^0-9]/g, '');
                return cleaned + '@s.whatsapp.net';
            });

            const added = [];
            const failed = [];

            for (const number of numbers) {
                try {
                    await simple.groupAdd(msg.from, [number]);
                    added.push(number.split('@')[0]);
                } catch (error) {
                    failed.push(number.split('@')[0]);
                }
            }

            let response = `➕ *ADD MEMBERS* ➕\n\n`;
            
            if (added.length > 0) {
                response += `✅ **Successfully added:**\n`;
                added.forEach(num => response += `• +${num}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to add:**\n`;
                failed.forEach(num => response += `• +${num}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response);

        } catch (error) {
            console.error('Error in add command:', error);
            await msg.reply('❌ Failed to add members to the group.');
        }
    },

    // Kick members from group
    kick: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to kick members.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can kick members.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || mentioned.length === 0) {
                return msg.reply('❌ Please mention members to kick.\n\nUsage: `+kick @user1 @user2`');
            }

            const kicked = [];
            const failed = [];

            for (const userJid of mentioned) {
                try {
                    // Don't kick other admins
                    const isTargetAdmin = await simple.isAdmin(msg.from, userJid);
                    if (isTargetAdmin) {
                        failed.push(userJid.split('@')[0]);
                        continue;
                    }

                    await simple.groupRemove(msg.from, [userJid]);
                    kicked.push(userJid.split('@')[0]);
                } catch (error) {
                    failed.push(userJid.split('@')[0]);
                }
            }

            let response = `👢 *KICK MEMBERS* 👢\n\n`;
            
            if (kicked.length > 0) {
                response += `✅ **Successfully kicked:**\n`;
                kicked.forEach(user => response += `• ${user}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to kick:**\n`;
                failed.forEach(user => response += `• ${user}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response, { mentions: mentioned });

        } catch (error) {
            console.error('Error in kick command:', error);
            await msg.reply('❌ Failed to kick members from the group.');
        }
    },

    // Remove members by country code
    remove: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!args[0]) {
                return msg.reply('❌ Please provide a country code.\n\nUsage: `+remove 91` (removes all +91 numbers)');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to remove members.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can remove members.');
            }

            const countryCode = args[0];
            const metadata = await simple.groupMetadata(msg.from);
            
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            const membersToRemove = metadata.participants.filter(participant => 
                participant.id.startsWith(countryCode) && 
                participant.admin !== 'admin' && 
                participant.admin !== 'superadmin'
            );

            if (membersToRemove.length === 0) {
                return msg.reply(`❌ No members found with country code +${countryCode}.`);
            }

            const removed = [];
            const failed = [];

            for (const member of membersToRemove) {
                try {
                    await simple.groupRemove(msg.from, [member.id]);
                    removed.push(member.id.split('@')[0]);
                } catch (error) {
                    failed.push(member.id.split('@')[0]);
                }
            }

            let response = `🌍 *REMOVE BY COUNTRY CODE* 🌍\n\n`;
            response += `🔢 **Country Code:** +${countryCode}\n\n`;
            
            if (removed.length > 0) {
                response += `✅ **Successfully removed:**\n`;
                removed.forEach(num => response += `• +${num}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to remove:**\n`;
                failed.forEach(num => response += `• +${num}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response);

        } catch (error) {
            console.error('Error in remove command:', error);
            await msg.reply('❌ Failed to remove members by country code.');
        }
    },

    // Tag everyone
    everyone: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can tag everyone.');
            }

            const metadata = await simple.groupMetadata(msg.from);
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            const participants = metadata.participants.map(p => p.id);
            const message = args.join(' ') || 'Everyone has been tagged!';

            await conn.sendMessage(msg.from, {
                text: `📢 *TAG EVERYONE* 📢\n\n${message}\n\n${participants.map(p => `@${p.split('@')[0]}`).join(' ')}\n\n🔗 ${config.CHANNEL_URL}`,
                mentions: participants
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in everyone command:', error);
            await msg.reply('❌ Failed to tag everyone.');
        }
    },

    // Tag all (alias for everyone)
    tagall: async (conn, msg, args) => {
        await commands.everyone(conn, msg, args);
    },

    // Leave group
    leavegc: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ Only the bot owner can make me leave groups.');
            }

            await msg.reply(
                `👋 *LEAVING GROUP* 👋\n\n` +
                `Goodbye everyone! It was nice being here.\n\n` +
                `_If you want me back, contact the owner:_\n` +
                `📞 ${config.CREATOR_NUMBER}\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

            setTimeout(async () => {
                await conn.groupLeave(msg.from);
            }, 3000);

        } catch (error) {
            console.error('Error in leavegc command:', error);
            await msg.reply('❌ Failed to leave the group.');
        }
    },

    // Join group via link
    join: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ Only the bot owner can make me join groups.');
            }

            if (!args[0]) {
                return msg.reply('❌ Please provide a group invite link.\n\nUsage: `+join https://chat.whatsapp.com/...`');
            }

            const inviteLink = args[0];
            if (!inviteLink.includes('chat.whatsapp.com')) {
                return msg.reply('❌ Please provide a valid WhatsApp group invite link.');
            }

            try {
                const code = inviteLink.split('/').pop();
                await conn.groupAcceptInvite(code);
                
                await msg.reply(
                    `✅ *JOINED GROUP* ✅\n\n` +
                    `Successfully joined the group!\n\n` +
                    `🔗 ${config.CHANNEL_URL}`
                );

            } catch (error) {
                await msg.reply('❌ Failed to join the group. The invite link might be invalid or expired.');
            }

        } catch (error) {
            console.error('Error in join command:', error);
            await msg.reply('❌ Failed to process group join request.');
        }
    },

    // Get group invite link
    invite: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to get the group invite link.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can get the invite link.');
            }

            const inviteCode = await conn.groupInviteCode(msg.from);
            const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

            await msg.reply(
                `🔗 *GROUP INVITE LINK* 🔗\n\n` +
                `${inviteLink}\n\n` +
                `_Share this link to invite new members_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in invite command:', error);
            await msg.reply('❌ Failed to get group invite link.');
        }
    },

    // Get group name
    getname: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const metadata = await simple.groupMetadata(msg.from);
            
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            await msg.reply(
                `📝 *GROUP NAME* 📝\n\n` +
                `**Name:** ${metadata.subject}\n` +
                `**Created:** ${new Date(metadata.creation * 1000).toLocaleDateString()}\n` +
                `**Members:** ${metadata.participants.length}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in getname command:', error);
            await msg.reply('❌ Failed to get group name.');
        }
    },

    // Get group description
    getdeskgc: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const metadata = await simple.groupMetadata(msg.from);
            
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            const description = metadata.desc || 'No description set';

            await msg.reply(
                `📄 *GROUP DESCRIPTION* 📄\n\n` +
                `${description}\n\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in getdeskgc command:', error);
            await msg.reply('❌ Failed to get group description.');
        }
    },

    // Get group profile picture
    getppgc: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            
            try {
                const ppUrl = await simple.getProfilePictureUrl(msg.from, 'image');
                
                if (!ppUrl) {
                    return msg.reply('❌ This group doesn\'t have a profile picture.');
                }

                await conn.sendMessage(msg.from, {
                    image: { url: ppUrl },
                    caption: `📸 *GROUP PROFILE PICTURE* 📸\n\n🔗 ${config.CHANNEL_URL}`
                }, { quoted: msg });

            } catch (error) {
                await msg.reply('❌ This group doesn\'t have a profile picture or it\'s not accessible.');
            }

        } catch (error) {
            console.error('Error in getppgc command:', error);
            await msg.reply('❌ Failed to get group profile picture.');
        }
    },

    // Set group profile picture
    setppgc: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!msg.quoted || !msg.quoted.isImage) {
                return msg.reply('❌ Please reply to an image to set as group profile picture.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to change the group profile picture.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can change the group profile picture.');
            }

            await msg.react('⏳');
            
            const media = await msg.quoted.download();
            await simple.updateProfilePicture(msg.from, media);
            
            await msg.reply(
                `📸 *GROUP PROFILE UPDATED* 📸\n\n` +
                `✅ Group profile picture has been updated successfully!\n\n` +
                `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

            await msg.react('✅');

        } catch (error) {
            console.error('Error in setppgc command:', error);
            await msg.react('❌');
            await msg.reply('❌ Failed to set group profile picture.');
        }
    },

    // Save contact
    svcontact: async (conn, msg, args) => {
        try {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to save their contact.\n\nUsage: `+svcontact @user`');
            }

            const contactName = args.join(' ') || mentioned.split('@')[0];
            const contactNumber = mentioned.split('@')[0];

            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL;type=CELL;type=VOICE;waid=${contactNumber}:+${contactNumber}\nEND:VCARD`;

            await conn.sendMessage(msg.from, {
                contacts: {
                    displayName: contactName,
                    contacts: [{
                        vcard
                    }]
                }
            }, { quoted: msg });

            await msg.reply(
                `📱 *CONTACT SAVED* 📱\n\n` +
                `👤 Name: ${contactName}\n` +
                `📞 Number: +${contactNumber}\n\n` +
                `_Contact card sent!_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in svcontact command:', error);
            await msg.reply('❌ Failed to save contact.');
        }
    },

    // List online members
    listonline: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            // This feature requires presence tracking which is complex to implement
            await msg.reply(
                `🟢 *ONLINE MEMBERS* 🟢\n\n` +
                `⚠️ Online status tracking is currently unavailable.\n` +
                `This feature requires advanced presence monitoring.\n\n` +
                `_Most members are probably online anyway! 😄_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in listonline command:', error);
            await msg.reply('❌ Failed to list online members.');
        }
    },

    // Open group (allow all to send messages)
    opengroup: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to open the group.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can open the group.');
            }

            await simple.groupSettingUpdate(msg.from, 'not_announcement');
            
            await msg.reply(
                `🔓 *GROUP OPENED* 🔓\n\n` +
                `The group is now open for all members.\n` +
                `Everyone can send messages now.\n\n` +
                `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in opengroup command:', error);
            await msg.reply('❌ Failed to open the group.');
        }
    },

    // Close group (restrict to admins only)
    closegroup: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to close the group.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can close the group.');
            }

            await simple.groupSettingUpdate(msg.from, 'announcement');
            
            await msg.reply(
                `🔒 *GROUP CLOSED* 🔒\n\n` +
                `The group has been restricted to admins only.\n` +
                `Only admins can send messages now.\n\n` +
                `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in closegroup command:', error);
            await msg.reply('❌ Failed to close the group.');
        }
    },

    // Get group link (alias for invite)
    linkgc: async (conn, msg, args) => {
        await commands.invite(conn, msg, args);
    },

    // Reset group link
    resetlink: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to reset the group link.');
            }

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can reset the group link.');
            }

            await conn.groupRevokeInvite(msg.from);
            const newInviteCode = await conn.groupInviteCode(msg.from);
            const newInviteLink = `https://chat.whatsapp.com/${newInviteCode}`;

            await msg.reply(
                `🔄 *GROUP LINK RESET* 🔄\n\n` +
                `The old group link has been revoked.\n` +
                `**New Link:** ${newInviteLink}\n\n` +
                `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n` +
                `🔗 ${config.CHANNEL_URL}`
            );

        } catch (error) {
            console.error('Error in resetlink command:', error);
            await msg.reply('❌ Failed to reset group link.');
        }
    },

    // Create new group
    creategc: async (conn, msg, args) => {
        try {
            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ Only the bot owner can create groups.');
            }

            if (!args.length) {
                return msg.reply('❌ Please provide a group name.\n\nUsage: `+creategc My New Group`');
            }

            const groupName = args.join(' ');
            
            try {
                const group = await conn.groupCreate(groupName, [msg.sender]);
                
                await msg.reply(
                    `🎉 *GROUP CREATED* 🎉\n\n` +
                    `📝 **Name:** ${groupName}\n` +
                    `🆔 **ID:** ${group.id}\n\n` +
                    `✅ Group created successfully!\n` +
                    `🔗 ${config.CHANNEL_URL}`
                );

            } catch (error) {
                await msg.reply('❌ Failed to create group. Please try again later.');
            }

        } catch (error) {
            console.error('Error in creategc command:', error);
            await msg.reply('❌ Failed to create group.');
        }
    },

    // Hide tag (send message mentioning everyone invisibly)
    hidetag: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can use hidetag.');
            }

            const metadata = await simple.groupMetadata(msg.from);
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            const participants = metadata.participants.map(p => p.id);
            const message = args.join(' ') || 'Hidden tag message';

            await conn.sendMessage(msg.from, {
                text: message,
                mentions: participants
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in hidetag command:', error);
            await msg.reply('❌ Failed to send hidden tag message.');
        }
    },

    // Promote all members to admin
    promoteall: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ Only the bot owner can promote all members.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to promote members.');
            }

            const metadata = await simple.groupMetadata(msg.from);
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            const nonAdminMembers = metadata.participants.filter(p => 
                p.admin !== 'admin' && p.admin !== 'superadmin'
            );

            if (nonAdminMembers.length === 0) {
                return msg.reply('❌ All members are already admins.');
            }

            const promoted = [];
            const failed = [];

            for (const member of nonAdminMembers) {
                try {
                    await simple.groupPromote(msg.from, [member.id]);
                    promoted.push(member.id.split('@')[0]);
                } catch (error) {
                    failed.push(member.id.split('@')[0]);
                }
            }

            let response = `👑 *PROMOTE ALL* 👑\n\n`;
            
            if (promoted.length > 0) {
                response += `✅ **Promoted to Admin:**\n`;
                promoted.forEach(user => response += `• ${user}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to promote:**\n`;
                failed.forEach(user => response += `• ${user}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response);

        } catch (error) {
            console.error('Error in promoteall command:', error);
            await msg.reply('❌ Failed to promote all members.');
        }
    },

    // Demote all admins
    demoteall: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ Only the bot owner can demote all admins.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to demote members.');
            }

            const metadata = await simple.groupMetadata(msg.from);
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            const adminMembers = metadata.participants.filter(p => 
                (p.admin === 'admin' || p.admin === 'superadmin') && 
                p.id !== conn.user.id // Don't demote the bot itself
            );

            if (adminMembers.length === 0) {
                return msg.reply('❌ No admins found to demote.');
            }

            const demoted = [];
            const failed = [];

            for (const member of adminMembers) {
                try {
                    await simple.groupDemote(msg.from, [member.id]);
                    demoted.push(member.id.split('@')[0]);
                } catch (error) {
                    failed.push(member.id.split('@')[0]);
                }
            }

            let response = `👤 *DEMOTE ALL* 👤\n\n`;
            
            if (demoted.length > 0) {
                response += `✅ **Demoted:**\n`;
                demoted.forEach(user => response += `• ${user}\n`);
                response += '\n';
            }

            if (failed.length > 0) {
                response += `❌ **Failed to demote:**\n`;
                failed.forEach(user => response += `• ${user}\n`);
            }

            response += `_Action by ${msg.pushName || msg.sender.split('@')[0]}_\n`;
            response += `🔗 ${config.CHANNEL_URL}`;

            await msg.reply(response);

        } catch (error) {
            console.error('Error in demoteall command:', error);
            await msg.reply('❌ Failed to demote all admins.');
        }
    },

    // Kick all non-admin members
    kickall: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            if (!config.isOwner(msg.sender)) {
                return msg.reply('❌ Only the bot owner can kick all members.');
            }

            const simple = new Simple(conn);
            const isBotAdmin = await simple.isBotAdmin(msg.from);

            if (!isBotAdmin) {
                return msg.reply('❌ I need to be an admin to kick members.');
            }

            const metadata = await simple.groupMetadata(msg.from);
            if (!metadata) {
                return msg.reply('❌ Failed to get group information.');
            }

            const nonAdminMembers = metadata.participants.filter(p => 
                p.admin !== 'admin' && p.admin !== 'superadmin'
            );

            if (nonAdminMembers.length === 0) {
                return msg.reply('❌ No non-admin members found to kick.');
            }

            await msg.reply(
                `⚠️ *WARNING* ⚠️\n\n` +
                `This will kick ${nonAdminMembers.length} members!\n` +
                `Type \`${config.PREFIX}confirmkickall\` within 30 seconds to confirm.`
            );

        } catch (error) {
            console.error('Error in kickall command:', error);
            await msg.reply('❌ Failed to process kick all request.');
        }
    },

    // Warn user
    warn: async (conn, msg, args) => {
        try {
            if (!msg.isGroup) {
                return msg.reply('❌ This command can only be used in groups.');
            }

            const simple = new Simple(conn);
            const isUserAdmin = await simple.isAdmin(msg.from, msg.sender);

            if (!isUserAdmin && !config.isOwner(msg.sender)) {
                return msg.reply('❌ Only group admins can warn members.');
            }

            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mentioned) {
                return msg.reply('❌ Please mention a user to warn.\n\nUsage: `+warn @user reason`');
            }

            const reason = args.slice(1).join(' ') || 'No reason provided';
            const user = db.getUser(mentioned);
            
            user.warnings = (user.warnings || 0) + 1;
            db.updateUser(mentioned, user);

            const warnedName = mentioned.split('@')[0];
            const warnerName = msg.pushName || msg.sender.split('@')[0];

            await msg.reply(
                `⚠️ *USER WARNING* ⚠️\n\n` +
                `👤 **User:** ${warnedName}\n` +
                `📝 **Reason:** ${reason}\n` +
                `🔢 **Warnings:** ${user.warnings}/3\n` +
                `👮 **Warned by:** ${warnerName}\n\n` +
                `${user.warnings >= 3 ? '🚨 **User has reached maximum warnings!**' : ''}\n\n` +
                `🔗 ${config.CHANNEL_URL}`,
                { mentions: [mentioned] }
            );

            // Auto-kick after 3 warnings (if bot is admin)
            if (user.warnings >= 3) {
                const isBotAdmin = await simple.isBotAdmin(msg.from);
                if (isBotAdmin) {
                    setTimeout(async () => {
                        try {
                            await simple.groupRemove(msg.from, [mentioned]);
                            await msg.reply(`🚨 ${warnedName} has been automatically removed for reaching 3 warnings.`);
                        } catch (error) {
                            console.error('Auto-kick failed:', error);
                        }
                    }, 5000);
                }
            }

        } catch (error) {
            console.error('Error in warn command:', error);
            await msg.reply('❌ Failed to warn user.');
        }
    }
};

module.exports = { commands };
