const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: { name: "queueNextPage" },
  async execute(interaction, client) {
    try {
      const pageNumber = interaction.message.embeds[0].footer.text.split("/");
      const currentPageNumber = parseInt(pageNumber[0].trim().slice(-1)) + 1;
      const totalPageNumber = pageNumber[1].trim();

      if (currentPageNumber >= totalPageNumber) {
        //* disable the next button when user reached the end of the pages
        interaction.message.edit({
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("queuePrevPage")
                .setLabel("Previous")
                .setStyle("PRIMARY")
                .setDisabled(false),
              new MessageButton()
                .setCustomId("queueNextPage")
                .setLabel("Next")
                .setStyle("PRIMARY")
                .setDisabled(true)
            ),
          ],
        });
      } else {
        //* enable the both button when user is in middle of the pages
        interaction.message.edit({
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("queuePrevPage")
                .setLabel("Previous")
                .setStyle("PRIMARY")
                .setDisabled(false),
              new MessageButton()
                .setCustomId("queueNextPage")
                .setLabel("Next")
                .setStyle("PRIMARY")
                .setDisabled(false)
            ),
          ],
        });
      }

      let trackNumber = "";
      const queueString = interaction.message.queueTracks
        .slice((currentPageNumber - 1) * 10 + 1, currentPageNumber * 10 + 1)
        .map((song, index) => {
          return (
            //* [currentPageNumber - 1 (Ex.page 2 - 1 = 1)] &  [index + 1 (E.x track 1)] = track 11
            `${(currentPageNumber - 1) * 10 + (index + 1)}. ${
              song.name.length > 50
                ? song.name.slice(0, 50 - 3) + ".."
                : song.name
            } [${song.formattedDuration}]\n` + `🎤 ${song.member.displayName}`
          );
        })
        .join("\n");

      const embedMessage = interaction.message.embeds[0]
        .setFields({
          name: "Tracks Queue: ",
          value: `\`\`\`${queueString} \`\`\``,
        })
        .setFooter({
          text: `Page: ${parseInt(currentPageNumber)} / ${totalPageNumber}`,
        });
      interaction.message.edit({ embeds: [embedMessage] });
      interaction.deferUpdate();
    } catch (err) {
      console.log(err);
      return await interaction.reply({
        content: `❌ | Something wrong trying to execute this command, developer fix it!`,
        ephemeral: true,
      });
    }
  },
};
