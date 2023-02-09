// Used to get a random project id from the given array. Shuffles the array. 
const db = require("../db");

function RandomItemFromNonMatchedIds(nonMatchedProjIds) {

  console.log("B4 SHUFFLE:", nonMatchedProjIds)

  // Shuffle the array 
  function shuffleArray(arrayToShuffle) {
    return arrayToShuffle.sort(() => Math.random() - 0.5);
  };

  shuffleArray(nonMatchedProjIds);

  console.log(`AFTER SHUFFLE ${nonMatchedProjIds}`)

  // Get a random index to grab.
  let randomID = Math.floor(Math.random() * nonMatchedProjIds.length);

  let itemToDisplay = nonMatchedProjIds[randomID];
  console.log(`Getting ${itemToDisplay}`)

  return itemToDisplay;
};

module.exports = RandomItemFromNonMatchedIds;