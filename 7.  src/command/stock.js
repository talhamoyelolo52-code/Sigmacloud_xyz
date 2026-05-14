const Database = require('../utils/database');
const Embeds = require('../utils/embeds');

module.exports = {
    name: 'stock',
    description: 'Show email stock for this channel',
    aliases: ['checkstock', 'inventory'],
    
    async execute(message, args, client) {
        const channelId = message.channel.id;
        const emails = await Database.getEmails(channelId);
        
        const embed = Embeds.stockAlert(message.channel.toString(), emails.length);
        
        // Add extra info
        embed.addFields({
            name: `${config.emojis.email} Last Updated`,
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
            inline: true
        });

        await message.reply({ embeds: [embed] });
    }
};
