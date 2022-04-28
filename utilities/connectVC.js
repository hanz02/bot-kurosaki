const { joinVoiceChannel } = require("@discordjs/voice");
module.exports = {
  connectToVC: function (newChannel, client, connection = "connect") {
    //~ if bot is following user
    if (connection === "disconnect") {
      //~ bot follows and switch/join to vc
      joinVoiceChannel({
        channelId: newChannel.channelId,
        guildId: newChannel.guild.id,
        adapterCreator: newChannel.guild.voiceAdapterCreator,
      }).destroy();
    } else {
      //~ bot follows and switch/join to vc
      joinVoiceChannel({
        channelId: newChannel.channelId,
        guildId: newChannel.guild.id,
        adapterCreator: newChannel.guild.voiceAdapterCreator,
      });
    }
  },
};
