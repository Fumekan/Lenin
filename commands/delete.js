const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Smaže zprávy starší než zadaný počet dní.')
        .addIntegerOption(option => 
            option.setName('days')
                .setDescription('Počet dní, starší než zprávy, které se mají smazat.')
                .setRequired(true)),
    async execute(interaction) {
        const days = interaction.options.getInteger('days');
        if (days <= 0) {
            return interaction.reply({ content: 'Zadej platný počet dní.', ephemeral: true });
        }

        const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
        const deleteThreshold = days * MILLISECONDS_IN_A_DAY;
        let totalDeleted = 0;
        let lastMessageID;
        let shouldContinue = true;

        while (shouldContinue) {
            const options = { limit: 100 };
            if (lastMessageID) {
                options.before = lastMessageID;
            }

            const messages = await interaction.channel.messages.fetch(options);
            if (messages.size === 0) {
                shouldContinue = false;
                break;
            }

            lastMessageID = messages.last().id;
            const oldMessages = messages.filter(msg => Date.now() - msg.createdTimestamp > deleteThreshold);

            await Promise.all(oldMessages.map(msg => msg.delete()));
            totalDeleted += oldMessages.size;
        }

        await interaction.reply(`Smazáno ${totalDeleted} zpráv starších než ${days} dní.`);
    },
};
