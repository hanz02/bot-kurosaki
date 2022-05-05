const { SlashCommandBuilder } = require("@discordjs/builders");
const { connectToVC } = require("../utilities/functions/connectVC");

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
    //* the bot is free / no people in the channel with the bot
    // await connectToVC(userChannel, client);

    //* ------- start playing music ----------------
    const {
      checkQueryYoutube,
    } = require("../utilities/functions/checkQueryYoutube");
    const musicQuery = interaction.options.get("query").value;
    let playingMusic = "";

    await interaction.deferReply();

    const queryResult = await checkQueryYoutube(client, musicQuery);
    if (queryResult && queryResult.resultType === "mixPlaylist") {
      const mixPlaylist = queryResult.value;

      //* play first music from the query results
      await client.distube.play(userChannel.channel, mixPlaylist.items[0], {
        textChannel: interaction.channel,
        member: interaction.member,
      });

      //* remove first music from the query results
      //* create customPlaylist with remaining query result music and add customPlaylist to distube queue
      mixPlaylist.items.shift();
      const arraySongsUrl = mixPlaylist.items.map((e) => e.url);
      client.distube
        .createCustomPlaylist(arraySongsUrl)
        .then(async (customPlaylist) => {
          await client.distube.play(userChannel.channel, customPlaylist, {
            textChannel: interaction.channel,
            member: interaction.member,
          });
        });
    } else if (queryResult && queryResult.resultType === "other") {
      const resultMusic = queryResult.value;
      await client.distube.play(userChannel.channel, resultMusic, {
        textChannel: interaction.channel,
        member: interaction.member,
      });
    } else {
      return await interaction.followUp({
        content: `❌ | Track **${musicQuery}** not found!`,
        ephemeral: true,
      });
    }

    await interaction.followUp({
      content: `🎶 Playing your music.. 🎵🎼`,
    });
    await interaction.deleteReply();

    // const playlist = await ytpl(musicQuery, {
    //   limit: 10,
    // });

    // log(playlist);

    // const ytSearchResults = await ytsr(musicQuery, {
    //   limit: 25,
    // });
    // log(ytSearchResults);

    // const searchResult = await client.distube
    //   .search(arraySongs)
    //   .then((x) => {
    //     return x[0];
    //   })
    //   .catch(console.error);

    // console.log(searchResult);

    // if (!searchResult) {
    //   return await interaction.followUp({
    //     content: `❌ | Track **${musicQuery}** not found!`,
    //     ephemeral: true,
    //   });
    // }

    // await client.distube.play(userChannel.channel, customPlaylist, {
    //   textChannel: interaction.channel,
    //   member: interaction.member,
    // });

    // client.distube.getQueue(interaction).songs.push(arraySongs[1]);
    // console.log(client.distube.getQueue(interaction));

    // client.distube.play(userChannel.channel, customPlaylist, {
    //   textChannel: interaction.channel,
    //   member: interaction.member,
    // });

    // return await interaction.followUp({
    //   content: `🎶 Track ${searchResult.name} is playing 🎵🎼`,
    // });
  },
};
