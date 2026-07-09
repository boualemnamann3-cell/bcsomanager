// =====================================
// BCSO MANAGER - FICHE AGENT
// =====================================

const agent = JSON.parse(
    localStorage.getItem("agentSelectionne")
);

if (!agent) {

    alert("Aucun agent sélectionné.");

    window.location.href = "agents.html";

}

// ==============================
// REMPLISSAGE DE LA FICHE
// ==============================

document.getElementById("nomAgent").textContent =
    `${agent.prenom || ""} ${agent.nom || ""}`.trim();

document.getElementById("matriculeAgent").textContent =
    agent.matricule || "";

document.getElementById("gradeAgent").textContent =
    agent.grade || "";

document.getElementById("telephoneAgent").textContent =
    agent.telephone || "";

document.getElementById("statutAgent").textContent =
    agent.statut || "";

document.getElementById("badgeAgent").textContent =
    agent.badge || "Aucun";

document.getElementById("dateRecrutement").textContent =
    agent.dateEntree || "Non renseignée";

document.getElementById("superieurAgent").textContent =
    agent.superieur || "Non renseigné";

document.getElementById("promotionAgent").textContent =
    agent.datePromotion || "Non renseignée";
    

document.getElementById("notesAgent").value =
    agent.notes || "";

    document.getElementById("identifiantCarte").textContent =
    agent.identifiant || "";

document.getElementById("codeCarte").textContent =
    agent.code || "";

// ==============================
// COMPTE BCSO
// ==============================

function copierIdentifiant() {

    if (!agent.identifiant) {
        alert("Aucun identifiant.");
        return;
    }

    navigator.clipboard.writeText(agent.identifiant);

    alert("Identifiant copié.");

}

function copierCode() {

    if (!agent.code) {
        alert("Aucun code.");
        return;
    }

    navigator.clipboard.writeText(agent.code);

    alert("Code copié.");

}

// ==============================
// PHOTO
// ==============================

if (agent.photo) {

    document.getElementById("photoAgent").src =
        agent.photo;

}

// ==============================
// UNITÉS
// ==============================

document.getElementById("fiche_etat_major").checked =
    !!agent.etat_major;

document.getElementById("fiche_mary_hp").checked =
    !!agent.mary_hp;

document.getElementById("fiche_k9").checked =
    !!agent.k9;

document.getElementById("fiche_cid").checked =
    !!agent.cid;

document.getElementById("fiche_amd").checked =
    !!agent.amd;

document.getElementById("fiche_sheriff_academy").checked =
    !!agent.sheriff_academy;
    // ==============================
// ARMES ATTRIBUÉES
// ==============================

async function chargerArmesAgent() {

    try {

        const reponse = await fetch(
            `http://localhost:3000/api/attributions/${agent.id}`
        );

        const armes = await reponse.json();

        console.log("Agent :", agent.id);
        console.log("Armes :", armes);

        const zone = document.getElementById("armesAgent");

        if (!zone) return;

        if (!armes.length) {

            zone.innerHTML = "<p>Aucune arme attribuée.</p>";

            return;

        }

        zone.innerHTML = "";

        armes.forEach(arme => {

            zone.innerHTML += `

<div class="arme-card">

    <h3>${arme.nom}</h3>

    <p><strong>Type :</strong> ${arme.type}</p>

    <p><strong>Calibre :</strong> ${arme.calibre}</p>

    <p><strong>Quantité :</strong> ${arme.quantite}</p>

    <p><strong>Attribuée le :</strong> ${arme.date_attribution}</p>

    <button
    class="btn-principal"
    onclick="restituerArme(${arme.attribution_id});">

    <i class="fa-solid fa-rotate-left"></i>
    Restituer

</button>

</div>

`;

        });

    } catch (e) {

        console.error(e);

    }

}

chargerArmesAgent();
// ==============================
// RESTITUER UNE ARME
// ==============================
async function restituerArme(id){

    if(!confirm("Supprimer cette attribution ?")) return;

    try{

        const reponse = await fetch(

            `http://localhost:3000/api/attributions/supprimer/${id}`,

            {

                method:"DELETE"

            }

        );

        const resultat = await reponse.json();

        alert(resultat.message);

        chargerArmesAgent();

    }

    catch(e){

        console.error(e);

    }

}
// ==========================
// ARCHIVER UN AGENT
// ==========================

async function archiverAgent() {

    const confirmation = confirm(
        `Voulez-vous vraiment archiver ${agent.prenom} ${agent.nom} ?`
    );

    if (!confirmation) return;

    try {

        const reponse = await fetch(
            `http://localhost:3000/api/agents/${agent.id}/archive`,
            {
                method: "PUT"
            }
        );

        const resultat = await reponse.json();

        alert(resultat.message);

        window.location.href = "agents.html";

    } catch (e) {

        console.error(e);

        alert("Impossible d'archiver l'agent.");

    }

}
function toggleMenuActions() {

    document
        .getElementById("menuActions")
        .classList
        .toggle("hidden");

}