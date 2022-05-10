const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the player"),

  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue || queue.songs.length === 0) {
        return interaction.reply("There is no song playing right now");
      }

      if (queue.playing === true) {
        return interaction.reply("There player is already playing music");
      }

      queue.resume();
      return await interaction.reply(
        `The player has been resumed by \`${interaction.member.displayName}\``
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
