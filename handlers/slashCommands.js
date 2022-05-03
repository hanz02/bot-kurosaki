const { Collection } = require("@discordjs/collection");
const fs = require("fs");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

module.exports = async function (client, load) {
  //* deploy slash commands to guild
  if (load) {
    try {
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
        const command = require(`./../commands/${file}`);
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

      await rest
        .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
          body: commands,
        })
        .then(() => {
          console.log("Successfully registered application commands.");
        })
        .catch((error) => {
          console.log(error);
          process.exit(1);
        });
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

    process.exit(0);
  }

  //* --- Slash Command Handler -------- set all COMMAND files object into (client.commands) collection --------------------
  //* bring in all command files
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./../commands/${file}`);
    //* Set a new item in the Collection
    //* With the key as the command name and the value as the exported module
    client.commands.set(command.slash_command.name, command);
  }
};
