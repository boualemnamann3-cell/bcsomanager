/* ==========================================
   BCSO MANAGER V2 - RAPPORTS
========================================== */

const API = "http://localhost:3000/api/rapports";

const utilisateur =
JSON.parse(localStorage.getItem("utilisateur")) || {};

let rapports = [];
let rapportEnCours = null;

// ==========================================
// INITIALISATION
// ==========================================

window.addEventListener("load", () => {

    chargerRapports();

    initialiserRecherche();

});

// ==========================================
// RECHERCHE
// ==========================================

function initialiserRecherche(){

    const recherche =
        document.getElementById("rechercheRapport");

    if(recherche){

        recherche.addEventListener(
            "input",
            afficherRapports
        );

    }

    const filtre =
        document.getElementById("filtreStatut");

    if(filtre){

        filtre.addEventListener(
            "change",
            afficherRapports
        );

    }

}

// ==========================================
// CHARGEMENT
// ==========================================

async function chargerRapports(){

    try{

        const rep = await fetch(API);

        rapports = await rep.json();

        mettreAJourStatistiques();

        afficherRapports();

    }

    catch(e){

        console.error(e);

        rapports=[];

        afficherRapports();

    }

}

// ==========================================
// STATISTIQUES
// ==========================================

function mettreAJourStatistiques(){

    document.getElementById("totalRapports").textContent =
        rapports.length;

    document.getElementById("totalAttente").textContent =
        rapports.filter(r=>r.statut==="En attente").length;

    document.getElementById("totalValides").textContent =
        rapports.filter(r=>r.statut==="Validé").length;

    document.getElementById("totalArchives").textContent =
        rapports.filter(r=>r.statut==="Archivé").length;

}

// ==========================================
// BADGE
// ==========================================

function badge(statut){

    switch(statut){

        case "Validé":

            return "#28a745";

        case "Archivé":

            return "#555";

        case "En attente":

            return "#2196F3";

        case "Refusé":

            return "#dc3545";

        default:

            return "#999";

    }

}

// ==========================================
// AFFICHAGE
// ==========================================

function afficherRapports(){

    const liste =
        document.getElementById("listeRapports");

    if(!liste) return;

    let data=[...rapports];

    const texte =
    document.getElementById("rechercheRapport")
    ?.value
    ?.toLowerCase() || "";

    if(texte){

        data=data.filter(r=>

            (r.numero||"").toLowerCase().includes(texte)

            ||

            (r.agent||"").toLowerCase().includes(texte)

            ||

            (r.suspect_nom||"").toLowerCase().includes(texte)

            ||

            (r.suspect_prenom||"").toLowerCase().includes(texte)

        );

    }

    const statut =
    document.getElementById("filtreStatut")
    ?.value;

    if(statut){

        data=data.filter(r=>r.statut===statut);

    }

    liste.innerHTML="";

    if(data.length===0){

        liste.innerHTML=`
        <p class="center">
            Aucun rapport.
        </p>
        `;

        return;

    }

    data.forEach(r=>{

        let actions = `

<button
class="btn-action btn-consulter"
onclick="consulterRapport(${r.id})">

<i class="fa-solid fa-eye"></i>

</button>

`;

if(r.statut !== "Archivé" || estEtatMajor()){

    actions += `

<button
class="btn-action btn-accepter"
onclick="modifierRapport(${r.id})">

<i class="fa-solid fa-pen"></i>

</button>

`;

}

if(r.statut === "Brouillon"){

    actions += `

<button
class="btn-action"
style="background:#1976d2;color:white"
onclick="envoyerValidation(${r.id})">

<i class="fa-solid fa-paper-plane"></i>

</button>

`;

}

        if(
            utilisateur.etat_major==1 ||
            utilisateur.role==="Sheriff"
        ){

            actions+=`

<button
class="btn-action"
style="background:#2e7d32;color:white"
onclick="validerRapport(${r.id})">

<i class="fa-solid fa-check"></i>

`;

        }

        actions+=`

if(r.statut !== "Archivé" || estEtatMajor()){

    actions += `

if(r.statut !== "Archivé" || estEtatMajor()){

    actions += `

<button
class="btn-action btn-refuser"
onclick="supprimerRapport(${r.id})">

<i class="fa-solid fa-trash"></i>

</button>

`;

}

`;

        liste.innerHTML+=`

<div class="bloc">

<div class="rapport-header">

<div>

<h3>

<i class="fa-solid fa-file-lines"></i>

${r.numero}

</h3>

<p>

<strong>Date :</strong>

${r.date}

|

<strong>Agent :</strong>

${r.agent}

|

<strong>Suspect :</strong>

${r.suspect_nom}

${r.suspect_prenom}

</p>

<p>

<span
class="badge"
style="background:${badge(r.statut)};color:white">

${r.statut}

</span>

</p>

</div>

<div class="actions">

${actions}

</div>

</div>

</div>

`;

    });

}
// ==========================================
// CONSULTER UN RAPPORT
// ==========================================

async function consulterRapport(id){

    try{

        const rep = await fetch(API + "/" + id);

        const rapport = await rep.json();

        rapportEnCours = rapport;

        remplirFormulaire(rapport);

        window.scrollTo({

            top:document.body.scrollHeight,

            behavior:"smooth"

        });

    }

    catch(err){

        console.error(err);

    }

}

// ==========================================
// MODIFIER
// ==========================================

function modifierRapport(id){

    consulterRapport(id);

}

// ==========================================
// REMPLIR LE FORMULAIRE
// ==========================================

function remplirFormulaire(r){

    [
        "numero",
        "date",
        "heure",
        "agent",
        "matricule",
        "grade",
        "unite",
        "suspect_nom",
        "suspect_prenom",
        "telephone",
        "heure_menottage",
        "miranda",
        "heure_miranda",
        "droits_demandes",
        "lieu",
        "fouille",
        "objets_trouves",
        "agents_presents",
        "description",
        "infractions",
        "amende",
        "prison",
        "defcon",
        "statut",
        "validation",
        "commentaire"

    ].forEach(champ=>{

        const element=document.getElementById(champ);

        if(element){

            element.value=r[champ] ?? "";

        }

    });

}

// ==========================================
// NOUVEAU RAPPORT
// ==========================================

function nouveauRapport(){

    rapportEnCours=null;

    document
    .querySelectorAll("input,textarea,select")
    .forEach(el=>{

        if(el.id==="statut"){

            el.value="Brouillon";

        }

        else if(el.type==="number"){

            el.value=0;

        }

        else{

            el.value="";

        }

    });

}

// ==========================================
// ENREGISTRER
// ==========================================

async function enregistrerRapport(){

    const rapport = {

        numero: document.getElementById("numero")?.value || "",

        date: document.getElementById("date")?.value || "",

        heure: document.getElementById("heure")?.value || "",

        agent: document.getElementById("agent")?.value || "",

        matricule: document.getElementById("matricule")?.value || "",

        grade: document.getElementById("grade")?.value || "",

        unite: document.getElementById("unite")?.value || "",

        suspect_nom: document.getElementById("suspect_nom")?.value || "",

        suspect_prenom: document.getElementById("suspect_prenom")?.value || "",

        telephone: document.getElementById("telephone")?.value || "",

        heure_menottage: document.getElementById("heure_menottage")?.value || "",

        miranda: document.getElementById("miranda")?.value || "",

        heure_miranda: document.getElementById("heure_miranda")?.value || "",

        droits_demandes: document.getElementById("droits_demandes")?.value || "",

        lieu: document.getElementById("lieu")?.value || "",

        fouille: document.getElementById("fouille")?.value || "",

        objets_trouves: document.getElementById("objets_trouves")?.value || "",

        agents_presents: document.getElementById("agents_presents")?.value || "",

        description: document.getElementById("description")?.value || "",

        infractions: document.getElementById("infractions")?.value || "",

        amende: Number(document.getElementById("amende")?.value || 0),

        prison: Number(document.getElementById("prison")?.value || 0),

        defcon: document.getElementById("defcon")?.value || "DEFCON 5",

        statut: document.getElementById("statut")?.value || "Brouillon",

        validation: document.getElementById("validation")?.value || "",

        commentaire: document.getElementById("commentaire")?.value || "",

        texte_final: ""

    };

    let url = API;

    let methode = "POST";

    if (rapportEnCours) {

        url += "/" + rapportEnCours.id;

        methode = "PUT";

    }

    try {

        const reponse = await fetch(url, {

            method: methode,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(rapport)

        });

        const resultat = await reponse.json();

        alert(resultat.message);

        rapportEnCours = null;

        chargerRapports();

        nouveauRapport();

    }

    catch (erreur) {

        console.error(erreur);

        alert("Erreur lors de l'enregistrement.");

    }

}

// ==========================================
// SUPPRIMER
// ==========================================

async function supprimerRapport(id){

    if(!confirm("Supprimer ce rapport ?"))

        return;

    await fetch(API+"/"+id,{

        method:"DELETE"

    });

    chargerRapports();

}
// ==========================================
// ENVOYER À L'ÉTAT-MAJOR
// ==========================================

async function envoyerValidation(id){

    if(!confirm("Envoyer ce rapport à l'État-Major ?"))
        return;

    try{

        const rep = await fetch(API + "/" + id + "/envoyer",{

            method:"PUT"

        });

        const resultat = await rep.json();

        alert(resultat.message);

        chargerRapports();

    }

    catch(err){

        console.error(err);

        alert("Erreur lors de l'envoi.");

    }

}

// ==========================================
// VALIDER
// ==========================================

async function validerRapport(id){

    if(!(utilisateur.etat_major==1 ||
         utilisateur.role==="Sheriff")){

        alert("Accès réservé à l'État-Major.");

        return;

    }

    const commentaireValidation = prompt(
        "Commentaire de validation (facultatif) :",
        ""
    );

    try{

        const rep = await fetch(API + "/" + id + "/valider",{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                validateur:
                    utilisateur.username ||
                    utilisateur.nom ||
                    "État-Major",

                commentaire:
                    commentaireValidation || ""

            })

        });

        const resultat = await rep.json();

        alert(resultat.message);

        chargerRapports();

    }

    catch(err){

        console.error(err);

        alert("Erreur lors de la validation.");

    }

}

// ==========================================
// ARCHIVER
// ==========================================

async function archiverRapport(id){

    if(!(utilisateur.etat_major==1 ||
         utilisateur.role==="Sheriff")){

        alert("Accès réservé à l'État-Major.");

        return;

    }

    if(!confirm("Archiver définitivement ce rapport ?"))
        return;

    try{

        const rep = await fetch(API + "/" + id + "/archiver",{

            method:"PUT"

        });

        const resultat = await rep.json();

        alert(resultat.message);

        chargerRapports();

    }

    catch(err){

        console.error(err);

        alert("Erreur lors de l'archivage.");

    }

}

// ==========================================
// DROITS
// ==========================================

function estEtatMajor(){

    return (

        utilisateur.etat_major == 1 ||

        utilisateur.role === "Sheriff"

    );

}

// ==========================================
// VERROUILLAGE
// ==========================================

function rapportVerrouille(rapport){

    return rapport.statut === "Archivé";

}

function peutModifier(rapport){

    if(estEtatMajor())
        return true;

    return !rapportVerrouille(rapport);

}
// ==========================================
// GÉNÉRATION DU RAPPORT OFFICIEL
// ==========================================

function genererRapport() {

    const valeur = (id) =>
        document.getElementById(id)?.value || "";

    const texte = `

=========================================
          BCSO - RAPPORT OFFICIEL
=========================================

N° Rapport : ${valeur("numero")}

Date : ${valeur("date")}

Heure : ${valeur("heure")}

-----------------------------------------

AGENT

Nom : ${valeur("agent")}

Matricule : ${valeur("matricule")}

Grade : ${valeur("grade")}

Unité : ${valeur("unite")}

-----------------------------------------

SUSPECT

Nom : ${valeur("suspect_nom")}

Prénom : ${valeur("suspect_prenom")}

Téléphone : ${valeur("telephone")}

-----------------------------------------

INTERVENTION

Lieu :
${valeur("lieu")}

Description :

${valeur("description")}

-----------------------------------------

ARRESTATION

Heure du menottage :
${valeur("heure_menottage")}

Lecture Miranda :
${valeur("heure_miranda")}

Droits Miranda :

${valeur("miranda")}

Droits demandés :

${valeur("droits_demandes")}

-----------------------------------------

FOUILLE

${valeur("fouille")}

Objets trouvés :

${valeur("objets_trouves")}

-----------------------------------------

AGENTS PRÉSENTS

${valeur("agents_presents")}

-----------------------------------------

INFRACTIONS

${valeur("infractions")}

Amende :

${valeur("amende")}$

Prison :

${valeur("prison")} mois

-----------------------------------------

DEFCON

${valeur("defcon")}

-----------------------------------------

STATUT

${valeur("statut")}

Validation :

${valeur("validation")}

Commentaires :

${valeur("commentaire")}

=========================================

`;

    const contenu = document.getElementById("contenuRapport");

    if (contenu) {

        contenu.innerHTML = `<pre>${texte}</pre>`;

    }

    return texte;

}
// ==========================================
// OUVRIR LE MODAL
// ==========================================

function ouvrirRapport() {

    genererRapport();

    const modal = document.getElementById("modalRapport");

    if (modal) {

        modal.classList.remove("hidden");

    }

}

// ==========================================
// FERMER LE MODAL
// ==========================================

function fermerRapport() {

    const modal = document.getElementById("modalRapport");

    if (modal) {

        modal.classList.add("hidden");

    }

}

// ==========================================
// IMPRESSION
// ==========================================

function imprimerRapport() {

    genererRapport();

    window.print();

}

// ==========================================
// EXPORT JSON
// ==========================================

function exporterRapports() {

    const blob = new Blob(

        [JSON.stringify(rapports, null, 4)],

        {

            type: "application/json"

        }

    );

    const lien = document.createElement("a");

    lien.href = URL.createObjectURL(blob);

    lien.download = "rapports_bcso.json";

    lien.click();

}

// ==========================================
// ACTUALISATION AUTOMATIQUE
// ==========================================

setInterval(() => {

    chargerRapports();

},30000);