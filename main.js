const errMsg = document.getElementById("errorMsg");
document.getElementById("btnSearch").addEventListener('click', function(){
    errMsg.style.display = "none";
    doSearch(document.getElementById("txtSearch").value);
})

doSearch = input => {
    if (!verifyText(input)) return;
    console.log("text verified");
    fetch('https://pokeapi.co/api/v2/pokemon/' + input).then(response => {
        if (!response.ok)
            throw new Error("response returned: " + response.status);
        else
            response.json().then(json => document.getElementById("content").appendChild(document.createTextNode(JSON.stringify(json, null, 4))));
    }).catch(err => {
        console.error("Error: ", err)
        displayErrorMessage();
    });
}

displayErrorMessage = () => {
    errMsg.style.display = "block";
}

verifyText = txt => {
    if (!txt) return false; //if empty 
    return (/^[a-zA-Z]*$/.test(txt) || /^\d+$/.test(txt))
}