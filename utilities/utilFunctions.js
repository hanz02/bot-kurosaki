const { joinVoiceChannel } = require("@discordjs/voice");
const fs = require("fs");

module.exports = {
  getFiles: function (path, fileType) {
    return fs.readdirSync(path).filter(function (file) {
      file.endsWith(fileType);
    });
  },
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
