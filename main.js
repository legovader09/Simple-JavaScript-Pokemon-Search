const url = new URL(window.location.href);
const errMsg = document.getElementById("errorMsg");
const pokeInfo = document.getElementById("pokeInfo");
const searchTxt = document.getElementById("txtSearch");

/// FUNCTIONS
checkParams = () => {
    const params = url.searchParams.get("q");
    if (params) 
    {
        searchTxt.value = params;
        doSearch(params);
    }
}

doSearch = input => {
    input = input.toLowerCase();
    if (!verifyText(input)) return displayErrorMessage();
    console.log("text verified");
    fetch('https://pokeapi.co/api/v2/pokemon/' + input).then(response => {
        if (!response.ok) 
            throw new Error("response returned: " + response.status);
        else
            response.json().then(json => showPokemonInfo(json));
    }).catch(err => {
        console.error(err);
        displayErrorMessage();
    });
}

showPokemonInfo = obj => {
    // TODO: change information on page.
    console.log(obj);
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
        <span class="label">Name</span>: ${obj.name} <br>
        <span class="label">Abilities</span>: ${output} <br>
        <span class="label">Types</span>: ${types}<br>
        <span class="label">Stats</span>: <br>
        ${stats}
    `;
    document.getElementById("objIMG").src = obj.sprites.other["official-artwork"].front_default;
    document.getElementById("content").style.display = "block";
    pokeInfo.style.display = "flex";
    errMsg.style.display = "none";
}

displayErrorMessage = () => {
    errMsg.style.display = "block";
    pokeInfo.style.display = "none";
}

verifyText = txt => {
    if (!txt) return false; //if empty 
    return (/^[a-zA-Z]*$/.test(txt) || /^\d+$/.test(txt))
}

/// ON LOAD
document.getElementById("btnSearch").addEventListener('click', function(){
    errMsg.style.display = "none";
    doSearch(searchTxt.value);
    url.searchParams.set("q", searchTxt.value);
    window.history.replaceState(null, null, url);
})

searchTxt.addEventListener('keyup', (e) => e.key === 'Enter' && doSearch(searchTxt.value));

checkParams();