const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("filter")
    .setDescription(
      "Apply audio filters to your tracks or remove all audio filters"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Apply audio filters to your tracks")
        .addStringOption((option) =>
          option
            .setName("filters")
            .setDescription("Available filters to choose")
            .setRequired(true)

            .addChoices(
              {
                name: "earrape",
                value: "earrape",
              },
              {
                name: "vaporwave",
                value: "vaporwave",
              },
              {
                name: "nightcore",
                value: "nightcore",
              },
              {
                name: "8d",
                value: "8d",
              }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("Clear all audio filter to your tracks")
    ),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    if (!queue || queue.songs.length === 0) {
      return await interaction.reply(
        "Cannot apply or clear filters | There is no song playing in the empty queue right now"
      );
    }

    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case "set":
        filter = interaction.options.getString("filters");
        client.distube.setFilter(interaction, filter);
        return await interaction.followUp(
          `**${filter.toUpperCase()}** filter applied 😎`
        );

        break;
      case "clear":
        await client.distube.setFilter(interaction, false);
        return await interaction.followUp("Removed all filters 👌");
        break;

      default:
        await interaction.reply(
          "Oops! Can't process your command, make sure your command is valid?"
        );
    }
  },
};
