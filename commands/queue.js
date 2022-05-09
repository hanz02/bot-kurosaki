const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { progressBar } = require("./../utilities/ProgressBar");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View tracks in queue"),

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
        return interaction.reply("The queue is empty");
      }

      const song = queue.songs[0];
      const trackProgress = progressBar(queue.currentTime, song.duration, 35);

      if (queue.songs.length === 1) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setAuthor({
                name: "Tracks Queue",
              })
              .setDescription(
                `Current Playing:\`\`\`🎶 ${song.name}\n${trackProgress} (${queue.formattedCurrentTime}/${queue.formattedDuration}) \`\`\``
              ),
          ],
        });
      } else {
        //* divide by 10 = we only want 10 tracks to be displayed per page
        const pageAmount = Math.ceil(queue.songs.length / 10);

        //* get first 10 tracks, excluding the first track in queue
        const queueDisplayTracks =
          queue.songs.length < 10
            ? queue.songs.slice(1, queue.songs.length)
            : queue.songs.slice(1, 11);

        const queueString = queueDisplayTracks
          .map((song, index) => {
            return (
              `${index + 1}. ${
                song.name.length > 50
                  ? song.name.slice(0, 50 - 3) + ".."
                  : song.name
              } [${song.formattedDuration}]\n` + `🎤 ${song.member.displayName}`
            );
          })
          .join("\n");

        const embedMessage = new MessageEmbed()
          .setAuthor({
            name: "Tracks Queue",
          })
          .setDescription(
            `Current Playing:\`\`\`🎶 ${song.name}\n${trackProgress} (${queue.formattedCurrentTime}/${song.formattedDuration}) \`\`\``
          )
          .addFields({
            name: "Tracks Queue: ",
            value: `\`\`\`${queueString}\`\`\``,
          })
          .setFooter({
            text: `Page: 1 / ${pageAmount}`,
          });

        const rowButtons =
          pageAmount === 1
            ? new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("queuePrevPage")
                  .setLabel("Previous")
                  .setStyle("PRIMARY")
                  .setDisabled(true),
                new MessageButton()
                  .setCustomId("queueNextPage")
                  .setLabel("Next")
                  .setStyle("PRIMARY")
                  .setDisabled(true)
              )
            : new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("queuePrevPage")
                  .setLabel("Previous")
                  .setStyle("PRIMARY")
                  .setDisabled(true),
                new MessageButton()
                  .setCustomId("queueNextPage")
                  .setLabel("Next")
                  .setStyle("PRIMARY")
              );

        await interaction.reply({
          embeds: [embedMessage],
          components: [rowButtons],
        });
        const message = await interaction.fetchReply();
        message.queueTracks = queue.songs;

        //* disable both buttons after queue displayed one minute
        setTimeout(() => {
          const buttonComponents = rowButtons.components.map((button) => {
            button.setDisabled(true);
            return button;
          });

          rowButtons.setComponents(buttonComponents);
          message.edit({
            components: [rowButtons],
          });

          delete message.queueTracks;
        }, 60000);
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
