const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zobrazí seznam dostupných příkazů.'),
    async execute(interaction) {
        const helpMessage = `
**Dostupné příkazy:**
/ping - Vrátí čas odezvy bota.
/say - Nechá bota zopakovat zadaný text.
/server - Zobrazí informace o serveru.
/notify - Pošle ti upozornění v zadaný čas.
/delete - Smaže zprávy starší než zadaný počet dní.
/clear - Vymaže určitý počet zpráv.
/channel - Zobrazí informace o aktuálním kanálu.
/cr - Zobrazí informace o černých rytířích s artefakty.
        `;

        await interaction.reply(helpMessage);
    },
};
