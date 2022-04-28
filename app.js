//* Require the necessary discord.js classes & env variable
const { Client, Intents, Message } = require("discord.js");
const { Collection } = require("@discordjs/collection");
const fs = require("fs");

require("dotenv").config();
const TOKEN = process.env.TOKEN;

//* Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_VOICE_STATES"] });

client.followState = true;

//* --- Slash Command Handler -------- set all COMMAND files object into (client.commands) collection --------------------
//* bring in all command files
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  //* Set a new item in the Collection
  //* With the key as the command name and the value as the exported module
  client.commands.set(command.slash_command.name, command);
}

//* ---- Event Handler -------- bring in all EVENT files object & load then (client.once/client.on)  ----------------------
//* bring in all event files
const Eventfiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

//* loop through event files
for (const file of Eventfiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

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

//~ Login to Discord with your client's token
client.login(TOKEN);
