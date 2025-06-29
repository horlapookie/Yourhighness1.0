const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const config = require("../config");

const commands = {
    vv: async (conn, msg, args) => {
        try {
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderName = msg.pushName || senderJid.split("@")[0];
            const now = new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });

            let targetMsg = null;
            const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;

            if (ctxInfo?.quotedMessage) {
                targetMsg = {
                    key: {
                        remoteJid: msg.key.remoteJid,
                        id: ctxInfo.stanzaId,
                        fromMe: false,
                        participant: ctxInfo.participant || senderJid,
                    },
                    message: ctxInfo.quotedMessage,
                };
            } else {
                return msg.reply("❌ Please reply to a view once message to bypass it.");
            }

            if (!targetMsg?.message) {
                return msg.reply("❌ No valid message found to process.");
            }

            let rawMsg = targetMsg.message;

            if (rawMsg.viewOnceMessageV2 || rawMsg.viewOnceMessage || rawMsg.viewOnceMessageV2Extension) {
                rawMsg =
                    rawMsg.viewOnceMessageV2?.message ||
                    rawMsg.viewOnceMessage?.message ||
                    rawMsg.viewOnceMessageV2Extension?.message ||
                    rawMsg;
            } else {
                return msg.reply("❌ This message is not a view-once message.");
            }

            const mediaTypeKey = Object.keys(rawMsg).find(k =>
                ["imageMessage", "videoMessage"].includes(k)
            );

            if (!mediaTypeKey) {
                return msg.reply("❌ No supported view-once media found.");
            }

            const mediaContent = rawMsg[mediaTypeKey];
            if (!mediaContent.viewOnce) {
                return msg.reply("❌ This media is not marked as view-once.");
            }

            await msg.react("⏳");

            const buffer = await downloadMediaMessage(
                { key: targetMsg.key, message: rawMsg },
                "buffer",
                {},
                { logger: console }
            );

            if (!buffer || buffer.length === 0) {
                return msg.reply("❌ Failed to download the media. It might be expired.");
            }

            const sendType = mediaTypeKey.replace("Message", "").toLowerCase();

            await conn.sendMessage(msg.key.remoteJid, {
                [sendType]: buffer,
                caption: `🔓 View-once ${sendType} bypassed by @${senderJid.split("@")[0]}.\n🕒 ${now}`,
                mentions: [senderJid],
                ...(sendType === "video" ? { gifPlayback: false } : {})
            }, { quoted: msg });

            await msg.react("✅");

        } catch (err) {
            console.error(err);
            await msg.react("❌");
            return msg.reply(`❌ Failed to bypass view-once: ${err.message}`);
        }
    }
};

module.exports = { commands };