require('dotenv').config();

module.exports = {
    token: process.env.BOT_TOKEN,
    ownerIds: process.env.OWNER_IDS.split(',').map(id => id.trim()),
    prefix: process.env.PREFIX || '.',
    startingCredits: parseInt(process.env.STARTING_CREDITS) || 20,
    pricing: {
        small: {
            amount: 100,
            price: parseInt(process.env.PRICE_100_EMAILS) || 2
        },
        large: {
            amount: 1000,
            price: parseInt(process.env.PRICE_1000_EMAILS) || 20
        }
    },
    cooldown: {
        ms: parseInt(process.env.COOLDOWN_MS) || 3600000,
        threshold: parseInt(process.env.COOLDOWN_THRESHOLD) || 1000
    },
    colors: {
        primary: 0x5865F2,      // Discord Blurple
        success: 0x57F287,      // Green
        error: 0xED4245,        // Red
        warning: 0xFEE75C,      // Yellow
        info: 0xEB459E,         // Pink
        dark: 0x23272A,         // Dark
        gold: 0xFAA61A          // Gold
    },
    emojis: {
        cloud: '☁️',
        email: '📧',
        credit: '💳',
        stock: '📦',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        cooldown: '⏰',
        money: '💰',
        arrow: '➤',
        star: '⭐',
        fire: '🔥',
        package: '📦',
        inbox: '📥',
        send: '📤'
    }
};
