/* =====================================
   BCSO MANAGER - ARMURERIE
   Gestion + Permissions
===================================== */


let armes = [];
const imagesArmes = {
    "Glock 17": "images/armes/glock17.png",
    "M4": "images/armes/m4.png",
    "Taser": "images/armes/taser.png",
    "Matraque": "images/armes/matraque.png"
};
let armeEnModification = null;


// ==============================
// DROITS UTILISATEUR
// ==============================

function estCommandement() {


    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if (!utilisateur) return false;



    const roles = [

        "Sheriff",
        "Undersheriff",
        "Captain"

    ];



    return roles.includes(
        utilisateur.role
    );


}



// ==============================
// INITIALISATION
// ==============================

window.onload = () => {

    chargerArmes();

    const boutonAjouter = document.querySelector(".btn-principal");

    if (boutonAjouter && !estCommandement()) {
        boutonAjouter.style.display = "none";
    }

    const formulaire = document.getElementById("formArme");

    if (formulaire) {
        formulaire.addEventListener("submit", enregistrerArme);
    }

};



// ==============================
// CHARGER LES ARMES
// ==============================

async function chargerArmes() {


    try {


        const reponse = await fetch(
            "http://localhost:3000/api/armes"
        );


        armes =
            await reponse.json();



        afficherArmes();



    } catch (erreur) {


        console.error(
            "Erreur chargement armurerie :",
            erreur
        );


    }


}
// ==============================
// AFFICHER LES ARMES
// ==============================

function afficherArmes() {

    const liste = document.getElementById("listeArmes");

    if (!liste) return;

    liste.innerHTML = "";

    if (armes.length === 0) {

        liste.innerHTML = `
            <p class="center">
                Aucune arme enregistrée.
            </p>
        `;

        return;

    }

    armes.forEach(arme => {
console.log(arme.nom);
      let actions = `
    <button class="btn-action btn-consulter"
        onclick="consulterArme(${arme.id})"
        title="Consulter">
        <i class="fa-solid fa-eye"></i>
    </button>

    <button class="btn-action btn-distribuer"
        onclick="ouvrirAttribution(${arme.id})"
        title="Attribuer à un agent">
        <i class="fa-solid fa-user-plus"></i>
    </button>
`;

        if (estCommandement()) {

            actions += `
                <button class="btn-action btn-accepter"
                    onclick="modifierArme(${arme.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="btn-action btn-refuser"
                    onclick="supprimerArme(${arme.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

        }

        // Association des images
        const imageArme = {
    "Glock": "glock17.png",
    "M4": "m4.png",
    "Remington 870": "remington870.png",
    "SMG": "smg.png",
    "tazer": "tazer.png",
    "Taser": "taser.png",
    "Matraque": "matraque.png"
};


        const image = imageArme[arme.nom] || "default.png";

        liste.innerHTML += `

        <div class="arme-card">

            <img src="images/armes/${image}"
                 onerror="this.src='images/armes/default.png'">

            <h3>${arme.nom || ""}</h3>

            <span class="badge">${arme.type || ""}</span>

            <p>
                <strong>Calibre :</strong>
                ${arme.calibre || ""}
            </p>

            <p>
                <strong>Stock :</strong>
                ${arme.quantite || 0}
            </p>

            <div class="actions">
                ${actions}
            </div>

        </div>

        `;

    });

}



// ==============================
// CONSULTER UNE ARME
// ==============================

function consulterArme(id) {


    const arme =
        armes.find(
            a => a.id === id
        );


    if (!arme) return;



    alert(

        `Arme : ${arme.nom}`

    );


}
// ==============================
// OUVRIR MODAL AJOUT ARME
// ==============================

function ajouterArme() {


    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }



    armeEnModification = null;



    document
        .getElementById("formArme")
        .reset();



    document
        .getElementById("modalArme")
        .classList
        .remove("hidden");


}





// ==============================
// FERMER MODAL
// ==============================

function fermerModalArme() {


    document
        .getElementById("modalArme")
        .classList
        .add("hidden");


    armeEnModification = null;


}





// ==============================
// ENREGISTRER UNE ARME
// ==============================

async function enregistrerArme(e) {


    e.preventDefault();



    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }





    const arme = {


        nom:
            document.getElementById("nomArme").value,


        type:
            document.getElementById("typeArme").value,


        calibre:
            document.getElementById("calibreArme").value,


        quantite:
            document.getElementById("quantiteArme").value



    };





    const url = armeEnModification

        ? `http://localhost:3000/api/armes/${armeEnModification.id}`

        : "http://localhost:3000/api/armes";





    const methode = armeEnModification

        ? "PUT"

        : "POST";





    try {



        const reponse = await fetch(

            url,

            {

                method: methode,


                headers: {

                    "Content-Type": "application/json"

                },


                body:
                    JSON.stringify(arme)

            }

        );





        if (!reponse.ok) {


            throw new Error();


        }





        fermerModalArme();


        chargerArmes();




        alert(
            "Arme enregistrée."
        );





    } catch (erreur) {


        console.error(erreur);


        alert(
            "Erreur armurerie."
        );


    }


}





// ==============================
// MODIFIER UNE ARME
// ==============================

function modifierArme(id) {


    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }





    armeEnModification =
        armes.find(
            a => a.id === id
        );



    if (!armeEnModification) return;




    document.getElementById("nomArme").value =
        armeEnModification.nom || "";



    document.getElementById("typeArme").value =
        armeEnModification.type || "";



    document.getElementById("calibreArme").value =
        armeEnModification.calibre || "";



    document.getElementById("quantiteArme").value =
        armeEnModification.quantite || 0;




    document
        .getElementById("modalArme")
        .classList
        .remove("hidden");


}





// ==============================
// SUPPRIMER UNE ARME
// ==============================

async function supprimerArme(id) {


    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }





    if (
        !confirm(
            "Supprimer cette arme ?"
        )
    ) return;





    try {



        const reponse = await fetch(

            `http://localhost:3000/api/armes/${id}`,

            {

                method: "DELETE"

            }

        );





        if (!reponse.ok) {


            throw new Error();


        }





        chargerArmes();



        alert(
            "Arme supprimée."
        );





   } catch (erreur) {

    console.error(erreur);

    alert("Impossible de supprimer.");

}

} // <-- fin de supprimerArme()



// ==============================
// OUVRIR ATTRIBUTION
// ==============================

async function ouvrirAttribution(id){

    document.getElementById("armeSelectionnee").value = id;

    const select = document.getElementById("agentSelection");

    select.innerHTML = "";

    try{

        const reponse = await fetch("http://localhost:3000/api/agents");

        const agents = await reponse.json();

        agents.forEach(agent => {

            select.innerHTML += `
                <option value="${agent.id}">
                    ${agent.matricule} - ${agent.nom} (${agent.grade})
                </option>
            `;

        });

    }catch(e){

        console.error(e);

    }

    document
        .getElementById("modalAttribution")
        .classList
        .remove("hidden");

}



// ==============================
// FERMER ATTRIBUTION
// ==============================

function fermerAttribution(){

    document
        .getElementById("modalAttribution")
        .classList
        .add("hidden");

}



// ==============================
// ATTRIBUER UNE ARME
// ==============================

async function attribuerArme() {

    const agent_id = document.getElementById("agentSelection").value;

    const arme_id = document.getElementById("armeSelectionnee").value;

    const quantite = Number(
        document.getElementById("quantiteAttribution").value
    );

    try {

        const reponse = await fetch(
            "http://localhost:3000/api/attributions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    agent_id,

                    arme_id,

                    quantite

                })

            }
        );

        const resultat = await reponse.json();

        if (!reponse.ok) {

            alert(resultat.message);

            return;

        }

        alert("✅ Arme attribuée avec succès.");

        fermerAttribution();

        chargerArmes();

    } catch (erreur) {

        console.error(erreur);

        alert("Erreur lors de l'attribution.");

    }

}