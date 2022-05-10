const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the song player is currently playing"),

  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue || queue.songs.length === 0) {
        return interaction.reply("There is no song in the queue to skip");
      }

      const currentTrack = queue.songs[0].name;
      if (!queue.songs[1]) {
        await queue.stop();
        return interaction.reply(
          `Skipped track \`${currentTrack}\`. No playable track, the queue is empty`
        );
      }

      await queue.skip();
      if (queue.playing === false) await queue.resume();

      return await interaction.reply(
        `The track \`${currentTrack}\` is skipped by \`${interaction.member.displayName}\``
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
