// Require environment variables
require("dotenv").config();

// Variables
var fs = require("fs"); // Core node package for reading and writing files
var keys = require("./keys.js"); //Spotify API Keys
var spotify = new spotify(keys.spotify);
