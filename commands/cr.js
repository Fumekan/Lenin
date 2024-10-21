const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cr')
        .setDescription('Zobrazí mapy černých rytířů na serveru.')
        .addIntegerOption(option => 
            option.setName('server')
                .setDescription('Číslo serveru (3-7).')
                .setRequired(true)),
    async execute(interaction) {
        const server = interaction.options.getInteger('server');

        if (server < 3 || server > 7) {
            return interaction.reply({ content: 'Zadejte platné číslo serveru (3-7).', ephemeral: true });
        }

        const dataUrl = `https://www.panhradu.cz/units_serialize.aspx?id_server=${server}`;
        const artifactIds = [49, 50, 51, 52, 53, 54, 55, 56];
        const artifactNames = [
            'Plášť temnoty', 'Helma nazgůla', 'Ohnivý meč', 'Černá zbroj',
            'Amulet života', 'Štít smrtihlav', 'Černá kuš', 'Černé holenice'
        ];

        try {
            const response = await axios.get(dataUrl);
            const dataExport = response.data.split('\n');

            const artifactUnits = dataExport.filter(row => {
                const [x, y, , artifact] = row.split('>');
                const artifactId = parseInt(artifact);
                return artifactIds.includes(artifactId);
            });

            const artifactUnitLocations = artifactUnits.map(row => {
                const [x, y, , artifact] = row.split('>');
                const artifactId = parseInt(artifact);
                const artifactName = artifactNames[artifactId - 49];
                return `[${x},${y}] - ${artifactName}`;
            });

            if (artifactUnitLocations.length > 0) {
                await interaction.reply(`Nalezeno: \n${artifactUnitLocations.join('\n')}`);
            } else {
                await interaction.reply('Nebyly nalezeny žádné jednotky s hledanými artefakty.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Došlo k chybě při zpracování dat.');
        }
    },
};
