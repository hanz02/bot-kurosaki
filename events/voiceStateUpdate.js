const { connectToVC } = require("../utilities/utilFunctions");

module.exports = {
  name: "voiceStateUpdate",
  async execute(client, oldUserChannel, newUserChannel) {
    //* if a bot joined channel, we dont output his activity to text channel
    if (newUserChannel.member.user.bot) return;

    //* get the guild the bot is in
    const guild = oldUserChannel.guild;

    //* get text channel (for bot to display message --> "who joined what channel")
    const txtChannel = client.channels.cache.get("968008827767238688");

    //* is bot in the channel which user was in (true/false)
    const botMember = await guild.members.fetch(client.user.id);
    const currentBotVoiceChannel = botMember?.voice.channel;
    // console.log(currentBotVoiceChannel);

    //~ if user joined channel is followed by the bot
    const isFollowed = oldUserChannel.member.user.id === client.followedUser;

    //* ----------- if user was not in a channel & he joined a channel ----------------------
    if (oldUserChannel.channelId == null && newUserChannel.channelId != null) {
      await txtChannel.send(
        `\`${newUserChannel.member.displayName}\` just joined the voice channel <#${newUserChannel.channel.id}>`
      );

      //~ if there are 1 or more user still in channel the bot is in, dont join the followedUser
      if (currentBotVoiceChannel?.members.size > 1) return;
    } else if (
      oldUserChannel.channelId != null &&
      newUserChannel.channelId != null
    ) {
      //* if user was in a channel & he switched to another channel
      await txtChannel.send(
        `\`${newUserChannel.member.displayName}\` just switched to the voice channel <#${newUserChannel.channel.id}>`
      );

      //~ if there are user still in channel the bot is in, dont leave
      if (currentBotVoiceChannel?.members.size > 1) return;

      const followedUser = await guild.members.fetch(client.followedUser);
      // //* if last user swicthed to another one, join the channel the followedUser is in
      if (followedUser) {
        //* return voiceState object of followedUser
        const followedUserVC = followedUser.voice;
        if (followedUserVC) {
          //~ if bot is following user
          //~ bot follows and switch/join to vc
          connectToVC(followedUserVC, client, isFollowed);
          return;
        }
      }
    } else {
      //* if user was in a channel & he left the channel
      await txtChannel.send(
        `\`${newUserChannel.member.displayName}\` just left the voice channel <#${oldUserChannel.channel.id}>`
      );

      //~ if there are user still in channel the bot is in, dont leave. STAY!
      if (currentBotVoiceChannel?.members.size > 1) return;

      const followedUser = await guild.members.fetch(client.followedUser);
      // //* if last user swicthed to another one, join the channel the followedUser is in
      if (followedUser) {
        //* return voiceState object of followedUser
        const followedUserCurrentVC = followedUser.voice;
        if (followedUserCurrentVC) {
          //~ if bot is following user
          //~ bot follows and switch/join to vc
          connectToVC(followedUserCurrentVC, client);
          return;
        }
      } else {
        //~ no one is in the bot channel, and the followedUser is not in any channel, bot can just leave
        connectToVC(currentBotVoiceChannel, client, isFollowed, "disconnect");
      }
      return;
    }
    if (client.followState && isFollowed) {
      connectToVC(newUserChannel, client, isFollowed);
    }
  },
};
