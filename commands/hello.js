const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies you accordingly"),

  async execute(interaction) {
    await interaction.reply("Gay");
  },
};
