const { AttachmentBuilder } = require('discord.js');
const Database = require('../utils/database');
const Embeds = require('../utils/embeds');
const config = require('../../config');

module.exports = {
    name: 'sendemails',
    description: 'Send emails to a user (deducts credits)',
    aliases: ['send', 'delivery', 'mail'],
    usage: '.sendemails @user <amount>',
    
    async execute(message, args, client) {
        // Validate arguments
        if (args.length < 2) {
            return message.reply({
                embeds: [Embeds.error('Invalid Usage', 
                    `Usage: \`${config.prefix}sendemails @user <amount>\`\nExample: \`${config.prefix}sendemails @user 100\``)]
            });
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({
                embeds: [Embeds.error('No Target', 'Please mention a valid user!')]
            });
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [Embeds.error('Invalid Amount', 'Please enter a valid number!')]
            });
        }

        // Calculate required credits
        let requiredCredits;
        if (amount <= config.pricing.small.amount) {
            requiredCredits = config.pricing.small.price;
        } else if (amount <= config.pricing.large.amount) {
            requiredCredits = config.pricing.large.price;
        } else {
            // Calculate for custom amounts
            const thousands = Math.floor(amount / 1000);
            const remainder = amount % 1000;
            requiredCredits = (thousands * config.pricing.large.price);
            if (remainder > 0) {
                requiredCredits += remainder <= 100 
                    ? config.pricing.small.price 
                    : config.pricing.large.price;
            }
        }

        // Check cooldown
        const cooldownEnd = await Database.getCooldown(message.author.id);
        if (cooldownEnd) {
            const remaining = Math.ceil((cooldownEnd - new Date()) / 1000 / 60);
            return message.reply({
                embeds: [Embeds.warning('Cooldown Active', 
                    `⏰ You must wait \`${remaining} minutes\` before sending more emails.\n(Cooldown applies after sending ${config.cooldown.threshold}+ emails)`)]
            });
        }

        // Check credits
        const userCredits = await Database.getCredits(message.author.id);
        if (userCredits < requiredCredits) {
            return message.reply({
                embeds: [Embeds.error('Insufficient Credits', 
                    `You need \`${requiredCredits}\` credits to send \`${amount}\` emails.\nYour balance: \`${userCredits}\` credits\n\nUse \`${config.prefix}panel\` to view pricing.`)]
            });
        }

        // Check stock
        const channelId = message.channel.id;
        const stock = await Database.getEmails(channelId);
        if (stock.length < amount) {
            return message.reply({
                embeds: [Embeds.error('Insufficient Stock', 
                    `Channel only has \`${stock.length}\` emails available.\nYou requested \`${amount}\` emails.\n\nUse \`/restock\` to add more emails!`)]
            });
        }

        // Deduct credits
        const success = await Database.removeCredits(message.author.id, requiredCredits);
        if (!success) {
            return message.reply({
                embeds: [Embeds.error('Transaction Failed', 'Could not deduct credits. Please try again.')]
            });
        }

        // Get emails and remove from stock
        const emailsToSend = stock.slice(0, amount);
        await Database.removeEmails(channelId, amount);
        const remainingStock = await Database.getEmails(channelId);

        // Set cooldown if threshold reached
        let hasCooldown = false;
        if (amount >= config.cooldown.threshold) {
            await Database.setCooldown(message.author.id);
            hasCooldown = true;
        }

        // Create file
        const fileContent = emailsToSend.join('\n');
        const filename = `emails_${amount}_${Date.now()}.txt`;
        const attachment = new AttachmentBuilder(Buffer.from(fileContent), { name: filename });

        try {
            // Send DM to target
            const dmEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.email} Email Delivery`)
                .setDescription([
                    `${config.emojis.cloud} **You have received an email package!** ${config.emojis.cloud}`,
                    '',
                    `${config.emojis.email} **Amount:** \`${amount}\` Emails`,
                    `${config.emojis.send} **From:** ${message.author.toString()}`,
                    `${config.emojis.package} **File:** Attached below`,
                    '',
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                    '',
                    `${config.emojis.star} **Thank you for using Cloud Email Service!**`
                ].join('\n'))
                .setColor(config.colors.success)
                .setTimestamp()
                .setFooter({ text: '☁️ Cloud Email Service' });

            await target.send({ embeds: [dmEmbed], files: [attachment] });

            // Send confirmation in channel
            const newBalance = await Database.getCredits(message.author.id);
            const confirmEmbed = Embeds.sendSuccess(amount, requiredCredits, newBalance, remainingStock.length, hasCooldown);
            
            confirmEmbed.addFields({
                name: `${config.emojis.send} Delivered To`,
                value: target.toString(),
                inline: true
            });

            await message.reply({ embeds: [confirmEmbed] });

        } catch (error) {
            console.error('DM Error:', error);
            
            // Refund credits
            await Database.addCredits(message.author.id, requiredCredits);
            
            // Return emails to stock
            await Database.addEmails(channelId, emailsToSend);
            
            return message.reply({
                embeds: [Embeds.error('Delivery Failed', 
                    `Could not DM ${target.toString()}. They may have DMs disabled.\n\n${config.emojis.credit} **Credits refunded:** \`${requiredCredits}\``)]
            });
        }
    }
};
