module.exports = {
  name: "ready",
  once: true,
  execute(client, interaction) {
    client.followedUser = "375212309116616705";
    // client.followedUser = "969163610725154857";

    //! remove all global slash command (take up to 1 hour to be in effective)
    // client.application.commands.set([]);
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
