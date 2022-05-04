const { SlashCommandBuilder } = require("@discordjs/builders");
const { connectToVC } = require("../utilities/functions/connectVC");

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
    const ytmpl = require("yt-mix-playlist");

    const musicQuery = interaction.options.get("query").value;

    await interaction.deferReply();

    let mixPlaylist = undefined;
    const regExp =
      "^(?:https?://)?(?:www.)?youtu.?be(?:.com)?.*?(?:v|list)=(.*?)(?:&|$)|^(?:https?://)?(?:www.)?youtu.?be(?:.com)?(?:(?!=).)*/(.*)$";
    var match = musicQuery.match(regExp);
    if (match && match[1]) {
      videoId = match[1];
      mixPlaylist = await ytmpl(videoId);
      console.log(mixPlaylist);
    }

    if (!mixPlaylist.items) {
      return await interaction.followUp({
        content: `❌ | Track **${musicQuery}** not found!`,
        ephemeral: true,
      });
    }

    const arraySongs = mixPlaylist.items.map((e) => e.url);
    const customPlaylist = await client.distube.createCustomPlaylist(
      arraySongs
    );
    // console.log(customPlaylist);

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

    // client.distube.play(userChannel.channel, searchResult, {
    //   textChannel: interaction.channel,
    //   member: interaction.member,
    // });

    client.distube.play(userChannel.channel, customPlaylist, {
      textChannel: interaction.channel,
      member: interaction.member,
    });

    // return await interaction.followUp({
    //   content: `🎶 Track ${searchResult.name} is playing 🎵🎼`,
    // });

    return await interaction.followUp({
      content: `🎶 Track is playing 🎵🎼`,
    });
  },
};
