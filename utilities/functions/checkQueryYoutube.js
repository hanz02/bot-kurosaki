const ytmpl = require("yt-mix-playlist");
const ytsr = require("ytsr");
const ytpl = require("ytpl");

module.exports = {
  checkQueryYoutube: async function (client, musicQuery) {
    let queryResult = undefined;

    //* check music query if it is a youtube mix playlist
    const regExpPlaylist =
      "^(?:https?://)?(?:www.)?youtu.?be(?:.com)?.*?(?:v|list)=(.*?)(?:&|$)|^(?:https?://)?(?:www.)?youtu.?be(?:.com)?(?:(?!=).)*/(.*)$";
    var match = musicQuery.match(regExpPlaylist);
    if (match && match[1] && musicQuery.includes("start_radio")) {
      videoId = match[1];
      const mixPlaylist = await ytmpl(videoId);
      if (!mixPlaylist.items || !mixPlaylist) {
        return false;
      }

      //* send back new mixedPlaylist
      return (queryResult = {
        resultType: "mixPlaylist",
        value: mixPlaylist,
      });
    }

    //* send back new mixedPlaylist
    return (queryResult = {
      resultType: "other",
      value: musicQuery,
    });
  },
};
