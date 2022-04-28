const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;

//* create empty commands list (to put in json commands)
const commands = [];

//* bring in all command files
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.slash_command.toJSON());
}

//* create rest API object (REST: allow BOT --> perform action to user discord server)
const rest = new REST({ version: "9" }).setToken(TOKEN);

// rest.get(Routes.applicationCommands(CLIENT_ID)).then((data) => {
//   const promises = [];
//   for (const command of data) {
//     const deleteUrl = `${Routes.applicationCommands(CLIENT_ID)}/${command.id}`;
//     promises.push(rest.delete(deleteUrl));
//   }
//   return Promise.all(promises);
// });

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
