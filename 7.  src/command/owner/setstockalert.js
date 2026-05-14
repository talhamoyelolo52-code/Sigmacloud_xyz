const Database = require('../../utils/database');
const Embeds = require('../../utils/embeds');
const config = require('../../../config');

module.exports = {
    name: 'setstockalert',
    description: 'Set stock alert channel (Owner only)',
    ownerOnly: true,
    usage: '.setstockalert #channel',
    
    async execute(message, args, client) {
        if (!config.ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [Embeds.error('Access Denied', 'This command is for bot owners only!')]
            });
        }

        const channel = message.mentions.channels.first() || message.channel;
        
        await Database.setRestockChannel(message.guild.id, channel.id);

        const embed = new EmbedBuilder()
            .setTitle(`${config.emojis.success} Alert Channel Set`)
            .setDescription([
                `${config.emojis.stock} **Stock alerts will be sent to:** ${channel.toString()}`,
                '',
                `${config.emojis.arrow} Alerts trigger on new restocks`
            ].join('\n'))
            .setColor(config.colors.success)
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
