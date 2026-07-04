// =====================================
// BCSO MANAGER - AGENTS
// =====================================

let agents = [];

// ==============================
// Démarrage
// ==============================

window.onload = async function () {

    agents = await chargerAgents();

    afficherAgents();

    recherche();

};

// ==============================
// Affichage des agents
// ==============================

function afficherAgents() {

    const tbody = document.getElementById("listeAgents");

    tbody.innerHTML = "";

    agents.forEach((agent, index) => {

        tbody.innerHTML += `
        <tr>

            <td>${agent.matricule}</td>
            <td>${agent.nom}</td>
            <td>${agent.grade}</td>
            <td>${agent.unite}</td>
            <td>${agent.statut}</td>

            <td>

                <button onclick="ouvrirAgent(${index})">📂</button>

                <button onclick="modifierAgent(${index})">✏️</button>

                <button onclick="supprimerAgent(${index})">❌</button>

            </td>

        </tr>
        `;

    });

}

// ==============================
// Recherche
// ==============================

function recherche() {

    const input = document.getElementById("search");

    if (!input) return;

    input.addEventListener("keyup", function () {

        const filtre = input.value.toLowerCase();

        document.querySelectorAll("#listeAgents tr").forEach(ligne => {

            ligne.style.display =
                ligne.innerText.toLowerCase().includes(filtre)
                ? ""
                : "none";

        });

    });

}

// ==============================
// Ouvrir le dossier
// ==============================

function ouvrirAgent(index) {

    localStorage.setItem(
        "agentSelectionne",
        JSON.stringify(agents[index])
    );

    window.location.href = "agent.html";

}

// ==============================
// Modifier
// ==============================

function modifierAgent(index) {

    alert("Modification de " + agents[index].nom);

}

// ==============================
// Supprimer
// ==============================

function supprimerAgent(index) {

    if (!confirm("Supprimer cet agent ?")) return;

    agents.splice(index, 1);

    sauvegarderAgents(agents);

    afficherAgents();

}

// ==============================
// Popup
// ==============================

function ouvrirPopup() {

    document.getElementById("popupAgent").style.display = "block";

}

function fermerPopup() {

    document.getElementById("popupAgent").style.display = "none";

}

// ==============================
// Ajouter un agent
// ==============================

async function enregistrerAgent() {

    agents = await chargerAgents();

    const nouvelAgent = {

        matricule: document.getElementById("newMatricule").value,
        nom: document.getElementById("newNom").value,
        grade: document.getElementById("newGrade").value,
        unite: document.getElementById("newUnite").value,

        telephone: document.getElementById("newTelephone").value,
        badge: document.getElementById("newBadge").value,
        dateEntree: document.getElementById("newDateEntree").value,

        statut: "Actif",

        armes: [],
        vehicules: [],
        formations: [],
        sanctions: [],
        recompenses: [],
        rapports: []

    };

    agents.push(nouvelAgent);

    sauvegarderAgents(agents);

    fermerPopup();

    afficherAgents();

}