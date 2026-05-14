const Database = require('../utils/database');
const Embeds = require('../utils/embeds');

module.exports = {
    name: 'restock',
    description: 'Upload txt file with emails (one per line)',
    aliases: ['addstock', 'upload'],
    
    async execute(message, args, client) {
        // Check for attachments
        if (!message.attachments.size) {
            return message.reply({
                embeds: [Embeds.error('No File Attached', 
                    'Please attach a `.txt` file with one email per line.\nExample: Type `/restock` and upload a file')]
            });
        }

        const attachment = message.attachments.first();
        
        // Validate file type
        if (!attachment.name.endsWith('.txt')) {
            return message.reply({
                embeds: [Embeds.error('Invalid Format', 'Only `.txt` files are accepted!')]
            });
        }

        try {
            // Download file
            const response = await fetch(attachment.url);
            const text = await response.text();
            
            // Parse emails
            const lines = text.split('\n').map(line => line.trim()).filter(line => line);
            const allEmails = lines.filter(line => line.includes('@'));
            
            if (!allEmails.length) {
                return message.reply({
                    embeds: [Embeds.error('No Valid Emails', 'The file contains no valid email addresses!')]
                });
            }

            // Remove duplicates from file
            const uniqueEmails = [...new Set(allEmails)];
            const duplicates = allEmails.length - uniqueEmails.length;

            // Add to database
            const channelId = message.channel.id;
            const result = await Database.addEmails(channelId, uniqueEmails);

            // Send success embed
            const embed = Embeds.restockSuccess(
                attachment.name,
                lines.length,
                result.added,
                result.total
            );

            if (duplicates > 0) {
                embed.addFields({
                    name: `${Embeds.emojis?.warning || '⚠️'} Duplicates Removed`,
                    value: `\`${duplicates}\` duplicate emails were skipped`
                });
            }

            embed.addFields({
                name: '👤 Restocked By',
                value: message.author.toString(),
                inline: true
            });

            await message.reply({ embeds: [embed] });

            // Update stock alert if configured
            await updateStockAlert(message.guild, channelId, client);

        } catch (error) {
            console.error('Restock error:', error);
            return message.reply({
                embeds: [Embeds.error('Processing Error', `\`\`\`${error.message}\`\`\``)]
            });
        }
    }
};

async function updateStockAlert(guild, channelId, client) {
    const alertChannelId = await Database.getRestockChannel(guild.id);
    if (!alertChannelId) return;

    const alertChannel = guild.channels.cache.get(alertChannelId);
    if (!alertChannel) return;

    const emails = await Database.getEmails(channelId);
    const sourceChannel = guild.channels.cache.get(channelId);

    const embed = new EmbedBuilder()
        .setTitle('📦 Stock Updated')
        .setDescription([
            `${emojis.inbox} **New emails have been restocked!**`,
            '',
            `${emojis.email} **Channel:** ${sourceChannel || 'Unknown'}`,
            `${emojis.package} **Total Stock:** \`${emails.length}\` emails`,
            `${emojis.success} **Status:** Ready for delivery`
        ].join('\n'))
        .setColor(config.colors.success)
        .setTimestamp();

    await alertChannel.send({ embeds: [embed] });
                                         }
