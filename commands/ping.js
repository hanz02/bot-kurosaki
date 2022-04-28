const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(interaction) {
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("pong")
        .setLabel("Pong")
        .setEmoji("😳")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("random")
        .setLabel("Just a button")
        .setEmoji("👌")
        .setStyle("SECONDARY"),
    ]);


    await interaction.reply({
      content: "Pong!",
      components: [row],
    });
  },
};
