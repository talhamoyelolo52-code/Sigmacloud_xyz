const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

const em = config.emojis;

class Embeds {
    static base() {
        return new EmbedBuilder()
            .setTimestamp()
            .setFooter({ 
                text: '☁️ Cloud Email Service', 
                iconURL: 'https://cdn.discordapp.com/emojis/☁️.png' 
            });
    }

    static panel() {
        return this.base()
            .setTitle(`${em.cloud} **Cloud Email Service** ${em.cloud}`)
            .setDescription([
                `${em.star} **Welcome to the Ultimate Email Service!** ${em.star}`,
                '',
                `${em.credit} **Purchase Credits & Send Emails Instantly**`,
                `${em.email} **High Quality | Fast Delivery | Secure**`,
                '',
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                '',
                `${em.package} **Pricing Plans:**`,
                '',
                `${em.arrow} **100 Emails** → **2 Credits** ${em.money}`,
                `${em.arrow} **1000 Emails** → **20 Credits** ${em.money}`,
                '',
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                '',
                `${em.cooldown} **Cooldown:** 1 Hour after 1000 emails`,
                `${em.stock} **Stock:** Real-time updates`,
                '',
                '**Click a button below to get started!** 👇'
            ].join('\n'))
            .setColor(config.colors.primary)
            .setThumbnail('https://cdn.discordapp.com/attachments/placeholder/cloud.png')
            .setImage('https://cdn.discordapp.com/attachments/placeholder/banner.png');
    }

    static restockSuccess(filename, totalLines, added, channelStock) {
        return this.base()
            .setTitle(`${em.success} Restock Successful`)
            .setDescription([
                `${em.inbox} **File Processed Successfully**`,
                '',
                `${em.package} **File:** \`${filename}\``,
                `${em.email} **Total Lines:** \`${totalLines}\``,
                `${em.success} **New Added:** \`${added}\``,
                `${em.stock} **Channel Stock:** \`${channelStock}\``,
            ].join('\n'))
            .setColor(config.colors.success);
    }

    static stockAlert(channel, total) {
        return this.base()
            .setTitle(`${em.stock} Stock Alert`)
            .setDescription([
                `${em.email} **Channel:** ${channel}`,
                `${em.package} **Total Emails:** \`${total}\``,
                '',
                total === 0 
                    ? `${em.warning} **Status:** Out of Stock` 
                    : `${em.success} **Status:** Ready for Delivery`
            ].join('\n'))
            .setColor(total === 0 ? config.colors.error : config.colors.info);
    }

    static creditPanel(userCredits) {
        return this.base()
            .setTitle(`${em.credit} Credit Panel`)
            .setDescription([
                `${em.cloud} **Cloud Email Service - Credit Center** ${em.cloud}`,
                '',
                `${em.money} **Your Balance:** \`${userCredits}\` Credits`,
                '',
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                '',
                `${em.package} **Pricing:**`,
                `${em.arrow} 100 Emails → 2 Credits`,
                `${em.arrow} 1000 Emails → 20 Credits`,
                '',
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                '',
                `${em.cooldown} **Cooldown:** 1 hour after 1000 emails`,
                '',
                `${em.warning} **Contact Admin to purchase more credits**`
            ].join('\n'))
            .setColor(config.colors.gold);
    }

    static sendSuccess(amount, creditsUsed, remaining, stockLeft, hasCooldown) {
        const embed = this.base()
            .setTitle(`${em.send} Emails Delivered`)
            .setDescription([
                `${em.success} **Successfully Sent:** \`${amount}\` Emails`,
                '',
                `${em.credit} **Credits Used:** \`${creditsUsed}\``,
                `${em.money} **Remaining:** \`${remaining}\` Credits`,
                `${em.stock} **Stock Left:** \`${stockLeft}\``,
            ].join('\n'))
            .setColor(config.colors.success);

        if (hasCooldown) {
            embed.addFields({
                name: `${em.cooldown} Cooldown Active`,
                value: '⏳ You have 1 hour cooldown for 1000+ emails'
            });
        }

        return embed;
    }

    static error(title, description) {
        return this.base()
            .setTitle(`${em.error} ${title}`)
            .setDescription(description)
            .setColor(config.colors.error);
    }

    static warning(title, description) {
        return this.base()
            .setTitle(`${em.warning} ${title}`)
            .setDescription(description)
            .setColor(config.colors.warning);
    }

    static ownerPanel() {
        return this.base()
            .setTitle(`${em.star} Owner Control Panel`)
            .setDescription([
                `${em.cloud} **Administration Commands** ${em.cloud}`,
                '',
                `${em.arrow} \`.addcredits @user <amount>\``,
                `${em.arrow} \`.removecredits @user <amount>\``,
                `${em.arrow} \`.setstockalert #channel\``,
                `${em.arrow} \`.allstock\``,
                '',
                `${em.warning} **Owner Only Access**`
            ].join('\n'))
            .setColor(config.colors.dark);
    }
}

module.exports = Embeds;
