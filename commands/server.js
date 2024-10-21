const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Zobrazí informace o serveru.'),
    async execute(interaction) {
        await interaction.reply(`Server: ${interaction.guild.name}\nUživatelé: ${interaction.guild.memberCount}`);
    },
};
