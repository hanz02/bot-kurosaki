const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skip to specific track in the queue")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Your track number in queue")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue || queue.songs.length === 0) {
        return interaction.reply("The queue is empty");
      }

      const trackPos = interaction.options.get("position").value;
      if (!queue.songs[trackPos]) {
        return interaction.reply(
          "Can't find the track positioned in the queue"
        );
      }

      queue.jump(trackPos);
      await interaction.reply(
        `Skipped to track \`${queue.songs[trackPos].name}\` in the queue`
      );
      if (queue.playing === false) await queue.resume();
    } catch (err) {
      console.log(err);
      return await interaction.reply({
        content: `❌ | Something wrong trying to execute this command, developer fix it!`,
        ephemeral: true,
      });
    }
  },
};
