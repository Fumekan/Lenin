const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Vrátí čas odezvy bota.'),
    async execute(interaction) {
        await interaction.reply(`Pong! Čas odezvy: ${Math.round(interaction.client.ws.ping)}ms`);
    },
};
