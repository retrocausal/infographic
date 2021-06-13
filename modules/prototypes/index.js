import { round, shuffle } from "../utils/index.js";
/**
 * Vertibrate is the base class for all prototypes
 * It defines measurements and methods to compare measurements
 */
export function Vertibrate(wt, ht, species) {
  this.weight = `${wt || "Unknown"} lbs`;
  this.height = `${ht || "Unknown"} inches`;
  this.species = species;
  this.hasSkeletalStructure = true;
}
/**
 * Mammal extends Vertibrate.
 * It defines a blue print for Humans
 * and inits region and era
 */
export function Mammal(...args) {
  const [species, weight, height, region, era] = args;
  Reptile.super.call(this, weight, height, species);
  this.region = region || "Unknown";
  this.era = era || "Unknown";
}
/**
 * Reptile extends Vertibrate.
 * It defines methods to compare region and era
 * and inits the both of them
 */

export function Reptile(...args) {
  const [species, weight, height, region, era] = args;
  Reptile.super.call(this, weight, height, species);
  this.region = region || "Unknown";
  this.era = era || "Unknown";
}

/**
 * Dinasaur extends Reptile. It defines
 * diet,avatar, and provides a method to
 * compile and shuffle facts
 */

export function Dinasaur(...args) {
  const [, , , , , diet, fact, avatar] = args;
  Dinasaur.super.call(this, ...args);
  this.diet = diet || "Unknown";
  this.facts = [fact];
  this.avatar = `images/${avatar}`;
}
/**
 * HumanBeing extends Mammal. It defines
 * a diet, a factoid and an avatar
 */
export function HumanBeing(...args) {
  const [, , , , , diet, fact, avatar] = args;
  HumanBeing.super.call(this, ...args);
  this.diet = diet || "Unknown";
  this.fact = fact || "None";
  this.avatar = `images/${avatar}`;
}
/**
 * Bird extends Dinasaur.
 */

export function Bird(...args) {
  Bird.super.call(this, ...args);
  this.chirp = true;
}
//Define interitances
Reptile.is(Vertibrate);
Mammal.is(Vertibrate);
Dinasaur.is(Reptile);
Bird.is(Dinasaur);
HumanBeing.is(Mammal);

// Create Dino Compare Method 1- inherited via Vertibrate
// NOTE: Weight in JSON file is in lbs

Vertibrate.prototype.compareWeight = function (wt) {
  const [weight] = `${wt}`.split(" ");
  const [myWeight] = `${this.weight}`.split(" ");
  let comparison = "Could not compare weight!";
  let numericWt;
  let myNumericWt;
  try {
    numericWt = parseFloat(weight);
    myNumericWt = parseFloat(myWeight);
    if (isNaN(numericWt)) {
      throw new Error("Invalid Weight Passed");
    }
    if (isNaN(myNumericWt)) {
      throw new Error("Invalid Weight Inherited");
    }
  } catch (error) {}
  if (numericWt && myNumericWt) {
    if (myNumericWt > numericWt) {
      comparison = `${this.species} is ${round(
        myNumericWt / numericWt
      )} times more massive `;
    } else if (myNumericWt < numericWt) {
      comparison = `${this.species} is ${round(
        numericWt / myNumericWt
      )} times less massive `;
    } else {
      comparison = `${this.species} weighs in equally!`;
    }
  }
  return comparison;
};

// Create Dino Compare Method 2 - inherited via Vertibrate
// NOTE:  height in json is in inches.

Vertibrate.prototype.compareHeight = function (ht) {
  const [height] = `${ht}`.split(" ");
  const [myHeight] = `${this.height}`.split(" ");
  let comparison = "Could not compare height!";
  let numericHt;
  let myNumericHt;
  try {
    numericHt = parseFloat(height);
    myNumericHt = parseFloat(myHeight);
    if (isNaN(numericHt)) {
      throw new Error("Invalid Weight Passed");
    }
    if (isNaN(myNumericHt)) {
      throw new Error("Invalid Weight Inherited");
    }
  } catch (error) {}
  if (numericHt && myNumericHt) {
    if (myNumericHt > numericHt) {
      comparison = `${this.species} is ${round(
        myNumericHt / numericHt
      )} times taller `;
    } else if (myNumericHt < numericHt) {
      comparison = `${this.species} is ${round(
        numericHt / myNumericHt
      )} times shorter `;
    } else {
      comparison = `${this.species} is equally tall!`;
    }
  }
  return comparison;
};
//Dino compare method 3 - inherited via Reptile
//compares geological periods
Reptile.prototype.compareEra = function (era) {
  this.facts.push(
    `${this.species} was from the ${this.era} geological period whereas the human is from ${era}`
  );
};

//Dino compare method 3 - inherited via Reptile
//compares geo locations
Reptile.prototype.compareRegion = function (region) {
  this.facts.push(
    `${this.species} was mostly in the ${this.region} region whereas the human populates ${region}`
  );
};

//Dino compare method 4 - self defined
//compares diet
Dinasaur.prototype.compareDiet = function (diet) {
  if (this.diet.toLowerCase() === diet.toLowerCase()) {
    this.facts.push(`${this.species} was a ${diet} too!`);
  } else {
    this.facts.push(
      `${this.species} was a ${this.diet} whereas the human is a ${diet}`
    );
  }
};
//Dino compare aggregator - compiles factoids
Dinasaur.prototype.compare = function (human) {
  const { weight, height, diet, era, region } = human;
  this.facts.push(this.compareHeight(height));
  this.facts.push(this.compareWeight(weight));
  this.compareDiet(diet);
  this.compareEra(era);
  this.compareRegion(region);
};
//fetch a single random fact
Dinasaur.prototype.currentFact = function () {
  const randomIndex = shuffle(this.facts.length, 1)[0] || 0;
  return this.facts[randomIndex] || this.facts[0];
};
