/**
 * Card is a factory method that generates layouts for tiles
 * and appends them to the grid
 * It returns methods that close over the passed param
 */
export default function Card(info) {
  //grab the grid
  const grid = document.querySelector(".comparison-grid");
  function compose() {
    const { avatar, species, name } = info;
    //Create a container for the tile
    const layout = document.createElement("DIV");
    layout.classList.add("grid-item");
    layout.setAttribute("id", `${species.replace(" ", "_")}-slot`);
    //Add the hero image
    const hero = document.createElement("IMG");
    hero.classList.add("avatar");
    hero.src = `${avatar}`;
    layout.appendChild(hero);
    //Add the species name or the Human name
    const title = document.createElement("H3");
    title.appendChild(document.createTextNode(`${name || species}`));
    layout.appendChild(title);
    grid.appendChild(layout);
  }
  //detachInfo is a way to detach details on card if need be via script
  function detachInfo() {
    const { species } = info;
    const tabledInfo = document.querySelector(
      `#${species.replace(" ", "_")}-details`
    );
    if (tabledInfo) {
      tabledInfo.remove();
    }
  }
  //attachInfo adds the animal's details on the tile
  function attachInfo(removeBeforeAttach) {
    const { height, weight, diet, species } = info;
    const infoTable = document.createElement("DIV");
    infoTable.classList.add("info");
    infoTable.setAttribute("id", `${species.replace(" ", "_")}-details`);
    const tabledInfo = { height, weight, diet };
    //for each detail, create a section at 50% width
    Object.keys(tabledInfo).forEach((key) => {
      const item = document.createElement("DIV");
      item.classList.add("info-item");
      item.innerHTML = `<strong>${key}</strong> : <i>${tabledInfo[key]}</i>`;
      infoTable.appendChild(item);
    });
    //add table to the tile
    const layout = document.querySelector(`#${species.replace(" ", "_")}-slot`);
    if (removeBeforeAttach) {
      this.detachInfo();
    }
    layout.appendChild(infoTable);
  }
  //attachFact adds a random fact to the tile
  function attachFact() {
    const { species } = info;
    const fact = document.createElement("DIV");
    fact.setAttribute("id", `${species.replace(" ", "_")}-factoid`);
    fact.classList.add("factoid");
    const layout = document.querySelector(`#${species.replace(" ", "_")}-slot`);
    layout.appendChild(fact);
    const factoid = document.createTextNode(`${info.currentFact()}`);
    fact.appendChild(factoid);
  }

  return {
    compose,
    attachFact,
    attachInfo,
    detachInfo,
  };
}
