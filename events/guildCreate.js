module.exports = {
  name: "guildCreate",
  async execute(client, guild) {
    const logs = await guild.fetchAuditLogs();
    //* Find a BOT_ADD log
    const log = logs.entries.find(
      (log) => log.action === "BOT_ADD" && log.target.id === client.user.id
    );
    //* If the log exits, save user who invited to client.followedUser
    log
      ? (client.followedUser = log.executor.id)
      : (client.followedUser = undefined);

    console.log(client.followedUser);
  },
};
