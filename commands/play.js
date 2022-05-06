const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const log = console.log;

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play single song or playlist")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Your song URL or name")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      //* get user voice state
      const userChannel = interaction.member.voice;
      const botChannel = interaction.guild.me.voice;

      if (!userChannel.channelId) {
        return await interaction.reply({
          content: "You are not in a voice channel 🥺",
          ephemeral: true,
        });
      } else if (botChannel.channelId !== userChannel.channelId) {
        //* if there are people still in the voice channel with the bot
        if (botChannel.channel?.members.size > 1)
          return await interaction.reply({
            content: "I am at another voice channel with someone else, sorry",
            ephemeral: true,
          });
      }

      //* ----------------------------- start playing music -------------------------------
      const {
        checkQueryYoutube,
      } = require("../utilities/functions/checkQueryYoutube");
      const musicQuery = interaction.options.get("query").value;

      await interaction.deferReply();

      //* check if input query is a youtube mix playlist
      const queryResult = await checkQueryYoutube(client, musicQuery);
      const queue = client.distube.getQueue(interaction);
      if (queryResult && queryResult.resultType === "mixPlaylist") {
        const mixPlaylist = queryResult.value;
        //* set for "addList" event indication boolean "this playlist added is a mix playlist" to the sw distube queue
        interaction.guild.distubeYoutubeMix = {
          isMixYT: true,
          length: mixPlaylist.items.length,
        };

        //* if there are no queue or no songs in queue (we want to add playlist/song)
        if (!queue || queue.songs.length === 0) {
          //* play first music from the query results
          await client.distube.play(userChannel.channel, mixPlaylist.items[0], {
            textChannel: interaction.channel,
            member: interaction.member,
          });

          interaction.followUp({
            embeds: [
              new MessageEmbed().setDescription(
                `🎶 Playing your music **${mixPlaylist.items[0].title}** 🎵 🎼`
              ),
            ],
          });
        } else {
          await interaction.followUp({
            embeds: [
              new MessageEmbed().setDescription(
                `🎶 Adding your tracks.. 🎵 🎼`
              ),
            ],
          });
          interaction.deleteReply();
        }

        distubeAddPlaylist(mixPlaylist, interaction, client, userChannel);
      } else if (queryResult && queryResult.resultType === "other") {
        const resultMusic = queryResult.value;

        //* if there are no queue or no songs in queue (we want to add playlist/song)
        if (!queue || queue.songs.length === 0) {
          await client.distube.play(userChannel.channel, resultMusic, {
            textChannel: interaction.channel,
            member: interaction.member,
          });
          await interaction.followUp({
            embeds: [
              new MessageEmbed().setDescription(
                `🎶 Playing your music **${
                  client.distube.getQueue(interaction).songs[0].name
                }** 🎵🎼`
              ),
            ],
          });
        } else {
          await client.distube.play(userChannel.channel, resultMusic, {
            textChannel: interaction.channel,
            member: interaction.member,
          });
          await interaction.followUp({
            embeds: [
              new MessageEmbed().setDescription(
                `🎶 Adding your track to the queue.. 🎵 🎼`
              ),
            ],
          });

          interaction.deleteReply();
        }
      } else {
        return await interaction.followUp({
          content: `❌ | Track **${musicQuery}** not found!`,
          ephemeral: true,
        });
      }
    } catch (err) {
      console.log(err);
      return await interaction.followUp({
        content: `❌ | Track **${musicQuery}** not found!`,
        ephemeral: true,
      });
    }
  },
};

async function distubeAddPlaylist(
  mixPlaylist,
  interaction,
  client,
  voiceChannel
) {
  //* remove first song from the mixPlaylist, since it's already played first by distube queue
  mixPlaylist.items.shift();
  const arraySongsUrl = mixPlaylist.items.map((e) => e.url);

  //* add remaining mix playlist tracks distube queue
  const message = await interaction.channel.send({
    embeds: [
      new MessageEmbed().setDescription("🎶 Adding tracks to queue.. 🎵 🎼"),
    ],
  });
  client.distube
    .createCustomPlaylist(arraySongsUrl)
    .then(async (customPlaylist) => {
      //* set for "addList" event indication boolean "this playlist added is a mix playlist" to the sw distube queue
      client.distube.queues.get(interaction).isMixYT = true;
      await client.distube.play(voiceChannel.channel, customPlaylist, {
        textChannel: interaction.channel,
        member: interaction.member,
      });
      await message.delete();
    });
}
