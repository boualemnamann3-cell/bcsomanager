/* =====================================
   BCSO MANAGER - AGENTS
===================================== */

let agents = [];
let agentEnModification = null;

// ==============================
// DROITS UTILISATEUR
// ==============================

function estCommandement() {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );

    if (!utilisateur) return false;

    return [
        "Sheriff",
        "Undersheriff",
        "Captain"
    ].includes(utilisateur.role);

}

// ==============================
// INITIALISATION
// ==============================

window.onload = () => {

    chargerAgents();

    const recherche = document.getElementById("search");

    if (recherche) {
        recherche.addEventListener("input", rechercherAgents);
    }

    const formulaire = document.getElementById("formAgent");

    if (formulaire) {
        formulaire.addEventListener("submit", enregistrerAgent);
    }

};

// ==============================
// CHARGER LES AGENTS
// ==============================

async function chargerAgents() {

    try {

        const reponse = await fetch(
            "/api/agents"
        );

        agents = await reponse.json();

        afficherAgents();

    }

    catch (erreur) {

        console.error(erreur);

    }

}
// ==============================
// ORDRE DES GRADES
// ==============================

const ordreGrades = [
    "Sheriff",
    "Undersheriff",
    "Commandant",
    "Captain",
    "Lieutenant",
    "Sergeant II",
    "Sergeant I",
    "Deputy Senior",
    "Deputy III",
    "Deputy II",
    "Deputy I",
    "Rookie"
];

function trierAgentsParGrade(liste) {

    return [...liste].sort((a, b) => {

        const gradeA = ordreGrades.indexOf(a.grade);
        const gradeB = ordreGrades.indexOf(b.grade);

        const ordreA = gradeA === -1 ? 999 : gradeA;
        const ordreB = gradeB === -1 ? 999 : gradeB;

        if (ordreA !== ordreB) {
            return ordreA - ordreB;
        }

        return (a.nom || "").localeCompare(b.nom || "");

    });

}

// ==============================
// AFFICHER LES AGENTS
// ==============================

function afficherAgents(liste = agents) {

    liste = trierAgentsParGrade(liste);

    const tbody = document.getElementById("listeAgents");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (liste.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="11" class="center">
                Aucun agent trouvé.
            </td>
        </tr>
        `;

        return;

    }

    liste.forEach(agent => {

        let boutons = `
            <button class="btn-action btn-consulter"
                onclick="consulterAgent(${agent.id})">
                <i class="fa-solid fa-eye"></i>
            </button>
        `;

        if (estCommandement()) {

            boutons += `
                <button class="btn-action btn-accepter"
                    onclick="modifierAgent(${agent.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="btn-action btn-refuser"
                    onclick="supprimerAgent(${agent.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

        }

        tbody.innerHTML += `

        <tr>

            <td>${agent.matricule || ""}</td>

            <td>${agent.nom || ""}</td>

            <td>${agent.prenom || ""}</td>

            <td>${agent.grade || ""}</td>

            <td style="text-align:center;">
                <input type="checkbox"
                    ${agent.etat_major ? "checked" : ""}
                    onchange="changerUnite(${agent.id},'etat_major',this.checked)">
            </td>

            <td style="text-align:center;">
                <input type="checkbox"
                    ${agent.mary_hp ? "checked" : ""}
                    onchange="changerUnite(${agent.id},'mary_hp',this.checked)">
            </td>

            <td style="text-align:center;">
                <input type="checkbox"
                    ${agent.k9 ? "checked" : ""}
                    onchange="changerUnite(${agent.id},'k9',this.checked)">
            </td>

            <td style="text-align:center;">
                <input type="checkbox"
                    ${agent.cid ? "checked" : ""}
                    onchange="changerUnite(${agent.id},'cid',this.checked)">
            </td>

            <td style="text-align:center;">
                <input type="checkbox"
                    ${agent.amd ? "checked" : ""}
                    onchange="changerUnite(${agent.id},'amd',this.checked)">
            </td>

            <td style="text-align:center;">
                <input type="checkbox"
                    ${agent.sheriff_academy ? "checked" : ""}
                    onchange="changerUnite(${agent.id},'sheriff_academy',this.checked)">
            </td>

            <td>
                <span class="badge-statut">
                    ${agent.statut || ""}
                </span>
            </td>

            <td class="actions">
                ${boutons}
            </td>

        </tr>

        `;

    });

}
// ==============================
// RECHERCHE AGENTS
// ==============================

function rechercherAgents() {

    const texte = document
        .getElementById("search")
        .value
        .toLowerCase();

    const resultat = agents.filter(agent => {

        return (

            (agent.matricule || "")
            .toLowerCase()
            .includes(texte)

            ||

            (agent.nom || "")
            .toLowerCase()
            .includes(texte)
            ||

             (agent.prenom || "")
            .toLowerCase()
            .includes(texte)

            ||

            (agent.grade || "")
            .toLowerCase()
            .includes(texte)

            ||

            (agent.statut || "")
            .toLowerCase()
            .includes(texte)

        );

    });

    afficherAgents(resultat);

}

// ==============================
// AJOUTER UN AGENT
// ==============================

function ajouterAgent() {

    agentEnModification = null;

    document.getElementById("formAgent").reset();

    document.getElementById("etat_major").checked = false;
    document.getElementById("mary_hp").checked = false;
    document.getElementById("k9").checked = false;
    document.getElementById("cid").checked = false;
    document.getElementById("amd").checked = false;
    document.getElementById("sheriff_academy").checked = false;

    document.getElementById("matricule").disabled = false;

    document.getElementById("modalAgent")
        .classList.remove("hidden");

}

// ==============================
// FERMER MODAL
// ==============================

function fermerModal() {

    document.getElementById("modalAgent")
        .classList.add("hidden");

    document.getElementById("formAgent").reset();

    document.getElementById("etat_major").checked = false;
    document.getElementById("mary_hp").checked = false;
    document.getElementById("k9").checked = false;
    document.getElementById("cid").checked = false;
    document.getElementById("amd").checked = false;
    document.getElementById("sheriff_academy").checked = false;

    document.getElementById("matricule").disabled = false;

    agentEnModification = null;

}
// ==============================
// MODIFIER UN AGENT
// ==============================

function modifierAgent(id) {

    agentEnModification = agents.find(a => a.id === id);

    if (!agentEnModification) return;

    document.getElementById("matricule").value =
        agentEnModification.matricule || "";

    document.getElementById("nom").value =
        agentEnModification.nom || "";

    document.getElementById("prenom").value =
    agentEnModification.prenom || ""; 

    document.getElementById("grade").value =
        agentEnModification.grade || "";

    document.getElementById("telephone").value =
        agentEnModification.telephone || "";

    document.getElementById("statut").value =
        agentEnModification.statut || "";

    document.getElementById("etat_major").checked =
        !!agentEnModification.etat_major;

    document.getElementById("mary_hp").checked =
        !!agentEnModification.mary_hp;

    document.getElementById("k9").checked =
        !!agentEnModification.k9;

    document.getElementById("cid").checked =
        !!agentEnModification.cid;

    document.getElementById("amd").checked =
        !!agentEnModification.amd;

    document.getElementById("sheriff_academy").checked =
        !!agentEnModification.sheriff_academy;

    document.getElementById("modalAgent")
        .classList.remove("hidden");

}
// ==============================
// ENREGISTRER UN AGENT
// ==============================

async function enregistrerAgent(e){

    e.preventDefault();
const matricule = document.getElementById("matricule").value.trim();
const nom = document.getElementById("nom").value.trim();
const prenom = document.getElementById("prenom").value.trim();

const agent = {

    matricule,

    nom,

    prenom,

    identifiant: nom,

    code: "BCSO" + matricule,

    grade: document.getElementById("grade").value,

    telephone: document.getElementById("telephone").value.trim(),

    statut: document.getElementById("statut").value,

    badge: document.getElementById("badge").value.trim(),

    dateEntree: document.getElementById("dateEntree").value,

    superieur: document.getElementById("superieur").value.trim(),

    datePromotion: document.getElementById("datePromotion").value,

    notes: document.getElementById("notes").value,

    etat_major: document.getElementById("etat_major").checked ? 1 : 0,

    mary_hp: document.getElementById("mary_hp").checked ? 1 : 0,

    k9: document.getElementById("k9").checked ? 1 : 0,

    cid: document.getElementById("cid").checked ? 1 : 0,

    amd: document.getElementById("amd").checked ? 1 : 0,

    sheriff_academy: document.getElementById("sheriff_academy").checked ? 1 : 0

};

    const url = agentEnModification

        ? `/api/agents/${agentEnModification.id}`

        : "/api/agents";

    const methode = agentEnModification ? "PUT" : "POST";

    try{

        const reponse = await fetch(url,{

            method:methode,

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(agent)

        });

        const resultat = await reponse.json();

        if(!reponse.ok){

            alert(resultat.message || "Erreur");

            return;

        }

        fermerModal();

        chargerAgents();

        alert(agentEnModification ? "Agent modifié." : "Agent ajouté.");

    }

    catch(err){

        console.error(err);

        alert("Erreur serveur.");

    }

}
// ==============================
// CONSULTER AGENT
// ==============================

function consulterAgent(id){

    const agent = agents.find(a => a.id === id);

    if(!agent) return;

    localStorage.setItem(
        "agentSelectionne",
        JSON.stringify(agent)
    );

    window.location.href = "agent.html";

}

// ==============================
// SUPPRIMER UN AGENT
// ==============================

async function supprimerAgent(id) {



    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }





    const agent =
        agents.find(
            a => a.id === id
        );



    if (!agent) return;





    if (
        !confirm(
            `Supprimer ${agent.nom} ?`
        )
    ) return;






    try {



        const reponse = await fetch(

            `/api/agents/${id}`,

            {

                method: "DELETE"

            }

        );





        if (!reponse.ok) {


            throw new Error();


        }





        chargerAgents();



        alert(
            "Agent supprimé."
        );





    } catch (erreur) {


        console.error(erreur);


        alert(
            "Impossible de supprimer l'agent."
        );


    }


}
// ==============================
// CHANGER UNE UNITE
// ==============================

async function changerUnite(id, colonne, valeur) {

    try {

        const reponse = await fetch(

            `/api/agents/${id}/unite`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    colonne,

                    valeur

                })

            }

        );

        if (!reponse.ok) {

            throw new Error("Erreur serveur");

        }

        const agent = agents.find(a => a.id === id);

        if (agent) {

            agent[colonne] = valeur ? 1 : 0;

        }

    }

    catch (erreur) {

        console.error(erreur);

        alert("Impossible de modifier l'affectation.");

        chargerAgents();

    }

}
// ==============================
// ARMES ATTRIBUÉES
// ==============================

async function chargerArmesAgent() {
console.log("Agent :", agent.id);
    try {

        const reponse = await fetch(
            `/api/attributions/${agent.id}`
        );

        const armes = await reponse.json();
console.log("Armes reçues :", armes);
        const zone = document.getElementById("armesAgent");

        if (!armes.length) {

            zone.innerHTML = "Aucune arme attribuée.";

            return;

        }

        zone.innerHTML = "";

        armes.forEach(a => {

            zone.innerHTML += `

                <div class="arme-card">

                    <h3>${a.nom}</h3>

                    <p><strong>Type :</strong> ${a.type}</p>

                    <p><strong>Calibre :</strong> ${a.calibre}</p>

                    <p><strong>Quantité :</strong> ${a.quantite}</p>

                </div>

            `;

        });

    } catch (e) {

        console.error(e);

    }

}

chargerArmesAgent();

