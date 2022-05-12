const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop current track")
    .addStringOption((option) =>
      option
        .setName("set")
        .setDescription("Set loop ON/OFF")
        .setRequired(true)
        .addChoices(
          {
            name: "Current Track",
            value: "track",
          },
          {
            name: "Current Queue",
            value: "queue",
          },
          {
            name: "Off",
            value: "off",
          }
        )
    ),

  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue || queue.songs.length === 0) {
        return await interaction.reply("There is no song playing right now");
      }

      resultStr = "";
      switch (interaction.options.getString("set")) {
        case "track":
          queue.setRepeatMode(1);
          resultStr = "CURRENT TRACK";
          break;
        case "queue":
          queue.setRepeatMode(2);
          resultStr = "CURRENT QUEUE";
          break;
        case "off":
          queue.setRepeatMode(0);
          resultStr = "OFF";
          break;
        default:
          queue.setRepeatMode(QUEUE);
          return await interaction.reply(
            "Oops! Can't process your command, developer fix it!"
          );
          break;
      }

      return await interaction.reply(
        `🔁 Loop mode is set to: **${resultStr}**.`
      );
    } catch (err) {
      console.log(err);
      return await interaction.reply({
        content: `❌ | Something wrong trying to execute this command, developer fix it!`,
        ephemeral: true,
      });
    }
  },
};
