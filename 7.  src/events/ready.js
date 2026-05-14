const config = require('../../config');

module.exports = {
    name: 'ready',
    once: true,
    
    execute(client) {
        console.log(`🤖 Bot logged in as ${client.user.tag}`);
        console.log(`📊 Serving ${client.guilds.cache.size} guilds`);
        console.log(`👥 ${client.users.cache.size} users cached`);
        
        // Set presence
        client.user.setPresence({
            activities: [{ 
                name: `${config.prefix}panel | Cloud Email Service`,
                type: 0 // Playing
            }],
            status: 'online'
        });

        console.log('✅ Bot is ready!');
    }
};
