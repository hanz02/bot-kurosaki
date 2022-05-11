const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the player"),

  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue || queue.songs.length === 0) {
        return await interaction.reply("There is no song playing right now");
      }

      if (queue.playing === false) {
        return await interaction.reply("There player is already paused");
      }

      queue.pause();
      return await interaction.reply(
        `The player has been paused by \`${interaction.member.displayName}\``
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
