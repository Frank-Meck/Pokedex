
function renderPokedex() {
  let contentPokedexRef = document.getElementById(`id_pdex_total`);
  contentPokedexRef.innerHTML = "";
for (let index = 0; index < allePokemonDaten.length; index++) {
  const p = allePokemonDaten[index];
  
  if (p.error) {
    contentPokedexRef.innerHTML += getPokedexFailure(index);

  } else {
    contentPokedexRef.innerHTML += getPokedex(index);
  }
renderPokedexCategory(index) ; 
}
}


function renderPokedexCategory(index) {
  const p = allePokemonDaten[index];
  if (p.error) return;

  let contentPokedexCategory = document.getElementById(`id_pokedex_category${index}`);
  contentPokedexCategory.innerHTML = "";

  for (let indexTyps = 0; indexTyps < p.types.length; indexTyps++) {
    contentPokedexCategory.innerHTML += getPokedexCategory(index, indexTyps);
  }
}



function renderSearchResult(searchString) {
  let contentPokedexRef = document.getElementById(`id_pdex_total`);
  contentPokedexRef.innerHTML = "";
  let stringLength = searchString.length;
  let found = 0; // Treffer-Zähler

  for (let index = 0; index < allePokemonDaten.length; index++) {
    const p = allePokemonDaten[index];
    if (p.error) continue;

    let checkString = p.deutscherName.slice(0, stringLength);
    if (searchString.toLowerCase() === checkString.toLowerCase()) {
      contentPokedexRef.innerHTML += getPokedex(index);
      renderPokedexCategory(index);
      found++;
    }
  }
  if (found === 0) {
    contentPokedexRef.innerHTML = getSearchError(searchString);
        
  }
}

function renderSingleCard(index) {
  const p = allePokemonDaten[index];
  const contentPokedexRef = document.getElementById(`idclassOverlay`);
  contentPokedexRef.innerHTML = "";

  if (p.error) {
    contentPokedexRef.innerHTML = getSingleCardFailure(index)
  }
  contentPokedexRef.innerHTML = getSingleCard(index);
  renderSinglePdexCategory(index);
}


function renderSinglePdexCategory(index) {
  const p = allePokemonDaten[index];
  if (p.error) return;

  let contentPokedexCategory = document.getElementById(`id_singlepdex_characteristics_${index}`);
  contentPokedexCategory.innerHTML = "";

  for (let indexTyps = 0; indexTyps < p.types.length; indexTyps++) {
    contentPokedexCategory.innerHTML += getPokedexCategory(index, indexTyps);
  }
}


function evoChain(){
const evoDeutsch = p.evolutionKette.map(name => {
  const match = allePokemonDaten.find(x =>
    x.name === name || x.deutscherName?.toLowerCase() === name
  );
  return match?.deutscherName || name;
});
}

