const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop player and clear tracks queue"),

  async execute(interaction, client) {
    try {
      //* get user voice state
      const userChannel = interaction.member.voice;
      const botChannel = interaction.guild.me.voice;

      //* check user in same channel as bot
      if (!userChannel.channelId) {
        return await interaction.reply({
          content: `<@${interaction.member.id}> You are not in a voice channel 🥺, please join a Voice Channel to use music commands`,
          ephemeral: true,
        });
      } else if (botChannel.channelId !== userChannel.channelId) {
        //* if there are people still in the voice channel with the bot
        if (botChannel.channel?.members.size > 1)
          return await interaction.reply({
            content: `I am in voice channel <#${interaction.guild.me.voice.channelId}>, please join my voice channel to use music commands`,
            ephemeral: true,
          });
      }

      const queue = client.distube.getQueue(interaction);
      if (!queue || queue.songs.length === 0) {
        return await interaction.reply(
          "The queue is empty and the bot is not currently playing anything"
        );
      } else {
        queue.stop();
        return interaction.reply(
          `The bot has been stopped by <@${interaction.member.id}>\nTrack queue has been cleared`
        );
      }
    } catch (err) {
      console.log(err);
      return await interaction.reply({
        content: `❌ | Something wrong trying to execute this command, developer fix it!`,
        ephemeral: true,
      });
    }
  },
};
