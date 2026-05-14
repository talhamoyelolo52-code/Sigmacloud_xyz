const Database = require('../../utils/database');
const Embeds = require('../../utils/embeds');
const config = require('../../../config');

module.exports = {
    name: 'removecredits',
    description: 'Remove credits from a user (Owner only)',
    ownerOnly: true,
    usage: '.removecredits @user <amount>',
    
    async execute(message, args, client) {
        if (!config.ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [Embeds.error('Access Denied', 'This command is for bot owners only!')]
            });
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({
                embeds: [Embeds.error('No User', `Usage: \`${config.prefix}removecredits @user <amount>\``)]
            });
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [Embeds.error('Invalid Amount', 'Please enter a positive number!')]
            });
        }

        const currentBalance = await Database.getCredits(target.id);
        const newBalance = Math.max(0, currentBalance - amount);
        
        // Force set the balance
        const creditsData = await Database.read('credits');
        creditsData[target.id] = newBalance;
        await Database.write('credits', creditsData);

        const embed = new EmbedBuilder()
            .setTitle(`${config.emojis.success} Credits Removed`)
            .setDescription([
                `${config.emojis.credit} **Removed:** \`${amount}\` Credits`,
                `${config.emojis.money} **New Balance:** \`${newBalance}\``,
                '',
                `${config.emojis.arrow} **User:** ${target.toString()}`
            ].join('\n'))
            .setColor(config.colors.warning)
            .setTimestamp()
            .setFooter({ text: `By: ${message.author.tag}` });

        await message.reply({ embeds: [embed] });
    }
};
