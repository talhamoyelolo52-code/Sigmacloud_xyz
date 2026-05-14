const config = require('../../config');

module.exports = {
    name: 'messageCreate',
    
    async execute(message, client) {
        // Ignore bots and DMs
        if (message.author.bot || !message.guild) return;

        // Check prefix
        const prefix = config.prefix;
        if (!message.content.startsWith(prefix)) return;

        // Parse command
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Find command
        const command = client.commands.get(commandName) 
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        // Execute command
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error);
            message.reply('❌ An error occurred while executing this command!');
        }
    }
};
