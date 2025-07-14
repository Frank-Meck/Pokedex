
function getPokedex(index) {
  const p = allePokemonDaten[index];
  return `
<div class="pdex_box" onclick="startShowSingleCard(${index})">
        <div class="pdex_gaming">
        </div>
        <div class="pdex_topic">
            <div>id : ${p.id}</div>
            <div>${p.deutscherName}</div>
            <div></div>
        </div>
        <div class="pdex_img">
            <div>
                <img class="pdex_image_tuer" src="./assets/icon/Tuer.png">
                <img class="pdex_image pokedex_btn_${p.types[0].type.name}" src="${p.sprites.front_default}">
            </div>
        </div>
        <div class="pokedex_category" id="id_pokedex_category${index}"></div>
    </div>
    `;
}


function getPokedexFailure(index) {
  const p = allePokemonDaten[index];
  return `
<div class="pdex_box" onclick="startShowSingleCard(${index})">
        <div class="pdex_gaming">
        </div>
        <div class="pdex_topic">
            <div>id : ${p.id}</div>
            <div>${p.deutscherName}</div>
            <div></div>
        </div>
        <div class="pdex_img">
            <div>
                <img class="pdex_image_tuer" src="./assets/icon/Tuer.png">
                <img class="pdex_image pokedex_btn_${p.types[0].type.name}" src="./assets/icon/Fehler beim Laden.png">
            </div>
        </div>
        <div class="pokedex_category" id="id_pokedex_category${index}"></div>
    </div>
    `;
}


function getPokedexCategory(index, indexTyps) {
  const typeName = allePokemonDaten[index].types[indexTyps].type.name;
  return `<button class="pokedex_btn_${typeName} pokedex_btn_category">${typeName}</button>`;
}


function getSingleCard(index) {
  const p = allePokemonDaten[index];
  return `
  <div class="inner_overlay">
        <div class="singlepdex_box">
            <div class="singlepdex_topic">
                <div>
                    <p>id ${p.id}</p>
                </div>
                <div>
                    <p>${p.deutscherName}</p>
                </div>
            </div>
            <div class="singlepdex_img">
                <img class="singlepdex_image pokedex_btn_${p.types[0].type.name}" src="${p.sprites.front_default}">
            </div>
            <div class="singlepdex_characteristics" id="id_singlepdex_characteristics_${index}">
            </div>
            <div class="simplex_main">
                <button onclick="changeContainer(1)" class="singlepdex_menue singlepdex_menue_one"
                    id="idcontainer_menue_main">main</button>
                <button onclick="changeContainer(2)" class="singlepdex_menue singlepdex_menue_two"
                    id="idcontainer_menue_static">stats</button>
                <button onclick="changeContainer(3)" class="singlepdex_menue singlepdex_menue_three"
                    id="idcontainer_menue_evochain">evo chain</button>
            </div>
            <div class="singlepdex_main" id="idsinglepdex_main">
                <br><br><br>
                <p> Spezies : ${p.species.name}</p>
                <br>
                <p> Height : ${p.height}</p>
                <br>
                <p> Weight : ${p.weight}</p>
            </div>
            <div class="singlepdex_static" id="idsinglepdex_static">
                <br>
                <div class="singlepdex_progress_value">
                    <p>HP : ( ${p.hp} | max.: ${p.maxStats.hp} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.hp, p.maxStats.hp)}" value="${p.hp}"
                    max="${p.maxStats.hp}"></progress>
                <br><br>
                <div class="singlepdex_progress_value">
                    <p>ATTACK : ( ${p.attack} | max.: ${p.maxStats.attack} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.attack, p.maxStats.attack)}" value="${p.attack}"
                    max="${p.maxStats.hp}"></progress>
                <br><br>
                <div class="singlepdex_progress_value">
                    <p> DEFENSE :( ${p.defense} | max.:${p.maxStats.defense} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.defense, p.maxStats.defense)}" value="${p.defense}"
                    max="${p.maxStats.defense}"></progress>
                <br><br>
                <div class="singlepdex_progress_value">
                    <p> SPEED : ( ${p.speed} | max.:${p.maxStats.speed} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.speed, p.maxStats.speed)}" value="${p.speed}"
                    max="${p.maxStats.speed}"></progress>
            </div>
            <div id="idsinglepdex_evochain" class="singlepdex_evochain">
                <br>
                <p>Evolution:</p><br>
                ${p.evolutionKette.map((name, index) => {
                const istAktuell = name === p.deutscherName;
                return `
                <p class="evo_item evo-depth-${index} ${istAktuell ? " evo_current" : "" }">
                    ${index > 0 ? "→ " : ""}${name}
                </p>
                `;
                }).join("")}
            </div>
            <div class="singlepdex_bottom_button">
                <button class="singlepdex_button_back" style="" id="id_btn_previous" onclick="previousPokedex(${p.id})">
                    <<</button>
                        <button class="singlepdex_button" onclick="backToPokedex()">zurück</button>
                        <button class="singlepdex_button_forward" style="" id="id_btn_next"
                            onclick="nextPokedex(${p.id})">>></button>
            </div>
        </div>
    </div>
    
  `;
}


function  getSingleCardFailure(index) {
  const p = allePokemonDaten[index];
  return `
      <div class="inner_overlay">
        <div class="singlepdex_box">
            <div class="singlepdex_topic">
                <div>
                    <p>id ${p.id}</p>
                </div>
                <div>
                    <p>${p.deutscherName}</p>
                </div>
            </div>
            <div class="singlepdex_img">
                <img class="singlepdex_image pokedex_btn_${p.types[0].type.name}"
                    src="./assets/icon/Fehler beim Laden.png">
            </div>
            <div class="singlepdex_characteristics" id="id_singlepdex_characteristics_${index}">
            </div>
            <div class="simplex_main">
                <button onclick="changeContainer(1)" class="singlepdex_menue singlepdex_menue_one"
                    id="idcontainer_menue_main">main</button>
                <button onclick="changeContainer(2)" class="singlepdex_menue singlepdex_menue_two"
                    id="idcontainer_menue_static">stats</button>
                <button onclick="changeContainer(3)" class="singlepdex_menue singlepdex_menue_three"
                    id="idcontainer_menue_evochain">evo chain</button>
            </div>
            <div class="singlepdex_main" id="idsinglepdex_main">
                <br><br><br>
                <p> Spezies : ${p.species.name}</p>
                <br>
                <p> Height : ${p.height}</p>
                <br>
                <p> Weight : ${p.weight}</p>
            </div>
            <div class="singlepdex_static" id="idsinglepdex_static">
                <br>
                <div class="singlepdex_progress_value">
                    <p>HP : ( ${p.hp} | max.: ${p.maxStats.hp} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.hp, p.maxStats.hp)}" value="${p.hp}"
                    max="${p.maxStats.hp}"></progress>
                <br><br>
                <div class="singlepdex_progress_value">
                    <p>ATTACK : ( ${p.attack} | max.: ${p.maxStats.attack} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.attack, p.maxStats.attack)}" value="${p.attack}"
                    max="${p.maxStats.hp}"></progress>
                <br><br>
                <div class="singlepdex_progress_value">
                    <p> DEFENSE :( ${p.defense} | max.:${p.maxStats.defense} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.defense, p.maxStats.defense)}" value="${p.defense}"
                    max="${p.maxStats.defense}"></progress>
                <br><br>
                <div class="singlepdex_progress_value">
                    <p> SPEED : ( ${p.speed} | max.:${p.maxStats.speed} )</p>
                </div>
                <progress class="progess_bar ${getStatColorClass(p.speed, p.maxStats.speed)}" value="${p.speed}"
                    max="${p.maxStats.speed}"></progress>
            </div>
            <div id="idsinglepdex_evochain" class="singlepdex_evochain">
                <br>
                <p>Evolution:</p><br>
                ${p.evolutionKette.map((name, index) => {
                const istAktuell = name === p.deutscherName;
                return `
                <p class="evo_item evo-depth-${index} ${istAktuell ? " evo_current" : "" }">
                    ${index > 0 ? "→ " : ""}${name}
                </p>
                `;
                }).join("")}
            </div>
            <div class="singlepdex_bottom_button">
                <button class="singlepdex_button_back" style="" id="id_btn_previous" onclick="previousPokedex(${p.id})">
                    <<</button>
                        <button class="singlepdex_button" onclick="backToPokedex()">zurück</button>
                        <button class="singlepdex_button_forward" style="" id="id_btn_next"
                            onclick="nextPokedex(${p.id})">>></button>
            </div>
        </div>
    </div>
  `;
}

function getSearchError(searchString) {
  return `
    <div class="error">
      In dieser Generation konnte ich kein Pokémon mit <br><br>
      >> <span class="highlight">${searchString}</span> << <br><br>
      finden.<br><br>
      Bitte ändere die Suchanfrage oder lösche diese!
    </div>`;
}