// Used to get a random project id from the given array. Shuffles the array. 
const db = require("../db");

function RandomItemFromNonMatchedIds(nonMatchedProjIds) {

  // Shuffle the array 
  function shuffleArray(arrayToShuffle) {
    return arrayToShuffle.sort(() => Math.random() - 0.5);
  };

  shuffleArray(nonMatchedProjIds);

  // Get a random index to grab.
  let randomID = Math.floor(Math.random() * nonMatchedProjIds.length);

  let itemToDisplay = nonMatchedProjIds[randomID];

  return itemToDisplay;
};

module.exports = RandomItemFromNonMatchedIds;