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


let allePokemonDaten = [];
let bereitsAngezeigt = 0;
let letzteErfolgreicheGeneration = 1;


async function ladeGeneration(genNum) {
  const spinner = document.getElementById("spinner");
  backToPokedex(); 
  zeigeSpinner(true, spinner); 

  const gen = getGeneration(genNum); 
  if (!gen) return; 

  try {
    const ersteIDs = generiereIDs(gen.start, Math.min(gen.start + 9, gen.ende));
    await ladePokemonDaten(ersteIDs);
    if (gen.ende > gen.start + 9) {
      ladeRestlichePokemonParallel(gen.start + 10, gen.ende, 50);
    }
  } catch (error) {
    handleError(error, spinner); 
  }
}


function zeigeSpinner(visible, spinner) {
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


async function ladePokemonDaten(ersteIDs) {
  const ersteDaten = await Promise.allSettled(ersteIDs.map(id => ladePokemonMitDeutschemNamen(id)));
  allePokemonDaten = ersteDaten.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return erstelleFehlerPokemon(ersteIDs[i], result.reason);
  });

  bereitsAngezeigt = 0;
  renderPokedex(); 
  zeigeSpinner(false, document.getElementById("spinner"));
}


function handleError(error, spinner) {
  zeigeFehlermeldung(error); 
  zeigeSpinner(false, spinner);
}


function generiereIDs(start, ende) {
  const ids = [];
  for (let i = start; i <= ende; i++) {
    ids.push(i);
  }
  return ids;
}


async function ladeRestlichePokemonParallel(startID, endID) {
  const ladebalken = document.getElementById("loading_bar_container");
  ladebalken.style.display = "block";

  const ids = [];
  for (let i = startID; i <= endID; i++) {
    ids.push(i);
  }

  const blockErgebnisse = await Promise.allSettled(
    ids.map(id => ladePokemonMitDeutschemNamen(id))
  );

  const blockDaten = blockErgebnisse.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return erstelleFehlerPokemon(ids[i], result.reason);
  });

  allePokemonDaten = allePokemonDaten.concat(blockDaten);
  renderPokedex();

  ladebalken.style.display = "none";
}


async function ladeUndVerarbeiteBlock(ids, ladebalken, callback) {
  try {
    const blockDaten = await Promise.all(ids.map(id => ladePokemonMitDeutschemNamen(id)));
    aktualisierePokedexMitBlock(blockDaten);
    callback();
  } catch (error) {
    console.error("Fehler beim Blockladen:", error);
    ladebalken.style.display = "none";
  }
}


function erstelleFehlerPokemon(id, fehler) {
  return {
    id,
    name: "Fehler",
    deutscherName: "Unbekannt",
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
    evolutionKette: []
  };
}


function aktualisierePokedexMitBlock(blockDaten) {
  allePokemonDaten = allePokemonDaten.concat(blockDaten);
  renderPokedex(blockDaten.length);
}

function berechneIDBlock(start, end, groesse) {
  const ids = [];
  for (let i = start; i < start + groesse && i <= end; i++) {
    ids.push(i);
  }
  return ids;
}


async function ladePokemonMitDeutschemNamen(id) {
  try {
    const [pokemonDaten, speciesDaten] = await ladePokemonUndSpecies(id);
    const deutscherName = findeDeutschenNamen(speciesDaten, pokemonDaten);
    const werte = extrahiereWerte(pokemonDaten);
    const maxWerte = berechnungMaxWert(pokemonDaten);
    const evolutionKette = await ladeEvolution(speciesDaten, id);

    return {
      ...pokemonDaten,
      deutscherName,
      ...werte,
      maxStats: maxWerte,
      evolutionKette
    };
  } catch (error) {
    console.error(`Fehler beim Laden von Pokémon ID ${id}:`, error);
    throw error;  
  }
}


async function ladePokemonUndSpecies(id) {
  const [pokemon, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r => r.json())
  ]);
  return [pokemon, species];
}


function findeDeutschenNamen(species, fallbackDaten) {
  const eintrag = species.names.find(n => n.language.name === "de");
  return eintrag ? eintrag.name : fallbackDaten.name;
}


function extrahiereWerte(pokemonDaten) {
  const werte = {};
  pokemonDaten.stats.forEach(s => {
    if (["hp", "attack", "defense", "speed"].includes(s.stat.name)) {
      werte[s.stat.name] = s.base_stat;
    }
  });
  return werte;
}


async function ladeEvolution(speciesDaten, id) {
  try {
    const evoUrl = speciesDaten.evolution_chain.url;
    const evoDaten = await fetch(evoUrl).then(r => r.json());
    return await extrahiereEvolutionKetteMitDeutsch(evoDaten.chain);
  } catch (e) {
    console.warn(`Keine Evolution für Pokémon-ID ${id}:`, e.message);
    return [];
  }
}


async function extrahiereEvolutionKetteMitDeutsch(chain) {
  const namen = [];
  let aktuelles = chain;
  while (aktuelles) {
    const name = await holeDeutschenNamen(aktuelles);
    namen.push(name);
    aktuelles = aktuelles.evolves_to[0] || null;
  }
  return namen;
}


async function holeDeutschenNamen(knoten) {
  try {
    const res = await fetch(knoten.species.url);
    const data = await res.json();
    const eintrag = data.names.find(n => n.language.name === "de");
    return eintrag ? eintrag.name : knoten.species.name;
  } catch (e) {
    console.warn("Fehler beim Laden deutscher Namen:", e.message);
    return knoten.species.name;
  }
}

function berechnungMaxWert(pokemon) {
  const maxWerte = {};
  pokemon.stats.forEach(statObj => {
    const base = statObj.base_stat;
    const name = statObj.stat.name;
    if (name === "hp") {
      maxWerte.hp = 2 * base + 204;
    } else if (["attack", "defense", "speed"].includes(name)) {
      maxWerte[name] = Math.floor((2 * base + 104) * 1.1);
    }
  });
  return maxWerte;
}


function getStatColorClass(wert, max) {
  const prozent = (wert / max) * 100;
  if (prozent >= 70) return "progress_high";
  if (prozent >= 40) return "progress_medium";
  return "progress_low";
}


function zeigeNaechstePokemon(anzahl) {
  const container = document.getElementById("pokemonDaten");
  for (let i = bereitsAngezeigt; i < bereitsAngezeigt + anzahl && i < allePokemonDaten.length; i++) {
    const data = allePokemonDaten[i];
  renderPokedex(anzahl);
     }
  bereitsAngezeigt += anzahl;
}


function zeigeFehlermeldung(error) {
  console.error("Fehler beim Laden:", error);

  const fehlerDiv = document.getElementById("fehlerAnzeige");
  if (fehlerDiv) {
    fehlerDiv.textContent = "Fehler beim Laden: " + error.message;
    fehlerDiv.style.display = "block";
  }
}