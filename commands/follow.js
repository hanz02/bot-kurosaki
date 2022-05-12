const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  slash_command: new SlashCommandBuilder()
    .setName("follow")
    .setDescription("Follow you when joining a channel")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Mention user to follow specifically")
        .addUserOption((option) =>
          option
            .setName("mention")
            .setDescription("user to follow")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("To follow any user or not")
        .addStringOption((option) =>
          option
            .setName("switch")
            .setDescription("ON/Off")
            .setRequired(true)
            .addChoices({
              name: "on",
              value: "true",
            })
            .addChoices({
              name: "off",
              value: "false",
            })
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("current")
        .setDescription("View current following user")
    ),

  async execute(interaction, client) {
    switch (interaction.options.getSubcommand()) {
      case "user":
        //* if follow command for "user follow"
        //* get command value mentioned user
        const user = interaction.options.getUser("mention");

        //* get command value mentioned user
        if (!user.bot) {
          client.followedUser = user.id;
          // console.log(client.followedUser);
          await interaction.reply(
            `Bot will now follow user: \`${user.username}\` ヽ(*・ω・)ﾉ	`
          );
        } else {
          await interaction.reply(
            "Bot cannot follow another bot, doesn't make sense O.o?"
          );
        }
        break;
      case "status":
        //* if follow command for "follow status"

        client.followState = interaction.options.getString("switch") === "true";

        client.followState
          ? await interaction.reply("Bot will now follow users to VC")
          : await interaction.reply("Bot will stop follow users to VC");
        break;

      case "current":
        //* if follow command for "follow status"

        if (client.followedUser) {
          //* get guild member by followed user id
          const user = await interaction.guild.members.fetch(
            client.followedUser
          );

          //* user fetched form server exists or not
          user
            ? await interaction.reply(
                `Bot is currently following user: \`${user.displayName}\``
              )
            : await interaction.reply(
                "Bot can't find the user followed, are you sure the user is still in the server?"
              );
        } else {
          await interaction.reply("Bot is not following anyone right now");
        }
        break;
      default:
        await interaction.reply(
          "Oops! Can't process your command, make sure your command is valid?"
        );
    }
  },
};
