const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the tracks queue"),

  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue || queue.songs.length === 0) {
        return await interaction.reply("There is no song playing right now");
      }
      queue.shuffle();
      return await interaction.reply(`The queue has been shuffled.`);
    } catch (err) {
      console.log(err);
      return await interaction.reply({
        content: `❌ | Something wrong trying to execute this command, developer fix it!`,
        ephemeral: true,
      });
    }
  },
};
