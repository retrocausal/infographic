//useReducer provides a state read and write machine
export function useReducer(initialState, reducer) {
  //returns a module
  return (function (startState = {}, stateHandler = function () {}) {
    let mutatableState = JSON.parse(JSON.stringify(startState));
    function dispatch(payload = { type: "" }) {
      mutatableState = stateHandler(mutatableState, { ...payload });
    }
    return { dispatch, state: () => mutatableState };
  })(initialState, reducer);
}
//utility function to round numbers
export function round(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}
//utility function to generate random set of numbers (indices in length)
//between 0 and rangeCeil
export function shuffle(rangeCeil, indices) {
  const randos = new Set();
  while (randos.size < indices) {
    const n = Math.round(Math.random() * rangeCeil);
    randos.add(n);
  }
  return [...randos.values()];
}
//State manager for the App
export function reducer(state = {}, action) {
  const clonedState = { ...state };
  let { dinos, human, bird, layout } = clonedState;
  let layoutCeil;
  let layoutFloor;
  let randomIndex = 0;
  switch (action.type) {
    /**
     * init clones of all animals in App
     */
    case "INIT_COMPARISON_REFERENCES":
      dinos = (action.dinos || []).map((dino) => Object.create(dino));
      bird = Object.create(action.bird || {});
      human = Object.create(action.human || {});
      break;
    /**
     * init comparisons between human and dinos
     */
    case "COMPARE_HUMAN_INPUTS":
      dinos.forEach((dino) => {
        dino.compare(human);
      });
      break;
    /**
     * Generate a random set of displayable objects
     * with human in the middle
     */
    case "CREATE_INFOGRAPHIC_LAYOUT_CONFIG":
      layoutCeil = dinos.slice(0, 4);
      layoutFloor = dinos.slice(4);
      randomIndex = shuffle(layoutFloor.length, 1)[0] || 0;
      layoutFloor.splice(randomIndex, 0, bird);
      layout = [...layoutCeil, human, ...layoutFloor];
      break;
    default:
      break;
  }
  return { dinos, human, bird, layout };
}
