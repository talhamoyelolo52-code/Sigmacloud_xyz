const { EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const Embeds = require('../utils/embeds');
const { createPanelButtons } = require('../buttons/panelButtons');
const config = require('../../config');

module.exports = {
    name: 'panel',
    description: 'Open the email service credit panel',
    aliases: ['shop', 'store', 'credits'],
    
    async execute(message, args, client) {
        const userCredits = await Database.getCredits(message.author.id);
        
        const embed = Embeds.creditPanel(userCredits);
        const buttons = createPanelButtons();
        
        const msg = await message.channel.send({
            embeds: [embed],
            components: [buttons]
        });

        // Button interaction collector
        const collector = msg.createMessageComponentCollector({
            filter: i => i.user.id === message.author.id,
            time: 120000 // 2 minutes
        });

        collector.on('collect', async interaction => {
            await interaction.deferUpdate();

            switch(interaction.customId) {
                case 'panel_100':
                    await showPackageInfo(interaction, 100, 2, msg);
                    break;
                    
                case 'panel_1000':
                    await showPackageInfo(interaction, 1000, 20, msg);
                    break;
                    
                case 'panel_info':
                    await showHowItWorks(interaction, msg);
                    break;
                    
                case 'panel_support':
                    await showSupport(interaction, msg);
                    break;
                    
                case 'back_to_panel':
                    await interaction.editReply({
                        embeds: [Embeds.creditPanel(await Database.getCredits(message.author.id))],
                        components: [createPanelButtons()]
                    });
                    break;
            }
        });

        collector.on('end', () => {
            msg.edit({ components: [] }).catch(() => {});
        });
    }
};

async function showPackageInfo(interaction, amount, price, msg) {
    const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.package} Package Details`)
        .setDescription([
            `${config.emojis.cloud} **Cloud Email Service** ${config.emojis.cloud}`,
            '',
            `${config.emojis.email} **Amount:** \`${amount}\` Emails`,
            `${config.emojis.credit} **Price:** \`${price}\` Credits`,
            `${config.emojis.money} **Per Email:** \`${(price/amount).toFixed(4)}\` Credits`,
            '',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '',
            `${config.emojis.arrow} **To Purchase:**`,
            `Use command: \`.sendemails @user ${amount}\``,
            '',
            `${config.emojis.cooldown} **Note:** 1 hour cooldown after 1000 emails`
        ].join('\n'))
        .setColor(config.colors.info)
        .setTimestamp()
        .setFooter({ text: '☁️ Cloud Email Service' });

    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('back_to_panel')
            .setLabel('Back to Panel')
            .setEmoji('◀️')
            .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({
        embeds: [embed],
        components: [backButton]
    });
}

async function showHowItWorks(interaction, msg) {
    const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.star} How It Works`)
        .setDescription([
            `${config.emojis.cloud} **Step-by-Step Guide** ${config.emojis.cloud}`,
            '',
            `**1.** ${config.emojis.credit} Get credits (Start with 20 free!)`,
            `**2.** ${config.emojis.email} Use \`.sendemails @user <amount>\``,
            `**3.** ${config.emojis.send} Bot sends emails via DM`,
            `**4.** ${config.emojis.success} Done! Check your inbox`,
            '',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '',
            `${config.emojis.warning} **Admin Commands:**`,
            `\`.addcredits @user <amount>\``,
            `\`.removecredits @user <amount>\``,
            '',
            `${config.emojis.cooldown} **Cooldown:** 1 hour after sending 1000+ emails`
        ].join('\n'))
        .setColor(config.colors.primary)
        .setTimestamp();

    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('back_to_panel')
            .setLabel('Back to Panel')
            .setEmoji('◀️')
            .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({
        embeds: [embed],
        components: [backButton]
    });
}

async function showSupport(interaction, msg) {
    const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Support`)
        .setDescription([
            `${config.emojis.cloud} **Need Help?** ${config.emojis.cloud}`,
            '',
            `${config.emojis.arrow} Contact server admins for credit purchases`,
            `${config.emojis.arrow} Report issues to bot owner`,
            '',
            `${config.emojis.email} **Common Issues:**`,
            '• DMs disabled → Enable DMs to receive emails',
            '• Insufficient credits → Purchase more from admin',
            '• Cooldown active → Wait 1 hour',
            '',
            `${config.emojis.star} **Bot Owner:** <@${config.ownerIds[0]}>`
        ].join('\n'))
        .setColor(config.colors.warning)
        .setTimestamp();

    const backButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('back_to_panel')
            .setLabel('Back to Panel')
            .setEmoji('◀️')
            .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({
        embeds: [embed],
        components: [backButton]
    });
}
