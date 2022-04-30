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
      const responseCreator = await octokit.request("GET /users/{username}", {
        username: "hanz02",
      });

      const creator = responseCreator?.data;

      const responseRepo = await octokit.request("GET /repos/{owner}/{repo}", {
        owner: "hanz02",
        repo: "bot-kurosaki",
      });

      const repo = responseRepo?.data;

      if (creator && repo) {
        const embedMessage = new MessageEmbed()
          .setColor("#FD5D5D")
          .setTitle("Bot Kurosaki")
          .setURL(`${repo.html_url}`)
          .setAuthor({
            name: creator.name,
            iconURL: creator.avatar_url,
            url: creator.html_url,
          })
          .setDescription(
            `A pet-like bot that would follow its master around, from one voice channel to another. \n\nMore about the bot **[Click here](${repo.html_url})**`
          )
          .setThumbnail(client.user.displayAvatarURL())
          .addFields(
            { name: "\u200B", value: "\u200B" },
            {
              name: "About the developer & project",
              value:
                "First Discord bot 3 weeks personal project built with NodeJS programming.\n\nGitHub Repository to the bot is created, click the title to check it out. Feel free use it for your own bot building",
            }
          )
          .setImage(
            "https://i.pinimg.com/originals/0b/ba/97/0bba97ba7d060aa4c1fb2c0e2474c034.jpg"
          )
          .setTimestamp()
          .setFooter({
            text: "Kurosaki Bot",
            iconURL: creator.avatar_url,
          });

        await interaction.reply({
          embeds: [embedMessage],
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Something wrong happened fetching the creator and bot project info, contact developer to fix it",
        ephemeral: true,
      });
    }
  },
};
