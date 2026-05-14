const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./src/handlers/commandHandler');
const { loadEvents } = require('./src/handlers/eventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel, Partials.Message]
});

client.commands = new Collection();
client.buttons = new Collection();
client.cooldowns = new Collection();

// Load handlers
loadCommands(client);
loadEvents(client);

// Login
client.login(config.token).catch(err => {
    console.error('❌ Failed to login:', err.message);
    process.exit(1);
});
