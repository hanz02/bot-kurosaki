//* Require the necessary discord.js classes & env variable
const { Client } = require("discord.js");
const { Collection } = require("@discordjs/collection");
const fs = require("fs");
const { Player } = require("discord-player");
const { MessageEmbed } = require("discord.js");

require("dotenv").config();
const TOKEN = process.env.TOKEN;

//* Create a new client instance
const client = new Client({
  intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"],
});

const LOAD_SLASH = process.argv[2] === "load";

client.followState = true;

//* ---- Slash Command Handler (Deploy and load up) --------
//* if dev not deploying any new slash command, Load Up the bot normally

client.loadSlashcommads = function (client, LOAD_SLASH) {
  require("./handlers/slashCommands")(client, LOAD_SLASH);
};

client.loadSlashcommads(client, LOAD_SLASH);

if (!LOAD_SLASH) {
  //* ---- Event Handler -------- bring in all EVENT files object & load then (client.once/client.on)  ----------------------
  client.loadEvents = function (client) {
    require("./handlers/events.js")(client);
  };
  client.loadEvents(client);

  //* ---- Button Handler -------- bring in all BUTTON files and put into client.buttons Collection   ----------------------
  client.buttons = new Collection();

  //* get all button folder
  const ButtonFolders = fs.readdirSync("./buttons");
  for (const folder of ButtonFolders) {
    //*in each button folder, get all button js files
    const buttonFiles = fs
      .readdirSync(`./buttons/${folder}`)
      .filter((file) => file.endsWith(".js"));

    //* in each button js file, load them into client.buttons Collection
    for (const buttonFile of buttonFiles) {
      const button = require(`./buttons/${folder}/${buttonFile}`);
      client.buttons.set(button.data.name, button);
    }
  }

  const { DisTube } = require("distube");
  const { SpotifyPlugin } = require("@distube/spotify");
  const { SoundCloudPlugin } = require("@distube/soundcloud");
  const { YtDlpPlugin } = require("@distube/yt-dlp");

  //* ---------- Music Player ---------------
  client.player = new Player(client);

  client.distube = new DisTube(client, {
    youtubeDL: false,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()],
    leaveOnStop: false,
  });

  process.on("warning", (e) => console.warn(e.stack));

  client.distube.on("addList", (queue, playlist) => {
    //* check: if the list to be added is a youtube mix playlist
    const myDistubeYoutubeMix = queue.voiceChannel.guild.distubeYoutubeMix;
    queue.textChannel.send({
      embeds: [
        new MessageEmbed().setDescription(
          `🎶 Added ${
            myDistubeYoutubeMix && myDistubeYoutubeMix.isMixYT
              ? playlist.songs.length + 1
              : playlist.songs.length
          } songs to the queue 🎵 🎼`
        ),
      ],
    });

    //* server specific: delete isMixYT boolean is exists
    delete queue.voiceChannel.guild.distubeYoutubeMix;
  });

  client.distube.on("playSong", (queue, song) => {
    const myDistubeYoutubeMix = queue.voiceChannel.guild.distubeYoutubeMix;
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: "Now Playing",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            `**Requested by <@${song.member.id}>** \n\`\`\` ${song.name} \`\`\` \n**Track Source: [Click Me](${song.url})**`
          )
          .setImage(song.thumbnail)
          .setFooter({
            text: `Duration: ${song.formattedDuration} | Remaning Songs: ${
              myDistubeYoutubeMix && myDistubeYoutubeMix.isMixYT
                ? myDistubeYoutubeMix.length - 1
                : queue.songs.length - 1
            }`,
          }),
      ],
    });
  });

  client.distube.on("addSong", (queue, song) => {
    if (queue.songs.length === 1) return;
    queue.textChannel.send({
      embeds: [
        new MessageEmbed().setDescription(
          `🎶 Added your music **${song.name}** to the queue🎵 🎼`
        ),
      ],
    });
  });

  //~ Login to Discord with your client's token
  client.login(TOKEN);
}
