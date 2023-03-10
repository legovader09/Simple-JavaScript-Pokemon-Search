const url = new URL(window.location.href);
const errMsg = document.getElementById("errorMsg");
const pokeInfo = document.getElementById("pokeInfo");
const searchTxt = document.getElementById("txtSearch");

/// FUNCTIONS
const checkParams = () => {
  const params = url.searchParams.get("q");
  if (params) {
    searchTxt.value = params;
    doSearch(params);
  }
}

const doSearch = input => {
  url.searchParams.set("q", input);
  window.history.replaceState(null, null, url);
  input = input.toLowerCase().trim();
  if (!verifyText(input)) return displayErrorMessage();
  fetch('https://pokeapi.co/api/v2/pokemon/' + input).then(response => {
    if (response.ok) 
      response.json().then(json => showPokemonInfo(json));
    else
      throw new Error("response returned: " + response.status);
  }).catch(err => {
    console.error(err);
    displayErrorMessage(true);
  });
}

/**
 * Displays the pokemon's information on the screen
 * @param obj JSON object
 */
const showPokemonInfo = obj => {
  searchTxt.value = obj.name;
  let output = "";
  for (let i = 0; i < obj.abilities.length; i++) {
    output += `${obj.abilities[i].ability.name}, `;
  }
  output = output.replace(/,(?=[^,]*$)/, "");
  let stats = "<ul>";
  for (let i = 0; i < obj.stats.length; i++) {
    stats += `<li>${obj.stats[i].stat.name}: ${obj.stats[i].base_stat}</li>`
  }
  stats += "</ul>";
  let types = "";
  for (let i = 0; i < obj.types.length; i++) {
    types += `${obj.types[i].type.name}, `;
  }
  types = types.replace(/,(?=[^,]*$)/, "");
  document.getElementById("objInfo").innerHTML = 
  `
    <span class="label">ID</span>: ${obj.id} <br>
    <span class="label">Name</span>: ${obj.name} <br>
    <span class="label">Abilities</span>: ${output} <br>
    <span class="label">Types</span>: ${types}<br>
    <span class="label">Stats</span>: <br>
    ${stats}
    <a id="prevPoke">Previous</a> | <a id="nextPoke">Next</a>
  `;
  document.getElementById("nextPoke").addEventListener("click", () => {btnNextPokemon(obj.id + 1)});
  document.getElementById("prevPoke").addEventListener("click", () => {btnNextPokemon(obj.id - 1)});
  document.getElementById("objIMG").src = obj.sprites.other["official-artwork"].front_default ?? 'sadmon.svg';
  displayErrorMessage(false);
}

const btnNextPokemon = (id) => {
  if (id === 0) id = 1;
  doSearch((id).toString());
}

const displayErrorMessage = (enable) => {
  document.getElementById("content").style.display = "block";
  errMsg.style.display = enable ? "block" : "none";
  pokeInfo.style.display = enable ? "none" : "flex";
}

const verifyText = txt => {
  if (!txt) return false; //if empty 
  return (/^[a-zA-Z]*$/.test(txt) || /^\d+$/.test(txt))
}

/// ON LOAD
document.getElementById("btnSearch").addEventListener('click', function(){
  if (searchTxt.value.trim().length > 0) doSearch(searchTxt.value);
})

searchTxt.addEventListener('keyup', (e) => e.key === 'Enter' && doSearch(searchTxt.value));

checkParams();