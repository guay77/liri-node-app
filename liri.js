require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);


//import packages
var axios = require("axios");

var chalk = require("chalk")


var moment = require("moment");


var fs = require("fs");

// Setup Spotify APi
var spotify = new Spotify(keys.spotify)
    // id: "bfc74e38037541baa92d4133560a6d03",
    // secret: "318c2b3b6a3a4c1b8cf35f5b0be3515bto"
;
// Functions

// Function fetches artists name
var fetchArtist = function(artist) {
    return artist.name;
};

// Function for spotify search
var spotifySearch = function(song) {
    if (song === undefined) {
        song = "Ripple";
    }

    spotify.search({
            type: "track",
            query: song
        },
        function(err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songItem = data.tracks.items;

            for (var i = 0; i < songItem.length; i++) {
                console.log(i);
                console.log("artist(s): " + songItem[i].artists.map(fetchArtist));
                console.log("song name: " + songItem[i].name);
                console.log("preview song: " + songItem[i].preview_url);
                console.log("album: " + songItem[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

var songBand = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=547f77f8-5e89-4f5f-9fb8-169692b0d348";

    axios.get(queryURL).then(
        function(response) {
            var jsonData = response.data;

            if (!jsonData.length) {
                console.log("No results found for " + artist);
                return;
            }

            console.log("Upcoming concerts for " + artist + ":");

            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];


                console.log(
                    show.venue.city +
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " +
                    show.venue.name +
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY")
                );
            }
        }
    );
};

//  Movie Search
var movieSearch = function(movie) {
    if (movie === undefined) {
        movie = "The Matrix";
    }

    var urlHit =
        "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    axios.get(urlHit).then(
        function(response) {
            var jsonData = response.data;

            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        }
    );
};

// running a command function
var commandFun = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            choice(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            choice(dataArr[0]);
        }
    });
};

// function for choosing what command to execute
var choice = function(caseData, functionData) {
    switch (caseData) {
        case "song bands":
            songBands(functionData);
            break;
        case "spotify search":
            spotifySearch(functionData);
            break;
        case "movie-search":
            movieSearch(functionData);
            break;
        case "command-line-fun":
            commandFun();
            break;
        default:
            console.log("LIRI's clueless ");
    }
};

// Function which takes in command line arguments and executes correct function accordingly
var execute = function(argOne, argTwo) {
    choice(argOne, argTwo);
};

// Execute 
execute(process.argv[2], process.argv.slice(3).join(" "));