const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { progressBar } = require("./../utilities/ProgressBar");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show current playing track"),

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
        return interaction.reply("There is no track playing right now");
      } else {
        const song = queue.songs[0];
        const trackProgress = progressBar(queue.currentTime, song.duration, 35);

        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setAuthor({
                name: "Now Playing",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(
                `Requested by <@${song.member.id}> | Track Source: **[Click Me](${song.url})** \n\n\`\`\`🎧 CURRENT TRACK 🎶 \n\n[${song.name}] \`\`\`` +
                  `\n\`\`\`${
                    queue.playing ? "▶️ PLAYING" : "⏸️ PAUSED"
                  } | Duration: ${song.formattedDuration} | Remaning Songs: ${
                    queue.songs.length - 1
                  }\n\n${trackProgress} (${queue.formattedCurrentTime}/${
                    queue.formattedDuration
                  }) \`\`\` `
              ),
          ],
        });
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
