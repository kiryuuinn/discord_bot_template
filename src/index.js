require("dotenv").config();

const { Client, Events, GatewayIntentBits, ActivityType, Collection } = require("discord.js");
const { Console } = require("node:console");
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, ]
    });

    client.commands = new Collection();

    const fs = require("node:fs");
    const path = require("node:path");

    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`Command in ${filePath} is missing "data" or "execute".`)
        }
    }

client.on("ready", () => {
    console.log(`${client.user.username} on! ღゝ◡╹)ノ♡`);

    client.user.setActivity({
        name: "NewJeans (뉴진스) 'Super Shy'",
        type: ActivityType.Listening
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
        console.error("Command not found.")
        return
    }
    try {
        await command.execute(interaction)
    } 
    catch (error) {
        console.error(error)
        await interaction.reply("There was an error executing this command.")
    }
});

client.login(process.env.TOKEN);