module.exports = {
  name: "guildDelete",
  async execute(client, guild) {
    client.followedUser = undefined;
  },
};
