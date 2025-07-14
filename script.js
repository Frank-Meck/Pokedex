
let select = 1;
let selectedContainer = 3; 


function init() {
  const genSelect = document.getElementById("gen_select");
  genSelect.value = "1"; 
  ladeGeneration(genSelect.value);
}


function searchPokemon() {
  let searchString = document.getElementById("idsearchString").value;
  if (searchString.length >= 3) {
    renderSearchResult(searchString)
  }
  if (searchString.length < 3) {
    renderPokedex();
  }
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
  const currentIndex = allePokemonDaten.findIndex(p => p.id === currentId);
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
  const currentIndex = allePokemonDaten.findIndex(p => p.id === currentId);
  const nextIndex = currentIndex + 1;
  if (nextIndex < allePokemonDaten.length) {
    renderSingleCard(nextIndex);
    changeContainer(selectedContainer); 
    document.getElementById("id_btn_previous").classList.remove("d_none");
  }
  if (nextIndex >= allePokemonDaten.length - 1) {
    document.getElementById("id_btn_next").classList.add("d_none");
  }
}


function startShowSingleCard(indexSingle) {
  document.body.classList.add("no-scroll");
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
  if (indexSingle >= allePokemonDaten.length - 1) {
    document.getElementById("id_btn_next").classList.add("d_none");
  }
}


function backToPokedex() {
  document.getElementById("idclassOverlay").style.display = "none";
  document.getElementById("idclassOverlay").innerHTML = "";
  document.body.classList.remove("no-scroll");
}

