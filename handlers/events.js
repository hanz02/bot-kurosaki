
const fs = require("fs");

//* ---- Event Handler -------- bring in all EVENT files object & load then (client.once/client.on)  ----------------------
//* bring in all event files
module.exports =  function (client) {
  const Eventfiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

  if (Eventfiles.length === 0) {
    console.log("no events found");
    return;
  }

  //* loop through event files
  for (const file of Eventfiles) {
    const event = require(`./../events/${file}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
      console.log(`Event: ${file} has been loaded`);
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
      console.log(`Event: ${file} has been loaded`);
    }
  }
};
