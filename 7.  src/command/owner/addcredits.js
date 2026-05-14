const Database = require('../../utils/database');
const Embeds = require('../../utils/embeds');
const config = require('../../../config');

module.exports = {
    name: 'addcredits',
    description: 'Add credits to a user (Owner only)',
    ownerOnly: true,
    usage: '.addcredits @user <amount>',
    
    async execute(message, args, client) {
        if (!config.ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [Embeds.error('Access Denied', 'This command is for bot owners only!')]
            });
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({
                embeds: [Embeds.error('No User', `Usage: \`${config.prefix}addcredits @user <amount>\``)]
            });
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [Embeds.error('Invalid Amount', 'Please enter a positive number!')]
            });
        }

        const newBalance = await Database.addCredits(target.id, amount);

        const embed = new EmbedBuilder()
            .setTitle(`${config.emojis.success} Credits Added`)
            .setDescription([
                `${config.emojis.credit} **Added:** \`${amount}\` Credits`,
                `${config.emojis.money} **New Balance:** \`${newBalance}\``,
                '',
                `${config.emojis.arrow} **User:** ${target.toString()}`
            ].join('\n'))
            .setColor(config.colors.success)
            .setTimestamp()
            .setFooter({ text: `By: ${message.author.tag}` });

        await message.reply({ embeds: [embed] });
    }
};
