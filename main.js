doSearch = input => {
    verifyText(input);
    fetch('https://pokeapi.co/api/v2/pokemon/ditto' + input)
        .then(response => response.json())
        .then(json => data = json);
}

verifyText = text => {
    
}