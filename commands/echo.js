const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies with your input!")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input to echo back")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.reply(
      `\`${interaction.user.username}\` said: "${
        interaction.options.get("input").value
      }"`
    );

    // await interaction.reply(`${interaction.member.displayName} said: "${interaction.options.get("input").value}"`);
  },
};
