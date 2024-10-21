const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Pošle ti upozornění v zadaný čas.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Čas ve formátu HH:MM.')
                .setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getString('time');
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(time)) {
            await interaction.reply({ content: 'Neplatný formát času. Použij HH:MM.', ephemeral: true });
            return;
        }

        const [hours, minutes] = time.split(':');
        const now = moment().tz('Europe/Prague');
        let notifyTime = moment().tz('Europe/Prague').set({ hour: hours, minute: minutes, second: 0 });

        if (notifyTime.isBefore(now)) {
            notifyTime.add(1, 'days');
        }

        const timeDifference = notifyTime.diff(now);

        setTimeout(() => {
            interaction.user.send(`Připomenutí: Je ${time}.`);
        }, timeDifference);

        await interaction.reply({ content: `Upozornění nastaveno na ${time}.`, ephemeral: true });
    },
};
