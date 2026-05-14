const Database = require('../../utils/database');
const Embeds = require('../../utils/embeds');
const config = require('../../../config');

module.exports = {
    name: 'allstock',
    description: 'View all channel stocks (Owner only)',
    ownerOnly: true,
    
    async execute(message, args, client) {
        if (!config.ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [Embeds.error('Access Denied', 'This command is for bot owners only!')]
            });
        }

        const emailsData = await Database.read('emails');
        const channels = Object.entries(emailsData);

        if (!channels.length) {
            return message.reply({
                embeds: [Embeds.warning('No Data', 'No stock data available.')]
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`${config.emojis.stock} All Channel Stocks`)
            .setDescription(`${config.emojis.cloud} **Global Inventory Overview**`)
            .setColor(config.colors.primary)
            .setTimestamp();

        let totalGlobal = 0;

        for (const [channelId, emails] of channels) {
            const channel = client.channels.cache.get(channelId);
            const name = channel ? `${channel.name} (${channelId})` : `Unknown (${channelId})`;
            const count = emails.length;
            totalGlobal += count;

            embed.addFields({
                name: `${config.emojis.email} ${name}`,
                value: `\`${count}\` emails`,
                inline: true
            });
        }

        embed.setFooter({ 
            text: `Total Global Stock: ${totalGlobal} emails | ${channels.length} channels` 
        });

        await message.reply({ embeds: [embed] });
    }
};
