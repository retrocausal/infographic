import { Dinasaur, HumanBeing, Bird } from "./prototypes/index.js";
import { shuffle, useReducer, reducer } from "./utils/index.js";
import Card from "./card.js";
/**
 * App consolidates all aspects of running a comparison
 * between the data entered and available static data for dinos
 * constructs a skeletal state machine and initializes
 * render containers
 */
class App {
  constructor() {
    const initState = { layout: [] };
    //grab containers
    const grid = document.querySelector(".comparison-grid");
    const form = document.querySelector(".dino-compare-input");
    //init state machine
    const { state, dispatch } = useReducer(initState, reducer);
    this.state = state;
    this.dispatch = dispatch;
    this.grid = grid;
    this.form = form;
  }
  //reads properties of an object
  //returns usable argument lists
  read(animal) {
    const {
      species,
      weight,
      height,
      fact,
      avatar,
      diet,
      where: region,
      when: era,
    } = animal;
    return [species, weight, height, region, era, diet, fact, avatar];
  }
  set _bird(bird) {
    this.bird = new Bird(...this.read(bird));
  }
  get _bird() {
    return this.bird;
  }
  set _dinos(arrDinos) {
    this.dinos = arrDinos.map((dino) => {
      return new Dinasaur(...this.read(dino));
    });
  }
  get _dinos() {
    return this.dinos;
  }
  set _human(human) {
    this.human = new HumanBeing(...this.read(human));
    this.human.name = human.name || "";
  }
  get _human() {
    return this.human;
  }
  /**
   * init begins compiling comparison references
   * and clones static and dynamic data objects
   * and stores them in state.
   * It then adds comparisons as facts to all dinasaurs in state
   * creates alist of renderable objects with the human in the center
   * shuffles all other indices except the human
   * calls render to display results
   */
  init() {
    const dinoIndices = shuffle(6, this._dinos.length);
    const dinos = dinoIndices.map((index) => this._dinos[index]);
    //clone form inputs and static data into state
    this.dispatch({
      type: "INIT_COMPARISON_REFERENCES",
      dinos,
      human: this._human,
      bird: this._bird,
    });
    //init comparison
    this.addComparisons();
    //create shuffled layout ref
    this.createLayoutMap();
    //append nodes to grid
    this.prepareGrid();
    //render grid
    this.render();
  }
  //compares human data with dinos
  addComparisons() {
    this.dispatch({ type: "COMPARE_HUMAN_INPUTS" });
  }
  //creates layout tenants and shuffles them
  createLayoutMap() {
    this.dispatch({ type: "CREATE_INFOGRAPHIC_LAYOUT_CONFIG" });
  }
  //appends tenants to grid
  prepareGrid() {
    this.grid.innerHTML = "";
    const { layout } = this.state();
    layout.forEach((element) => {
      const isHuman = HumanBeing.prototype.isPrototypeOf(element);
      const slot = Card(element);
      slot.compose();
      if (!isHuman) {
        slot.attachInfo();
        slot.attachFact();
      }
    });
  }
  /**
   *compiles form inputs and validates the form
   *initializes species segregations
   */
  compile(data, formInputs) {
    const { Human: human, Bird: bird, Dinos: dinos } = data;
    const emptyInputs = Object.keys(formInputs).filter((key) => {
      if (!!formInputs[key] === false) {
        return key;
      }
    });
    if (emptyInputs.length > 0) {
      throw new Error(`${emptyInputs[0]} may not be empty`);
    }
    let { feet, inches, weight } = formInputs;
    let height;
    feet = parseFloat(feet);
    inches = parseFloat(inches);
    weight = parseFloat(weight);
    if (isNaN(feet) || isNaN(inches) || (feet < 1 && inches < 1)) {
      throw new Error("invalid height");
    } else {
      height = inches + 12 * feet;
      height = Math.round(height);
    }
    if (isNaN(weight) || weight < 1) {
      throw new Error("invalid weight");
    }
    Object.assign(human, { ...formInputs, height });
    this._human = human;
    this._bird = bird;
    this._dinos = dinos;
  }
  //renders grid
  render() {
    this.form.classList.add("invisible");
    this.grid.classList.add("visible");
  }
}
//instantiate App
const instance = new App();
// Use IIFE to get human data from form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#dino-compare");
  form.onsubmit = (function (instance) {
    return function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      fetch("./dino.json")
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          try {
            instance.compile(json, data);
            instance.init();
          } catch (error) {
            //show errors
            document.getElementById("error").innerText = error.message;
          }
        })
        .catch(
          (e) =>
            (document.getElementById("error").innerText =
              "Could not fetch data")
        );
    };
  })(instance);
});
