// Require environment variables
require("dotenv").config();

// Variables
var axios = require("axios"); // Axios get commands
var fs = require("fs"); // Core node package for reading and writing files
var keys = require("./keys.js"); //Spotify API Keys
var moment = require("moment"); // Moment date conversions
var Spotify = require("node-spotify-api"); //Spotify API calls
var spotify = new Spotify(keys.spotify);

// Variables to capture user input
var userAction = process.argv[2];
var nodeQuery = process.argv;
var userQuery = "";

// For loop to capture user inputs including whitespaces
for (var i = 3; i < nodeQuery.length; i++) {
  if (i > 3 && i < nodeQuery.length) {
    userQuery = userQuery + "+" + nodeQuery[i];
  } else {
    userQuery += nodeQuery[i];
  }
}

userInput(userAction, userQuery);

function userInput(userAction, userQuery) {
  switch (userAction) {
    case "concert-this":
      concertInfo(userQuery);
      break;

    case "spotify-this-song":
      spotifyInfo(userQuery);
      break;

    case "movie-this":
      movieInfo(userQuery);
      break;

    case "do-what-it-says":
      randomInfo(userQuery);
      break;

    default:
      console.log(
        "\nInvalid LIRI Input! Please use any of the following options:\nconcert-this <band name> \nspotify-this-song <song name> \nmovie-this <movie title> \ndo-what-it-says"
      );
  }
}

function concertInfo(userQuery) {
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    userQuery +
    "/events?app_id=codingbootcamp";
  console.log(queryURL);

  axios
    .get(queryURL)
    .then(function(response) {
      fs.writeFileSync("log.txt", "");
      console.log("-----------------EVENT INFO------------------");
      fs.appendFileSync(
        "log.txt",
        "-----------------EVENT INFO------------------\n"
      );
      for (var i = 0; i <= 10; i++) {
        var venues = response.data[i].venue.name;
        var city = response.data[i].venue.city;
        var state = response.data[i].venue.region;
        var eventDate = moment(response.data[i].datetime).format("LL");
        console.log(venues);
        fs.appendFileSync("log.txt", venues + "\n");
        console.log(city + ", " + state);
        fs.appendFileSync("log.txt", city + ", " + state + "\n");
        console.log(eventDate);
        fs.appendFileSync("log.txt", eventDate + "\n");
        console.log("---------------------------------------------");
        fs.appendFileSync(
          "log.txt",
          "---------------------------------------------\n"
        );
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

function spotifyInfo(userQuery) {
  if (userQuery === "") {
    userQuery = "The Sign Ace of Base";
    console.log(
      "\nNo song selected! I think you wanted to search for this, right?\n"
    );
  }
  spotify
    .search({ type: "track", query: userQuery, limit: 10 })
    .then(function(response) {
      fs.writeFileSync("log.txt", "");
      console.log("----------------SPOTIFY INFO-------------------");
      fs.appendFileSync(
        "log.txt",
        "----------------SPOTIFY INFO-------------------\n"
      );
      for (var i = 0; i < response.tracks.items.length; i++) {
        var artists = response.tracks.items[i].artists[0].name;
        var titles = response.tracks.items[i].name;
        var songLink = response.tracks.items[i].preview_url;
        var trackAlbum = response.tracks.items[i].album.name;

        console.log("Artist: " + artists);
        fs.appendFileSync("log.txt", "Artist: " + artists + "\n");
        console.log("Song Title: " + titles);
        fs.appendFileSync("log.txt", "Song Title: " + titles + "\n");
        console.log("Preview Link: " + songLink);
        fs.appendFileSync("log.txt", "Preview Link: " + songLink + "\n");
        console.log("Album: " + trackAlbum);
        fs.appendFileSync("log.txt", "Album: " + trackAlbum + "\n");
        console.log("-----------------------------------------------\r");
        fs.appendFileSync(
          "log.txt",
          "-----------------------------------------------\r"
        );
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function movieInfo(userQuery) {
  if (userQuery === "") {
    userQuery = "Mr. Nobody";
    fs.writeFileSync("log.txt", "");
    console.log(
      "\nNo user input detected. You should watch Mr. Nobody! But it's not on Netflix :(\r"
    );
    fs.appendFileSync(
      "log.txt",
      "No user input detected. You should watch Mr. Nobody! But it's not on Netflix :(\n"
    );
  }
  var queryURL =
    "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

  axios.get(queryURL).then(function(response) {
    fs.writeFileSync("log.txt", "");
    console.log("\n----------------------MOVIE INFO-----------------------");
    fs.appendFileSync(
      "log.txt",
      "----------------------MOVIE INFO-----------------------\n"
    );
    console.log("Movie Title: " + response.data.Title);
    fs.appendFileSync("log.txt", "Movie Title: " + response.data.Title + "\n");
    console.log("Year Released: " + response.data.Released);
    fs.appendFileSync(
      "log.txt",
      "Year Released: " + response.data.Released + "\n"
    );
    console.log("IMDB Rating: " + response.data.imdbRating + "/10");
    fs.appendFileSync(
      "log.txt",
      "IMDB Rating: " + response.data.imdbRating + "/10" + "\n"
    );
    console.log(
      response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value
    );
    fs.appendFileSync(
      "log.txt",
      response.data.Ratings[1].Source +
        ": " +
        response.data.Ratings[1].Value +
        "\n"
    );
    console.log("Country: " + response.data.Country);
    fs.appendFileSync("log.txt", "Country: " + response.data.Country + "\n");
    console.log("Languages: " + response.data.Language);
    fs.appendFileSync("log.txt", "Languages: " + response.data.Language + "\n");
    console.log("Movie Plot: " + response.data.Plot);
    fs.appendFileSync("log.txt", "Movie Plot: " + response.data.Plot + "\n");
    console.log("Actors: " + response.data.Actors);
    fs.appendFileSync("log.txt", "Actors: " + response.data.Actors + "\n");
  });
}
function randomInfo() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    console.log(dataArr);
    userInput(dataArr[0], dataArr[1]);
  });
}
