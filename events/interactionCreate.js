module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (interaction.isCommand()) {
      //* get user slash command in chat -> interaction.commandName
      //* look for user slash command in client.commands collection
      const command = client.commands.get(interaction.commandName);

      //* if user slash command doesnt exist in client.commands collection, exit event
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.followUp({
          content:
            "Something wrong executing this command, bot developer need to fix this",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button)
        return await interaction.reply({
          content:
            "There was no reply created for this button, lazy ass bot developer I guess",
          ephemeral: true,
        });

      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.channel.send({
          content:
            "Something wrong with the reply from button, bot developer need to fix this",
          ephemeral: true,
        });
      }
    }
  },
};
