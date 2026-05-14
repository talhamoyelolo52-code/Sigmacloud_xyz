const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

const em = config.emojis;

function createPanelButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('panel_100')
            .setLabel('100 Emails (2 Credits)')
            .setEmoji('📧')
            .setStyle(ButtonStyle.Primary),
        
        new ButtonBuilder()
            .setCustomId('panel_1000')
            .setLabel('1000 Emails (20 Credits)')
            .setEmoji('📦')
            .setStyle(ButtonStyle.Success),
        
        new ButtonBuilder()
            .setCustomId('panel_info')
            .setLabel('How It Works')
            .setEmoji('ℹ️')
            .setStyle(ButtonStyle.Secondary),
        
        new ButtonBuilder()
            .setCustomId('panel_support')
            .setLabel('Support')
            .setEmoji('🎧')
            .setStyle(ButtonStyle.Danger)
    );
}

function createConfirmButtons(amount) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`confirm_${amount}`)
            .setLabel(`Confirm ${amount} Emails`)
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success),
        
        new ButtonBuilder()
            .setCustomId('cancel_send')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger)
    );
}

module.exports = {
    createPanelButtons,
    createConfirmButtons
};
