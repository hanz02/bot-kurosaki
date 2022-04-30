const { SlashCommandBuilder } = require("@discordjs/builders");
const { connectToVC } = require("../utilities/connectVC");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("join")
    .setDescription(
      "Join voice channel regardless if the bot is following the user or not"
    ),

  async execute(interaction, client) {
    const botMember = await interaction.guild.members.fetch(client.user.id);
    const userVC = interaction.member.voice;
    const botVC = botMember?.voice;

    //* bot already in the same VC as the member called "join"
    if (botVC.channel === userVC.channel) {
      await interaction.reply({
        content: "I am already in the same voice channel as you 😘",
        ephemeral: true,
      });
    } else if (!userVC.channel) {
      //* if user who called is not in a voice channel
      await interaction.reply({
        content:
          "Are you in a voice channel? I can't join any channel you are in 🙁",
        ephemeral: true,
      });
    } else {
      connectToVC(userVC, client);
      await interaction.reply({
        content: "Joined voice channel 🏍️",
        ephemeral: true,
      });
    }
    return;
  },
};