const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Octokit } = require("@octokit/core");
require("dotenv").config();

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("creator")
    .setDescription("Introduce creator of the bot"),

  async execute(interaction, client) {
    try {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });
      const response = await octokit.request("GET /users/{username}", {
        username: "hanz02",
      });

      const creator = response?.data;

      if (creator) {
        const embedMessage = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Bot Kurosaki Dev")
          .setURL(creator.html_url)
          .setAuthor({
            name: creator.name,
            iconURL: creator.avatar_url,
            url: creator.html_url,
          })
          .setDescription("He built the bot, that's it")
          .setThumbnail(creator.avatar_url);

        await interaction.reply({
          embeds: [embedMessage],
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Something wrong happened fetching the cretor info, contact developer to fix it",
        ephemeral: true,
      });
    }
  },
};
