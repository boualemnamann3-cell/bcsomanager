// =====================================
// BCSO MANAGER - ARMURERIE
// =====================================

let armes = [];

// ==============================
// Démarrage
// ==============================

window.onload = async function () {

    await chargerArmes();

    initialiserRecherche();

};

// ==============================
// Charger les armes
// ==============================

async function chargerArmes() {

    const response = await fetch("data/armes.json");

    armes = await response.json();

    afficherArmes();

}

// ==============================
// Affichage
// ==============================

function afficherArmes() {

    const tbody = document.getElementById("listeArmes");

    tbody.innerHTML = "";

    armes.forEach((arme, index) => {

        tbody.innerHTML += `

<tr>

<td>${arme.id}</td>

<td>${arme.nom}</td>

<td>${arme.categorie}</td>

<td>${arme.numeroSerie}</td>

<td>${arme.etat}</td>

<td>

<button onclick="attribuerArme(${index})">👮</button>

<button onclick="modifierArme(${index})">✏️</button>

<button onclick="supprimerArme(${index})">❌</button>

</td>

</tr>

`;

    });

}

// ==============================
// Recherche
// ==============================

function initialiserRecherche() {

    const recherche = document.getElementById("searchArme");

    if (!recherche) return;

    recherche.addEventListener("keyup", function () {

        const filtre = this.value.toLowerCase();

        document.querySelectorAll("#listeArmes tr").forEach(ligne => {

            ligne.style.display =
                ligne.innerText.toLowerCase().includes(filtre)
                ? ""
                : "none";

        });

    });

}

// ==============================
// Attribuer
// ==============================

let armeSelectionnee = null;

async function attribuerArme(index) {

    armeSelectionnee = index;

    await remplirListeAgents();

    document.getElementById("dateAttribution").value =
        new Date().toISOString().split("T")[0];

    document.getElementById("popupAttribution").style.display = "block";

}

}
// ==============================
// Modifier
// ==============================

function modifierArme(index) {

    alert("Modification de : " + armes[index].nom);

}

// ==============================
// Supprimer
// ==============================

function supprimerArme(index) {

    if (!confirm("Supprimer cette arme ?")) return;

    armes.splice(index, 1);

    afficherArmes();

}
function fermerPopupAttribution() {

    document.getElementById("popupAttribution").style.display = "none";

}

function validerAttribution() {

    alert("Attribution bientôt disponible.");

    fermerPopupAttribution();

}
async function remplirListeAgents() {

    const liste = document.getElementById("listeAgentsArme");

    if (!liste) return;

    const agents = await chargerAgents();

    liste.innerHTML = "";

    agents.forEach(agent => {

        liste.innerHTML += `
            <option value="${agent.matricule}">
                ${agent.grade} - ${agent.nom} (${agent.matricule})
            </option>
        `;

    });

}
