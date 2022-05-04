const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
var https = require("https");
require("dotenv").config();

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("creator")
    .setDescription("Introduce creator of the bot"),

  async execute(interaction, client) {
    const userName = "hanz02";

    try {
      let config = {
        method: "get",
        url: "https://api.github.com/users/" + userName,
        headers: {
          "User-Agent": "kurosaki-bot",
        },
      };

      //* get creator github profile
      const creator = await axios(config)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log("Error fetching creator GitHub profile");
          return;
        });

      //* get creator github repos
      const creatorRepoCount = creator.public_repos;

      config.url = "https://api.github.com/repos/" + userName + "/bot-kurosaki";
      const botProjectRepo = await axios(config)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error.message);
          console.log("Erorr fetching creator GitHub repos");
          return;
        });

      config.url = "https://api.github.com/users/" + userName + "/repos";
      const repos = await axios(config)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log("Error fetching creator GitHub repos");
          return;
        });

      let creatorRepos = "";

      if (creatorRepoCount < 5) {
        for (let i = 0; i < creatorRepoCount; i++) {
          const temp = repos[i];
          creatorRepos += `👉 **[${temp.name}](${temp.html_url})**      \n`;
        }
      } else {
        //* use to check for duplicate repo selected by randomizer
        let selectedRepo = [];

        //* start random select 5 repos
        for (let i = 0; i < 5; i++) {
          randomSelect = Math.floor(Math.random() * (creatorRepoCount - 0) + 0);

          //* if randomizer fetched project repo which alerady exists in the selectedRepoIndex array, randomize and select again
          //* (make sure all repo selected by the randomizer are the not the same)
          while (selectedRepo.includes(randomSelect)) {
            randomSelect = Math.floor(
              Math.random() * (creatorRepoCount - 0) + 0
            );
            console.log("duplicate");
          }

          //* instead pushing repo json object, we push it's index
          selectedRepo.push(randomSelect);
          // console.log(random);
          const temp = repos[randomSelect];
          creatorRepos += `👉**  [${temp.name}](${temp.html_url})**\n`;
        }
      }

      console.log(creatorRepos);

      if (creator && creatorRepos && botProjectRepo) {
        const embedMessage = new MessageEmbed()
          .setColor("#FD5D5D")
          .setTitle("Bot Kurosaki")
          .setURL(`${botProjectRepo.html_url}`)
          .setAuthor({
            name: creator.name,
            iconURL: creator.avatar_url,
            url: creator.html_url,
          })
          .setDescription(
            `A pet-like bot that would follow its master around, from one voice channel to another. \n\nMore about the bot **[Click here](${botProjectRepo.html_url})**`
          )
          .setThumbnail(client.user.displayAvatarURL())

          .addFields(
            { name: "\u200B", value: "\u200B" },
            {
              name: "About the project",
              value:
                "This is a 3 weeks worth of Discord bot personal project built with NodeJS programming.\n\nGitHub Repository to the bot is created, click the title to check it out. Feel free use it for your own bot building",
            },
            {
              name: "About the developer",
              value:
                "With 2 years programming expriences, the bot developer has been exploring web based programming and has completed a number of personal projects." +
                `\n\nMore on the developer\n**[Visit GitHub Profile](${creator.html_url})**`,
              inline: true,
            },
            {
              name: "Other projects",
              value: creatorRepos,
              inline: true,
            }
          )
          .setImage(
            "https://i.pinimg.com/236x/47/84/aa/4784aaca821ed294f9a5a01802f73fcb.jpg"
          )
          .setTimestamp()
          .setFooter({
            text: "Kurosaki Bot",
            iconURL: creator.avatar_url,
          });

        await interaction.reply({
          embeds: [embedMessage],
          // ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "Something wrong happened fetching the creator and bot project info, contact developer to fix it",
          ephemeral: true,
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
