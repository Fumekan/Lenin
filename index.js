const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { generateDependencyReport } = require('@discordjs/voice');
const dotenv = require('dotenv');
const path = require('path');

// Načtení environment variables
dotenv.config();

console.log(generateDependencyReport());

// Inicializace klienta s požadovanými intenty
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

// Kolekce pro příkazy
client.commands = new Collection();

// Načtení všech souborů s příkazy
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Event když je bot připraven
client.once('ready', () => {
    console.log('Bot je připojen a běží!');
});

// Logování všech zpráv
client.on('messageCreate', message => {
    // Pokud je to zpráva od bota, ignorujeme ji
    if (message.author.bot) return;

    const logMessage = `[${new Date().toISOString()}] ${message.guild?.name || 'DM'}|${message.channel?.name || 'DM'}|${message.author.tag}: ${message.content}`;
    console.log(logMessage);

    // Uložení logů do souboru (volitelné)
    const logFilePath = path.join(__dirname, 'message_logs.txt');
    fs.appendFile(logFilePath, `${logMessage}\n`, err => {
        if (err) console.error('Chyba při zapisování do souboru logů:', err);
    });
});

// Event pro zpracování slash příkazů
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Při provádění tohoto příkazu došlo k chybě.', ephemeral: true });
    }
});

// Přihlášení bota s tokenem
client.login(process.env.DISCORD_TOKEN);
