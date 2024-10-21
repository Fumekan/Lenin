const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Zobrazí informace o aktuálním kanálu.'),
    async execute(interaction) {
        const channel = interaction.channel;
        const messageCount = (await channel.messages.fetch()).size;

        const channelInfo = `
Název: ${channel.name}
ID: ${channel.id}
Typ: ${channel.type}
Počet zpráv: ${messageCount}
Popis: ${channel.topic || 'Žádný popis'}
        `;

        await interaction.reply(channelInfo);
    },
};
