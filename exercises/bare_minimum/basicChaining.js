/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
var request = require('request');



var sendGitHubRequestAsync = function(username) {
  return new Promise(function(resolve, reject) {
    request.get('https://api.github.com/users/' + username[0], function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve([JSON.parse(res.body), username[1]]);
      }
    });
  });
};

var writeResponseAsync = function(response) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(response[1], JSON.stringify(response[0]), 'utf8', function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(response[0]);
      }
    });
  });
};

var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(readFilePath, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve([data.split('\n')[0], writeFilePath]);
      }
    });
  })
  .then(function(data) {
    return sendGitHubRequestAsync(data);
  })
  .then(function(data) {
    return writeResponseAsync(data);
  });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
