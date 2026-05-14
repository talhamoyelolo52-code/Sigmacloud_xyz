const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

const files = {
    emails: path.join(DATA_DIR, 'emails.json'),
    credits: path.join(DATA_DIR, 'credits.json'),
    cooldowns: path.join(DATA_DIR, 'cooldowns.json'),
    restockChannels: path.join(DATA_DIR, 'restock_channels.json')
};

// Initialize files if they don't exist
Object.values(files).forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeJsonSync(file, {});
    }
});

class Database {
    static async read(file) {
        try {
            return await fs.readJson(files[file]);
        } catch {
            return {};
        }
    }

    static async write(file, data) {
        await fs.writeJson(files[file], data, { spaces: 2 });
    }

    // Emails
    static async getEmails(channelId) {
        const data = await this.read('emails');
        return data[channelId] || [];
    }

    static async addEmails(channelId, emails) {
        const data = await this.read('emails');
        if (!data[channelId]) data[channelId] = [];
        
        // Add new emails and remove duplicates
        const existing = new Set(data[channelId]);
        let added = 0;
        emails.forEach(email => {
            if (!existing.has(email)) {
                existing.add(email);
                added++;
            }
        });
        
        data[channelId] = Array.from(existing);
        await this.write('emails', data);
        return { total: data[channelId].length, added };
    }

    static async removeEmails(channelId, amount) {
        const data = await this.read('emails');
        if (!data[channelId]) return [];
        
        const removed = data[channelId].splice(0, amount);
        await this.write('emails', data);
        return removed;
    }

    // Credits
    static async getCredits(userId) {
        const data = await this.read('credits');
        // Give starting credits if new user
        if (data[userId] === undefined) {
            const config = require('../../config');
            data[userId] = config.startingCredits;
            await this.write('credits', data);
        }
        return data[userId];
    }

    static async addCredits(userId, amount) {
        const data = await this.read('credits');
        data[userId] = (data[userId] || 0) + amount;
        await this.write('credits', data);
        return data[userId];
    }

    static async removeCredits(userId, amount) {
        const data = await this.read('credits');
        const current = await this.getCredits(userId);
        if (current < amount) return false;
        data[userId] = current - amount;
        await this.write('credits', data);
        return true;
    }

    // Cooldowns
    static async getCooldown(userId) {
        const data = await this.read('cooldowns');
        if (!data[userId]) return null;
        
        const lastSend = new Date(data[userId]);
        const config = require('../../config');
        const cooldownEnd = new Date(lastSend.getTime() + config.cooldown.ms);
        
        if (cooldownEnd > new Date()) {
            return cooldownEnd;
        }
        return null;
    }

    static async setCooldown(userId) {
        const data = await this.read('cooldowns');
        data[userId] = new Date().toISOString();
        await this.write('cooldowns', data);
    }

    // Restock Channels
    static async setRestockChannel(guildId, channelId) {
        const data = await this.read('restockChannels');
        data[guildId] = channelId;
        await this.write('restockChannels', data);
    }

    static async getRestockChannel(guildId) {
        const data = await this.read('restockChannels');
        return data[guildId];
    }
}

module.exports = Database;
