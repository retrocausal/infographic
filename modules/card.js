export default function Card(info) {
  const grid = document.querySelector(".comparison-grid");
  function compose() {
    const { avatar, species, name, height, weight, diet } = info;
    const layout = document.createElement("DIV");
    layout.classList.add("grid-item");
    layout.setAttribute("id", `${species.replace(" ", "_")}-slot`);
    const hero = document.createElement("IMG");
    hero.classList.add("avatar");
    hero.src = `${avatar}`;
    layout.appendChild(hero);
    const title = document.createElement("H3");
    title.appendChild(document.createTextNode(`${name || species}`));
    layout.appendChild(title);
    const infoTable = document.createElement("DIV");
    infoTable.classList.add("info");
    const tabledInfo = { height, weight, diet };
    Object.keys(tabledInfo).forEach((key) => {
      const item = document.createElement("DIV");
      item.classList.add("info-item");
      item.innerHTML = `<strong>${key}</strong> : <i>${tabledInfo[key]}</i>`;
      infoTable.appendChild(item);
    });
    layout.appendChild(infoTable);
    const fact = document.createElement("DIV");
    fact.setAttribute("id", `${species.replace(" ", "_")}-factoid`);
    fact.classList.add("factoid");
    layout.appendChild(fact);
    grid.appendChild(layout);
  }
  function attachFact() {
    try {
      const fact = document.querySelector(
        `#${info.species.replace(" ", "_")}-factoid`
      );
      const factoid = document.createTextNode(`${info.currentFact()}`);
      fact.appendChild(factoid);
    } catch (error) {}
  }

  return {
    compose,
    attachFact,
  };
}
