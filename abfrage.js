const generationen = {
  1: { start: 1, ende: 151 },
  2: { start: 152, ende: 251 },
  3: { start: 252, ende: 386 },
  4: { start: 387, ende: 493 },
  5: { start: 494, ende: 649 },
  6: { start: 650, ende: 721 },
  7: { start: 722, ende: 809 },
  8: { start: 810, ende: 905 },
};


let allPokemonData = [];
let alreadyDisplayed = 0;
let lastSuccessfulGeneration = 1;


async function loadGeneration(genNum) {
  document.getElementById('idsearchString').value = ''; 
  const spinner = document.getElementById("spinner");
  backToPokedex();
  showSpinner(true, spinner);

  const gen = getGeneration(genNum);
  if (!gen) return;

  try {
   
    const ersteIDs = generateIDs(gen.start, Math.min(gen.start + 9, gen.ende)); 
    await loadPokemonData(ersteIDs); 

    if (gen.ende > gen.start + 9) {

      loadRemainingPokemonParallel(gen.start + 10, gen.ende);
    }
  } catch (error) {
    handleError(error, spinner);
  }
}



function showSpinner(visible, spinner) {
  spinner.style.display = visible ? "flex" : "none";
}


function getGeneration(genNum) {
  const generationNum = Number(genNum);
  const gen = generationen[generationNum];
  if (!gen) {
    alert("Diese Generation gibt es nicht.");
    return null;
  }
  return gen;
}


async function loadPokemonData(ids) {
  const pokemonData = await Promise.allSettled(ids.map(id => loadPokemonWithGermanName(id)));
  allPokemonData = pokemonData.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return createErrorPokemon(ids[i], result.reason);
  });

  alreadyDisplayed = 0;
  renderPokedex(); 
  showSpinner(false, document.getElementById("spinner"));
}


function handleError(error, spinner) {
  showErrorMessage(error); 
  showSpinner(false, spinner);
}


function generateIDs(start, ende) {
  const ids = [];
  for (let i = start; i <= ende; i++) {
    ids.push(i);
  }
  return ids;
}


async function loadRemainingPokemonParallel(startID, endID) {
  const loadingBar = document.getElementById("loading_bar_container");
  loadingBar.style.display = "block";

  const ids = generateIDs(startID, endID);
  
  const blockResults = await Promise.allSettled(
    ids.map(id => loadPokemonWithGermanName(id))
  );

  const blockData = blockResults.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return createErrorPokemon(ids[i], result.reason);
  });

  allPokemonData = allPokemonData.concat(blockData);
  renderPokedex();

  loadingBar.style.display = "none";
}



async function loadAndProcessBlock(ids, loadingBar, callback) {
  try {
    const blockData = await Promise.all(ids.map(id => loadPokemonWithGermanName(id)));
    updatePokedexWithBlock(blockData);
    callback();
  } catch (error) {
    console.error("Fehler beim Blockladen:", error);
    loadingBar.style.display = "none";
  }
}


function createErrorPokemon(id, fehler) {
  return {
    id,
    name: "Fehler",
    germanName: "Unbekannt",
    sprites: {
      front_default: "./assets/img/placeholder_error.png", 
    },
    types: [{ type: { name: "unknown" } }],
    error: true,
    errorMessage: fehler?.message || "Fehler beim Laden",
    species: { name: "unbekannt" },
    height: "–",
    weight: "–",
    abilities: [],
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    maxStats: { hp: 1, attack: 1, defense: 1, speed: 1 },
   evolutionChain: []
  };
}



function updatePokedexWithBlock(blockData) {
  allPokemonData = allPokemonData.concat(blockData);
  renderPokedex(blockData.length);
}

function calculateIDBlock(start, end, groesse) {
  const ids = [];
  for (let i = start; i < start + groesse && i <= end; i++) {
    ids.push(i);
  }
  return ids;
}


async function loadPokemonWithGermanName(id) {
  try {
    const [pokemonData, speciesDaten] = await loadPokemonAndSpecies(id);
    const germanName = findGermanNames(speciesDaten, pokemonData);
    const values = extractValues(pokemonData);
    const maxvalues = calculationMaxValue(pokemonData);
    const evolutionChain = await loadEvolution(speciesDaten, id);

    return {
      ...pokemonData,
      germanName,
      ...values,
      maxStats: maxvalues,
     evolutionChain
    };
  } catch (error) {
    console.error(`Fehler beim Laden von Pokémon ID ${id}:`, error);
    throw error;  
  }
}


async function loadPokemonAndSpecies(id) {
  const [pokemon, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r => r.json())
  ]);
  return [pokemon, species];
}


function findGermanNames(species, fallbackData) {
  const entry = species.names.find(n => n.language.name === "de");
  return entry ? entry.name : fallbackData.name;
}


function extractValues(pokemonData) {
  const values = {};
  pokemonData.stats.forEach(s => {
    if (["hp", "attack", "defense", "speed"].includes(s.stat.name)) {
      values[s.stat.name] = s.base_stat;
    }
  });
  return values;
}


async function loadEvolution(speciesDaten, id) {
  try {
    const evoUrl = speciesDaten.evolution_chain.url;
    const evoData = await fetch(evoUrl).then(r => r.json());
    return await extractEvolutionChainWithGerman(evoData.chain);
  } catch (e) {
    console.warn(`Keine Evolution für Pokémon-ID ${id}:`, e.message);
    return [];
  }
}


async function extractEvolutionChainWithGerman(chain) {
  const namen = [];
  let current = chain;
  while (current) {
    const name = await getGermanNames(current);
    namen.push(name);
    current = current.evolves_to[0] || null;
  }
  return namen;
}


async function getGermanNames(node) {
  try {
    const res = await fetch(node.species.url);
    const data = await res.json();
    const entry = data.names.find(n => n.language.name === "de");
    return entry ? entry.name : node.species.name;
  } catch (e) {
    console.warn("Fehler beim Laden deutscher Namen:", e.message);
    return node.species.name;
  }
}

function calculationMaxValue(pokemon) {
  const maxvalues = {};
  pokemon.stats.forEach(statObj => {
    const base = statObj.base_stat;
    const name = statObj.stat.name;
    if (name === "hp") {
      maxvalues.hp = 2 * base + 204;
    } else if (["attack", "defense", "speed"].includes(name)) {
      maxvalues[name] = Math.floor((2 * base + 104) * 1.1);
    }
  });
  return maxvalues;
}


function getStatColorClass(wert, max) {
  const percent = (wert / max) * 100;
  if (percent >= 70) return "progress_high";
  if (percent >= 40) return "progress_medium";
  return "progress_low";
}


function showNextPokemon(number) {
  const container = document.getElementById("pokemonData");
  for (let i = alreadyDisplayed; i < alreadyDisplayed + number && i < allPokemonData.length; i++) {
    const data = allPokemonData[i];
  renderPokedex(number);
     }
  alreadyDisplayed += number;
}


function showErrorMessage(error) {
  console.error("Fehler beim Laden:", error);

  const errorDiv = document.getElementById("fehlerAnzeige");
  if (errorDiv) {
    errorDiv.textContent = "Fehler beim Laden: " + error.message;
    errorDiv.style.display = "block";
  }
}