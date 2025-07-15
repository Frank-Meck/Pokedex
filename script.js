
let select = 1;
let selectedContainer = 3; 
let lastSearchLength = 0; // Variable, um die letzte Länge zu speichern


function init() {
  const genSelect = document.getElementById("gen_select");
  genSelect.value = "1"; 
  loadGeneration(genSelect.value);
}


function searchPokemon() {
  let searchString = document.getElementById("idsearchString").value;
  let hintRef = document.getElementById("searchHint");

  if (searchString.length > 0 && searchString.length < 3) {
    hintRef.innerText = " ➜ min. 3 Zeichen eingeben!";
  } else {
    hintRef.innerText = "";
  }

  // Wenn die Länge des searchStrings mindestens 3 ist, rufe die Suchergebnisse auf
  if (searchString.length >= 3) {
    renderSearchResult(searchString);
  } else {
    // Überprüfen, ob die Länge des searchString von 3 auf weniger als 3 geändert hat
    if (lastSearchLength >= 3 && searchString.length < 3) {
      renderPokedex(); // Nur aufrufen, wenn die Länge sich geändert hat
    }
  }

  // Speichern der aktuellen Länge für die nächste Suche
  lastSearchLength = searchString.length;
}

function changeContainer(value) {
  removeClassList();
  selectedContainer = value; 
  if (value == 1) {
    document.getElementById("idsinglepdex_main").classList.add("singlepdex_container_z_index");
    document.getElementById("idcontainer_menue_main").classList.add("singlepdex_container_selcted");
  }
  if (value == 2) {
    document.getElementById("idsinglepdex_static").classList.add("singlepdex_container_z_index");
    document.getElementById("idcontainer_menue_static").classList.add("singlepdex_container_selcted");
  }
  if (value == 3) {
    document.getElementById("idsinglepdex_evochain").classList.add("singlepdex_container_z_index");
    document.getElementById("idcontainer_menue_evochain").classList.add("singlepdex_container_selcted");
  }
}


function removeClassList() {
  document.getElementById(`idsinglepdex_main`).classList.remove("singlepdex_container_z_index");
  document.getElementById(`idsinglepdex_static`).classList.remove("singlepdex_container_z_index");
  document.getElementById(`idsinglepdex_evochain`).classList.remove("singlepdex_container_z_index");
  document.getElementById(`idcontainer_menue_main`).classList.remove("singlepdex_container_selcted");
  document.getElementById(`idcontainer_menue_static`).classList.remove("singlepdex_container_selcted");
  document.getElementById(`idcontainer_menue_evochain`).classList.remove("singlepdex_container_selcted");
}


function previousPokedex(currentId) {
  const currentIndex = allPokemonData.findIndex(p => p.id === currentId);
  const previousIndex = currentIndex - 1;
  if (previousIndex >= 0) {
    renderSingleCard(previousIndex);
    changeContainer(selectedContainer); 
    document.getElementById("id_btn_next").classList.remove("d_none");
  }
  if (previousIndex <= 0) {
    document.getElementById("id_btn_previous").classList.add("d_none");
  }
}


function nextPokedex(currentId) {
  const currentIndex = allPokemonData.findIndex(p => p.id === currentId);
  const nextIndex = currentIndex + 1;
  if (nextIndex < allPokemonData.length) {
    renderSingleCard(nextIndex);
    changeContainer(selectedContainer); 
    document.getElementById("id_btn_previous").classList.remove("d_none");
  }
  if (nextIndex >= allPokemonData.length - 1) {
    document.getElementById("id_btn_next").classList.add("d_none");
  }
}


function startShowSingleCard(indexSingle) {
  document.body.classList.add("no_scroll");
  const overlay = document.getElementById("idclassOverlay");
  overlay.style.display = "flex"; 
  renderSingleCard(indexSingle);
  overlay.addEventListener("click", function(event) {
    if (event.target.classList.contains("overlay")) {
      backToPokedex();
    }
  });
  if (indexSingle == 0) {
    document.getElementById("id_btn_previous").classList.add("d_none");
  }
  if (indexSingle >= allPokemonData.length - 1) {
    document.getElementById("id_btn_next").classList.add("d_none");
  }
}


function backToPokedex() {
  document.getElementById("idclassOverlay").style.display = "none";
  document.getElementById("idclassOverlay").innerHTML = "";
  document.body.classList.remove("no_scroll");
}

