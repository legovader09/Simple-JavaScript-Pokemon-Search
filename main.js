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
    let output= "";
    for (let i = 0; i < obj.abilities.length; i++) {
        output += obj.abilities[i].ability.name + ", ";
        output.charAt(0).toUpperCase();
    }
    output = output.replace(/,(?=[^,]*$)/, "");
    document.getElementById("objInfo").innerHTML = 
    `
        Name: ${obj.name} <br>
        Abilities: ${output} <br>
    `;
    document.getElementById("objIMG").src = obj.sprites.other["official-artwork"].front_default;
    document.getElementById("content").style.display = "block";
    pokeInfo.style.display = "flex";
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