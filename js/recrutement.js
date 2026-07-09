/* =====================================
   BCSO MANAGER - RECRUTEMENT V2
===================================== */

let candidatures = [];

// =====================================
// INITIALISATION
// =====================================

window.onload = () => {

    chargerDepuisServeur();

};

// =====================================
// CHARGER
// =====================================

function chargerCandidatures(){

    const data = localStorage.getItem("candidatures");

    if(data){

        candidatures = JSON.parse(data);

    }

}

// =====================================
// SAUVEGARDER
// =====================================

function sauvegarder(){

    localStorage.setItem("candidatures", JSON.stringify(candidatures));

}

// =====================================
// ENVOYER UNE CANDIDATURE
// =====================================

function envoyerCandidature(){

    const candidature = {

        nom: document.getElementById("nom").value,

        age: document.getElementById("age").value,

        discord: document.getElementById("discord").value,

        tempsJeu: document.getElementById("tempsJeu").value,

        disponibilite: document.getElementById("disponibilite").value,

        q1: document.getElementById("q1").value,
        q2: document.getElementById("q2").value,
        q3: document.getElementById("q3").value,
        q4: document.getElementById("q4").value,
        q5: document.getElementById("q5").value,
        q6: document.getElementById("q6").value,
        q7: document.getElementById("q7").value,
        q8: document.getElementById("q8").value,
        q9: document.getElementById("q9").value,
        q10: document.getElementById("q10").value,

        statut:"En attente",

        date:new Date().toLocaleString("fr-FR")

    };

    if(candidature.nom === "" || candidature.age === ""){

        alert("Merci de remplir au minimum le nom RP et l'âge.");

        return;

    }

fetch("/api/candidatures", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(candidature)

})
.then(response => response.json())
.then(data => {

    alert("✅ Candidature enregistrée !");

    viderFormulaire();

    chargerDepuisServeur();

})
.catch(error => {

    console.error(error);

    alert("Erreur lors de l'envoi.");

});

}

// =====================================
// VIDER LE FORMULAIRE
// =====================================

function viderFormulaire(){

    document.querySelectorAll("input, textarea").forEach(champ=>{

        champ.value="";

    });

}// =====================================
// AFFICHAGE DES CANDIDATURES
// =====================================

function afficherCandidatures(){

    const liste = document.getElementById("listeCandidatures");

    liste.innerHTML = "";

    if(candidatures.length === 0){

        liste.innerHTML = `
            <p class="center">
                Aucune candidature pour le moment.
            </p>
        `;

        return;

    }

    candidatures.forEach((candidature,index)=>{

        let couleur = "#facc15";

        if(candidature.statut === "Acceptée"){
            couleur = "#22c55e";
        }

        if(candidature.statut === "Refusée"){
            couleur = "#ef4444";
        }

        liste.innerHTML += `

        <div class="card-candidature">

            <div>

                <strong>${candidature.nom}</strong>

                <br>

                <small>${candidature.date}</small>

                <br>

                <span class="badge badge-${candidature.statut.replace(" ", "").toLowerCase()}">
    ${candidature.statut}
</span>

            </div>

            <div class="actions">

    <button class="btn-action btn-consulter"
        onclick="voirCandidature(${index})">

        <i class="fa-solid fa-eye"></i>
        Consulter

    </button>

    <button class="btn-action btn-accepter"
        onclick="accepterCandidature(${index})">

        <i class="fa-solid fa-check"></i>
        Accepter

    </button>

    <button class="btn-action btn-refuser"
        onclick="refuserCandidature(${index})">

        <i class="fa-solid fa-xmark"></i>
        Refuser

    </button>

    <button class="btn-action btn-supprimer"
        onclick="supprimerCandidature(${index})">

        <i class="fa-solid fa-trash"></i>

    </button>

</div>

        </div>

        `;

    });

}

// =====================================
// STATISTIQUES
// =====================================

function mettreAJourStats(){

    let attente = 0;
    let acceptees = 0;
    let refusees = 0;

    candidatures.forEach(c=>{

        if(c.statut==="En attente") attente++;

        if(c.statut==="Acceptée") acceptees++;

        if(c.statut==="Refusée") refusees++;

    });

    document.getElementById("totalCandidatures").textContent = candidatures.length;

    document.getElementById("attente").textContent = attente;

    document.getElementById("acceptees").textContent = acceptees;

    document.getElementById("refusees").textContent = refusees;

}// =====================================
// CONSULTER UNE CANDIDATURE
// =====================================

function voirCandidature(index){

    const c = candidatures[index];

    document.getElementById("contenuModal").innerHTML = `

        <div class="fiche-candidat">

            <h3>${c.nom}</h3>

            <p><strong>Âge :</strong> ${c.age}</p>

            <p><strong>Discord :</strong> ${c.discord}</p>

            <p><strong>Temps de jeu :</strong> ${c.tempsJeu}</p>

            <p><strong>Disponibilités :</strong> ${c.disponibilite}</p>

            <hr>

            <h4>Questionnaire</h4>

            <p><strong>1.</strong> ${c.q1}</p>
            <p><strong>2.</strong> ${c.q2}</p>
            <p><strong>3.</strong> ${c.q3}</p>
            <p><strong>4.</strong> ${c.q4}</p>
            <p><strong>5.</strong> ${c.q5}</p>
            <p><strong>6.</strong> ${c.q6}</p>
            <p><strong>7.</strong> ${c.q7}</p>
            <p><strong>8.</strong> ${c.q8}</p>
            <p><strong>9.</strong> ${c.q9}</p>
            <p><strong>10.</strong> ${c.q10}</p>

        </div>

    `;

    document.getElementById("modalCandidature")
        .classList.remove("hidden");

}function fermerModal(){

    document
        .getElementById("modalCandidature")
        .classList.add("hidden");

}

// =====================================
// ACCEPTER
// =====================================

async function accepterCandidature(index){

    const candidature = candidatures[index];

    await fetch(`/api/candidatures/${candidature.id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            statut:"Acceptée"
        })

    });

    chargerDepuisServeur();

}

// =====================================
// REFUSER
// =====================================

async function refuserCandidature(index){

    const candidature = candidatures[index];

    await fetch(`/api/candidatures/${candidature.id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            statut:"Refusée"
        })

    });

    chargerDepuisServeur();

}

// =====================================
// SUPPRIMER
// =====================================

async function supprimerCandidature(index){

    if(!confirm("Supprimer cette candidature ?"))
        return;

    const candidature = candidatures[index];

    await fetch(`/api/candidatures/${candidature.id}`,{

        method:"DELETE"

    });

    chargerDepuisServeur();

}
// =====================================
// CHARGER LES CANDIDATURES DEPUIS LE SERVEUR
// =====================================

async function chargerDepuisServeur() {

    try {

        const reponse = await fetch("/api/candidatures");

        candidatures = await reponse.json();

        afficherCandidatures();

        mettreAJourStats();

    } catch (erreur) {

        console.error("Erreur :", erreur);

    }

}

