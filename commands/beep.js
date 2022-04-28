const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("beep")
    .setDescription("Replies with Boop!"),

  async execute(interaction) {
    await interaction.reply("Boop!");
  },
};
