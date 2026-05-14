const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../commands');
    
    // Load regular commands
    const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.name) {
            client.commands.set(command.name, command);
            console.log(`✅ Loaded command: ${command.name}`);
        }
    }

    // Load owner commands
    const ownerPath = path.join(commandsPath, 'owner');
    if (fs.existsSync(ownerPath)) {
        const ownerFiles = fs.readdirSync(ownerPath).filter(f => f.endsWith('.js'));
        for (const file of ownerFiles) {
            const command = require(path.join(ownerPath, file));
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(`✅ Loaded owner command: ${command.name}`);
            }
        }
    }
}

module.exports = { loadCommands };
