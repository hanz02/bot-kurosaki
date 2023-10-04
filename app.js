//* Require the necessary discord.js classes & env variable
const { Client, GatewayIntentBits } = require("discord.js");
const { Collection } = require("@discordjs/collection");
const fs = require("fs");

require("dotenv").config();
const TOKEN = process.env.TOKEN;

//* Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
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
      console.log(`Button: ${buttonFile} has been loaded`);
    }
  }

  //~ Login to Discord with your client's token
  client.login(TOKEN);
}
