const { connectToVC } = require("../utilities/connectVC");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave channel which the caller is in"),

  async execute(interaction, client) {
    const botMember = await interaction.guild.members.fetch(client.user.id);
    const userVC = interaction.member.voice;
    const botVC = botMember?.voice;

    //* bot already in the same VC as the member called "join"
    if (botVC.channel === userVC.channel) {
      await interaction.reply({
        content: `Leaving channel..`,
      });
      await interaction.deleteReply();

      connectToVC(botVC, client, "disconnect");
    } else {
      await interaction.reply({
        content: `<@${interaction.member.user.id}> You are not in the voice channel <#${botVC.channel.id}>, please switch or join the voice channel to use the voice command 😗`,
        ephemeral: true,
      });
    }
    return;
  },
};
